import { BaseEvent } from 'src/events/base.event';
import { User } from '../entities/user.entity';

export class CreateUserEvent extends BaseEvent {
  body: any;

  constructor(user: User) {
    super('CREATE_USER');
    this.body = user;
  }
}
