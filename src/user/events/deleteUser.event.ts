import { BaseEvent } from 'src/events/base.event';

export class DeleteUserEvent extends BaseEvent {
  body: {
    userId: string;
  };

  constructor(userId: string) {
    super('DELETE_USER');
    this.body = { userId };
  }
}
