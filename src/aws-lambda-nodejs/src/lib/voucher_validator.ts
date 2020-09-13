const fetch = require('node-fetch');

export interface IVoucherValidatorAPIResponse  {
  status?: number;
  body?: any;
  message?: string;
}

export class VoucherValidator {

    private readonly VALIDATE_VOUCHER_URL = 'https://222pdwf62i.execute-api.us-east-1.amazonaws.com/PRD/v1/partner-management/triyacom/bundle/subscriptions';

    public async validateVoucher(msisdn: string, voucher: string, operator: string) {
        const body = {
                msisdn: msisdn,
                voucher: voucher,
                operator: operator };

        console.log('Validating voucher with body', JSON.stringify(body));
        const result: IVoucherValidatorAPIResponse = {};
        try {
             const response = await fetch(this.VALIDATE_VOUCHER_URL, {method: 'POST', body: JSON.stringify(body), headers: {
                     'Content-Type': 'application/json'
                 }});
             result.body = await response.json();
             result.status = response.status;
        } catch (e) {
            console.error(e);
            result.message = e.toString();
        }
        console.log('VALIDATE VOUCHER API returns --> ', JSON.stringify(result));
        return result;
    }
}
