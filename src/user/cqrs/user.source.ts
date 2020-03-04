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

  async create(user: User): Promise<void> {
    this.command.create(user);
  }
}
