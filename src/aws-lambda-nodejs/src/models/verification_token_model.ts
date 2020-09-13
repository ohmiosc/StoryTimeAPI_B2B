import { randomUUIDV4 } from '../lib/generator';

export interface IVerificationToken {
  id: string;
  email: string;
  userid: string;
  useridlist: string[];
  creationDate: string;
  validUntilDate: string;
  active: boolean;
  language: string;
  type: string;
}

export class VerificationToken implements IVerificationToken{
  active: boolean;
  creationDate: string;
  email: string;
  id: string;
  language: string;
  type: string;
  userid: string;
  useridlist: string[];
  validUntilDate: string;

  constructor() {
    this.id = randomUUIDV4();
  }
}
