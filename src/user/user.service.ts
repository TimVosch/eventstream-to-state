import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { v4 as uuid } from 'uuid';
import { CreateUserDTO } from './dto/createUser.dto';
import { UserSource } from './cqrs/user.source';
import { BaseEvent } from 'src/events/base.event';

@Injectable()
export class UserService {
  constructor(private readonly source: UserSource) {}

  /**
   * Create a new user
   * @param dto
   */
  async createUser(dto: CreateUserDTO): Promise<User> {
    const user = new User(uuid(), dto.username, dto.bio, 100);
    await this.source.create(user);
    return user;
  }

  /**
   * Get a user by its id
   * @param id The id of the user
   */
  async getUser(id: string): Promise<User> {
    return this.source.get(id);
  }

  /**
   * Mutate a users credit by a specific amount
   * @param userId The user
   * @param amount The mutation amount
   */
  async mutateCredit(userId: string, amount: number): Promise<BaseEvent> {
    return this.source.mutateCredit(userId, amount);
  }
}
