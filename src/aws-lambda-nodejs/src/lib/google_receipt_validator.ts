const google = require('googleapis');
const pub = google.androidpublisher('v2');
import * as constants from '../constants';

export class GoogleReceiptValidator {

  private readonly authClient;

  constructor() {

    this.authClient = new google.auth.JWT(
      constants.GOOGLE_AUTH_CLIENT_EMAIL,
      '',
      constants.GOOGLE_AUTH_PRIVATE_KEY,
      [
        'https://www.googleapis.com/auth/androidpublisher',
      ],
      '',
    );

  }

  private getReceipt = (params) => new Promise((resolve, reject) => {
    pub.purchases.subscriptions.get(params, (error, resp) => {
      error ? reject(JSON.stringify(error.response.data)) : resolve(resp.data);
    });
  })

  private async authorize() {
    console.log('Email = ', constants.GOOGLE_AUTH_CLIENT_EMAIL);
    console.log('Key = ', constants.GOOGLE_AUTH_PRIVATE_KEY);

    try {
      await this.authClient.authorize();
      return true;
    } catch (e) {
      console.log(`Authorization failed`, e.toString());
      return false;
    }
  }

  public async isGooglePlayReceiptValid(inputPackageName: string, inputSubscriptionId: string, purchaseToken: string): Promise<boolean> {
    console.log(`Getting receipt info from Google Play for id ${inputSubscriptionId} and payload ${purchaseToken}`);

    try {
      const isAuthorized = await this.authorize();

      if (!isAuthorized) {
        console.log(`Request is not authorized`);
        return false;
      }

      const params = {
        auth: this.authClient,
        packageName: inputPackageName,
        subscriptionId: inputSubscriptionId,
        token: purchaseToken,
      };

      const receipt: any = await this.getReceipt(params);
      console.log('Google receipt response = ', JSON.stringify(receipt));

      if (!receipt.orderId) {
        console.log(`Subscription ${JSON.stringify(receipt)} was not found in GooglePlay`);
        return false;
      }

      console.log(`Subscription ${JSON.stringify(receipt)} is valid`);
      return true;

    } catch (e) {
      console.log(`An error has occurred while getting response from Google Play ${e.toString()}`);
      return false;
    }
  }

}
