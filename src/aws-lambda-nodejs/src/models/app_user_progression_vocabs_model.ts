import { IAppUserProgressionRates } from './app_user_progression_rates_model';
export interface IAppUserProgressionVocabs {
    ID: number;
    rates: Array<IAppUserProgressionRates>;
}

export class AppUserProgressionVocabs implements IAppUserProgressionVocabs{
    ID: number;
    rates: Array<IAppUserProgressionRates>;
}