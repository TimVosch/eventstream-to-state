import { Injectable } from '@nestjs/common';
import { UserQuery } from './user.query';
import { UserCommand } from './user.command';
import { User } from '../entities/user.entity';
import { MutateUserCreditEvent } from '../events/mutateUserCredit.event';
import { CreateUserEvent } from '../events/createUser.event';

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
  async create(user: User): Promise<CreateUserEvent> {
    return this.command.create(user);
  }

  /**
   * Mutate a user its credit
   * @param userId The user
   * @param amount The mutation amount
   */
  async mutateCredit(
    userId: string,
    amount: number,
  ): Promise<MutateUserCreditEvent> {
    return this.command.mutateCredit(userId, amount);
  }

  /**
   * Get a user by its id
   * @param id the id of the user
   */
  async get(id: string): Promise<User> {
    return this.query.get(id);
  }
}
