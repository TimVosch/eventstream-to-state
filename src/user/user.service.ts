import { Injectable, Inject } from '@nestjs/common';
import { Kafka, Consumer, Producer } from 'kafkajs';
import { User } from './entities/user.entity';
import { UserCreatedEvent } from './events/userCreated.event';
import { v4 as uuid } from 'uuid';
import { CreateUserDTO } from './dto/createUser.dto';
import { UserSource } from './user.source';

@Injectable()
export class UserService {
  constructor(private readonly source: UserSource) {}

  async createUser(dto: CreateUserDTO): Promise<User> {
    const user = new User(uuid(), dto.username, dto.bio, 100);
    await this.source.create(user);
    return user;
  }
}
