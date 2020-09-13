export interface ISignUpProcess {
    isSigned: number;
    date: string;
}

export class SignUpProcess implements ISignUpProcess {

    isSigned: number;
    date: string;

    constructor(isSigned: number, date: string) {
        this.isSigned = isSigned;
        this.date = date;
    }
}
