export class User {
  constructor(id: string, username: string, bio: string, credit: number) {
    this.id = id;
    this.username = username;
    this.bio = bio;
    this.credit = credit;
  }

  id: string;

  username: string;

  bio: string;

  credit: number;
}
