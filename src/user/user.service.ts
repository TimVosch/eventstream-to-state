import { Injectable, Inject } from '@nestjs/common';
import { Kafka, Consumer, Producer } from 'kafkajs';
import { User } from './entities/user.entity';
import { UserCreatedEvent } from './events/userCreated.event';
import { v4 as uuid } from 'uuid';
import { CreateUserDTO } from './dto/createUser.dto';

@Injectable()
export class UserService {
  private readonly consumer: Consumer;
  private readonly producer: Producer;

  constructor(@Inject('KAFKA') private readonly kafka: Kafka) {
    this.consumer = kafka.consumer({
      groupId: 'UserService',
    });
    this.consumer.connect();
    this.producer = kafka.producer();
    this.producer.connect();
  }

  async createUser(dto: CreateUserDTO): Promise<User> {
    const user = new User(uuid(), dto.username, dto.bio, 100);

    // Commit to event log
    const event = new UserCreatedEvent(user);
    await this.producer.send({
      topic: 'userEvents',
      messages: [
        {
          value: JSON.stringify(event),
        },
      ],
    });

    return user;
  }
}
