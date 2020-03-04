import { Injectable } from '@nestjs/common';
import { UserQuery } from './user.query';
import { UserCommand } from './user.command';
import { User } from '../entities/user.entity';

@Injectable()
export class UserSource {
  constructor(
    private readonly query: UserQuery,
    private readonly command: UserCommand,
  ) {}

  /**
   * Create a new user
   * @param user The user to create
   */
  async create(user: User): Promise<void> {
    this.command.create(user);
  }

  /**
   * Get a user by its id
   * @param id the id of the user
   */
  async get(id: string): Promise<User> {
    return this.query.get(id);
  }
}
