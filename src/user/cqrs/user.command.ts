import { Injectable, Inject, BeforeApplicationShutdown } from '@nestjs/common';
import { Kafka, Producer } from 'kafkajs';
import { UserCreatedEvent } from '../events/userCreated.event';
import { User } from '../entities/user.entity';

@Injectable()
export class UserCommand implements BeforeApplicationShutdown {
  private readonly TOPIC = 'userEvents';
  private readonly producer: Producer;

  constructor(@Inject('KAFKA') kafka: Kafka) {
    this.producer = kafka.producer();
    this.producer.connect();
  }

  beforeApplicationShutdown() {
    this.producer.disconnect();
  }

  /**
   *
   */
  async create(user: User): Promise<UserCreatedEvent> {
    // Commit to event log
    const event = new UserCreatedEvent(user);
    await this.producer.send({
      topic: this.TOPIC,
      messages: [
        {
          value: JSON.stringify(event),
        },
      ],
    });
    return event;
  }
}
