import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { User } from '../entities/user.entity';

class DuplicateKeyError extends Error {
  constructor(message?: string) {
    super(message || 'Key already exists');
  }
}

class NotFoundError extends Error {
  constructor(message?: string) {
    super(message || 'Entry not found');
  }
}

@Injectable()
export class UserMemory {
  private users: { [index: string]: User } = {};

  insert(user: User) {
    // Generate ID if not given
    if (user.id === undefined || user.id === null) {
      user.id = uuid();
    }

    // If id is already used
    if (this.users[user.id] !== undefined) {
      throw new DuplicateKeyError('A user with given ID already exists');
    }

    // Insert
    this.users[user.id] = user;
  }

  get(id: string): User {
    return this.users[id] || null;
  }

  delete(id: string) {
    delete this.users[id];
  }

  update(user: User): User {
    // Cannot update a user that does not exist
    if (this.get(user.id) === null) {
      throw new NotFoundError(`Cannot find user ${user.id}`);
    }

    // Update
    this.users[user.id] = user;
    return user;
  }
}
