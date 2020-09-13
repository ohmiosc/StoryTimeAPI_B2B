export interface ICountry {
  country: string;
  operatorCode: string;
  siteID: number;
}

export interface IOperator {
  operatorName: string;
  operatorCountries: ICountry[];
}
