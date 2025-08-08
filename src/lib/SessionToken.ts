import { isServer } from '~/lib/utils';

export class SessionToken {
  private token: string;

  constructor() {
    this.token = '';
  }

  public set value(v: string) {
    if (isServer()) {
      throw new Error('Cannot set token on server side');
    }
    this.token = v;
  }

  public get value(): string {
    return this.token;
  }
}
