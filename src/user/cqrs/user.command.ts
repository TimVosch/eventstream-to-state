import {
  Injectable,
  Inject,
  BeforeApplicationShutdown,
  Logger,
} from '@nestjs/common';
import { Kafka, Producer } from 'kafkajs';
import { CreateUserEvent } from '../events/userCreated.event';
import { User } from '../entities/user.entity';
import { BaseEvent } from 'src/events/base.event';

@Injectable()
export class UserCommand implements BeforeApplicationShutdown {
  private readonly TOPIC = 'USER_EVENTS';
  private readonly producer: Producer;

  constructor(@Inject('KAFKA') kafka: Kafka) {
    this.producer = kafka.producer();
    this.producer.connect();
  }

  beforeApplicationShutdown() {
    this.producer.disconnect();
  }

  async sendEvent(ev: BaseEvent): Promise<void> {
    Logger.log(`Sending EV: ${ev.type}`, 'UserCommand');
    await this.producer.send({
      topic: this.TOPIC,
      messages: [
        {
          value: JSON.stringify(ev),
        },
      ],
    });
  }

  /**
   *
   */
  async create(user: User): Promise<CreateUserEvent> {
    // Commit to event log
    const event = new CreateUserEvent(user);
    await this.sendEvent(event);
    return event;
  }
}
