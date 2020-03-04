import {
  Injectable,
  Inject,
  BeforeApplicationShutdown,
  Logger,
} from '@nestjs/common';
import { Kafka, Consumer, EachMessagePayload } from 'kafkajs';
import { v4 as uuid } from 'uuid';
import { UserCreatedEvent } from '../events/userCreated.event';
import { User } from '../entities/user.entity';
import { BaseEvent } from 'src/events/base.event';

@Injectable()
export class UserQuery implements BeforeApplicationShutdown {
  /**
   * A mapping between event types and their processing functions
   */
  private readonly EVENT_FUNC_MAP = {
    CREATE_USER: this.evCreateUser.bind(this),
  };

  private readonly TOPIC = 'userEvents';
  private readonly consumer: Consumer;

  constructor(@Inject('KAFKA') kafka: Kafka) {
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
    Logger.log(`Processing EV: ${ev.type}`);

    const processor = this.EVENT_FUNC_MAP[ev.type];
    if (!processor) {
      Logger.error(`No processor found for EV: ${ev.type}`);
      return;
    }
    processor(ev);
  }

  private evCreateUser(ev: UserCreatedEvent): void {
    Logger.log('Creating user...');
  }
}
