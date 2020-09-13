import * as constants from '../constants';

const fetch = require('node-fetch');

export default class AppsflyerService {

  private readonly URL_IOS = 'https://api2.appsflyer.com/inappevent/id1359805410';
  private readonly URL_ANDROID = 'https://api2.appsflyer.com/inappevent/com.LaMark.DisneyStorytime';

  async sendAppsflyerEvent(event_name: string, revenue: number | string, currency: string,
                           packageId: string, appsFlyerId: string, platform: 'ios' | 'android') {

    const headers = {
      'authentication': constants.APPSFLYER_KEY,
      'Host': 'api2.appsflyer.com',
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };

    const eventValue = {
      af_revenue: revenue,
      af_content_id: packageId,
    };

    const body = {
      "appsflyer_id": appsFlyerId,
      "eventName": event_name,
      "eventValue": JSON.stringify(eventValue),
      "eventCurrency": currency,
      "af_events_api": "true",
    };

    const url = platform === 'ios' ? this.URL_IOS : this.URL_ANDROID;

    try {
      console.log('Sending event to appsflyer with body = ', body);
      console.log('Sending event to appsflyer with headers = ', headers);
      const response = await fetch(url, { method: 'POST', body: JSON.stringify(body), headers: headers });
      console.log('Appsflyer response code =', response.status);
    } catch (e) {
      console.log(`An error has occurred while sending response to Appsflyer ${e.toString()}`);
    }

  }

}
