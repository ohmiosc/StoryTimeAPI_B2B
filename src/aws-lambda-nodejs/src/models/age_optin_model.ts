export interface IAgeOptIn {
  isSigned: number;
  date: string;
}

export class AgeOptIn implements IAgeOptIn {

  isSigned: number;
  date: string;

  constructor(isSigned: number, date: string) {
    this.isSigned = isSigned;
    this.date = date;
  }
}
