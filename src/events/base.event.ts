export class BaseEvent {
  type: string;
  body: any;

  constructor(type: string) {
    this.type = type;
  }
}
