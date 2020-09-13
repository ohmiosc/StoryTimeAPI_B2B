const fetch = require('node-fetch');

export class AppleReceiptValidator {

  private SECRET_SHARED_KEY = '961b040b84eb47cfa1fdef68d3f7face';
  private APP_STORE_PROD_URL = 'https://buy.itunes.apple.com/verifyReceipt';
  private APP_STORE_TEST_URL = 'https://sandbox.itunes.apple.com/verifyReceipt';
  private RECEIPT_VALID = 0;
  private RECEIPT_TEST = 21007;

  public async isAppStoreReceiptValid(receipt: string): Promise<boolean> {
    console.log(`App Store receipt validation`);
    let receiptInfo = await this.getReceiptInfo(receipt, this.APP_STORE_PROD_URL);
    let status = receiptInfo.status;
    console.log(`Status = ${status}`);

    if (status === null || status === undefined) {
      return false;
    }

    if (status === this.RECEIPT_VALID) {
      return true;
    }

    if (status === this.RECEIPT_TEST) {
      console.log(`Validation test receipt`);
      receiptInfo = await this.getReceiptInfo(receipt, this.APP_STORE_TEST_URL);
      status = receiptInfo.status;
      console.log(`Status = ${status}`);

      if (status === null) {
        return false;
      }

      if (status === this.RECEIPT_VALID) {
        console.log(`Receipt is valid`);
        return true;
      }
    }
    return false;
  }

  public async getReceiptInfo(receipt: string, url: string): Promise<any> {
    const input = {
      body: {
        'receipt-data': receipt,
        'password': this.SECRET_SHARED_KEY,
      },
    };
    console.log(`Getting receipt info from ITunes...`);
    try {
      const response = await fetch(url, {method: 'POST', body: JSON.stringify(input.body)});
      const receiptInfo = await response.json();
      console.log(`Receipt info = ${JSON.stringify(receiptInfo)}`);
      return receiptInfo;
    } catch (e) {
      console.log(`An error has occurred while getting response from iTunes ${e.toString()}`);
      return null;
    }
  }
}
