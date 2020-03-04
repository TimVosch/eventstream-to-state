import {
  Injectable,
  Inject,
  BeforeApplicationShutdown,
  Logger,
} from '@nestjs/common';
import { Kafka, Consumer, EachMessagePayload } from 'kafkajs';
import { v4 as uuid } from 'uuid';
import { plainToClass } from 'class-transformer';
import { CreateUserEvent } from '../events/userCreated.event';
import { User } from '../entities/user.entity';
import { BaseEvent } from 'src/events/base.event';
import { UserMemory } from './user.memory';
import { MutateUserCreditEvent } from '../events/mutateUserCredit.event';

@Injectable()
export class UserQuery implements BeforeApplicationShutdown {
  /**
   * A mapping between event types and their processing functions
   */
  private readonly EVENT_FUNC_MAP = {
    CREATE_USER: this.evCreateUser.bind(this),
    MUTATE_USER_CREDIT: this.evMutateUserCredit.bind(this),
  };

  private readonly TOPIC = 'USER_EVENTS';
  private readonly consumer: Consumer;

  constructor(@Inject('KAFKA') kafka: Kafka, private readonly db: UserMemory) {
    this.consumer = kafka.consumer({
      groupId: uuid(),
    });
    this.consumer.connect().then(this.startConsumer.bind(this));
  }

  beforeApplicationShutdown() {
    this.consumer.disconnect();
  }

  /**
   * Starts the consumer and subscribes to topic(s)
   * Fired when the consumer connects to the kafka server
   */
  private async startConsumer(): Promise<void> {
    //
    await this.consumer.subscribe({
      topic: this.TOPIC,
    });
    //
    await this.consumer.run({
      eachMessage: this.processMessage.bind(this),
    });
    // Start from the very beginning
    this.consumer.seek({
      topic: this.TOPIC,
      offset: '0',
      partition: 0,
    });
  }

  /**
   * Processes previous and incoming events
   * This process will synchronize the in-memory database with the system.
   */
  private processMessage(payload: EachMessagePayload): void {
    const { message } = payload;
    const ev = JSON.parse(message.value.toString()) as BaseEvent;
    Logger.log(`Processing EV: ${ev.type}`, 'UserQuery');

    const processor = this.EVENT_FUNC_MAP[ev.type];
    if (!processor) {
      Logger.error(`No processor found for EV: ${ev.type}`, 'UserQuery');
      return;
    }
    processor(ev);
  }

  //
  // ====================================
  //  Event processors
  // ====================================
  //

  /**
   * Fired when a new user is created
   * @param ev Event
   */
  private evCreateUser(ev: CreateUserEvent): void {
    const user = plainToClass(User, ev.body);
    this.db.insert(user);
  }

  /**
   * Fired when a user's credit is mutate
   * @param ev Event
   */
  private evMutateUserCredit(ev: MutateUserCreditEvent): void {
    const user = this.db.get(ev.body.userId);
    user.credit += ev.body.amount;
    this.db.update(user);
  }

  //
  // ====================================
  //  Public methods
  // ====================================
  //

  /**
   * Get a user by its id
   * @param id The id of the user
   */
  get(id: string): User {
    return this.db.get(id);
  }
}
