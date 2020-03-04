import { BaseEvent } from 'src/events/base.event';

export class MutateUserCreditEvent extends BaseEvent {
  body: {
    userId: string;
    amount: number;
  };

  constructor(userId: string, amount: number) {
    super('MUTATE_USER_CREDIT');
    this.body = { userId, amount };
  }
}
