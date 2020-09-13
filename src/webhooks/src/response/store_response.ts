

export class StoreResponse {
  private _status: number;
  private _message?: string;

  constructor(status: number, message?: string) {
    this._status = status;
    this._message = message;
  }

  get status(): number {
    return this._status;
  }

  get message(): string {
    return this._message;
  }


  set status(value: number) {
    this._status = value;
  }

  set message(value: string) {
    this._message = value;
  }
}
