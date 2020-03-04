import { Injectable, Inject, BeforeApplicationShutdown } from '@nestjs/common';
import { Kafka, Consumer, Producer, EachMessagePayload } from 'kafkajs';
import { v4 as uuid } from 'uuid';
import { UserCreatedEvent } from './events/userCreated.event';
import { User } from './entities/user.entity';

@Injectable()
export class UserSource implements BeforeApplicationShutdown {
  private readonly TOPIC = 'userEvents';
  private readonly consumer: Consumer;
  private readonly producer: Producer;

  constructor(@Inject('KAFKA') kafka: Kafka) {
    this.consumer = kafka.consumer({
      groupId: uuid(),
    });
    this.consumer.connect().then(this.startConsumer.bind(this));
    this.producer = kafka.producer();
    this.producer.connect();
  }

  beforeApplicationShutdown() {
    this.consumer.disconnect();
    this.producer.disconnect();
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
    console.log(`Received message ${message.value}`);
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
