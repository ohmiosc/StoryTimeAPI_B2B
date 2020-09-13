export interface ILegal {
  isSigned: number;
  date: string;
}

export class Legal implements ILegal {

  isSigned: number;
  date: string;

  constructor(isSigned: number, date: string) {
    this.isSigned = isSigned;
    this.date = date;
  }
}
