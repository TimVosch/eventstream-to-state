import { BaseEvent } from 'src/events/base.event';
import { User } from '../entities/user.entity';

export class UserCreatedEvent extends BaseEvent {
  body: any;

  constructor(user: User) {
    super('USER_CREATED');
    this.body = user;
  }
}
