import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { v4 as uuid } from 'uuid';
import { CreateUserDTO } from './dto/createUser.dto';
import { BaseEvent } from 'src/events/base.event';
import { UserQuery } from './cqrs/user.query';
import { UserCommand } from './cqrs/user.command';

@Injectable()
export class UserService {
  constructor(
    private readonly query: UserQuery,
    private readonly command: UserCommand,
  ) {}

  /**
   * Create a new user
   * @param dto
   */
  async createUser(dto: CreateUserDTO): Promise<User> {
    const user = new User(uuid(), dto.username, dto.bio, 100);
    await this.command.create(user);
    return user;
  }

  async deleteUser(userId: string): Promise<BaseEvent> {
    return this.command.delete(userId);
  }

  /**
   * Get a user by its id
   * @param id The id of the user
   */
  async getUser(id: string): Promise<User> {
    return this.query.get(id);
  }

  /**
   * Mutate a users credit by a specific amount
   * @param userId The user
   * @param amount The mutation amount
   */
  async mutateCredit(userId: string, amount: number): Promise<BaseEvent> {
    return this.command.mutateCredit(userId, amount);
  }
}
