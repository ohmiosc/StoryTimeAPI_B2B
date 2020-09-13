export class Logger {
  static info(message: string, additionalData?: object) {
    // tslint:disable-next-line:no-console
    additionalData ? console.log(message, additionalData) : console.log(message);
  }
}
