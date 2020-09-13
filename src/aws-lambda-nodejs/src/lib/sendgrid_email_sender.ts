const fetch = require('node-fetch');
import { ApiModelProperty } from '@nestjs/swagger';
import * as constants from '../constants';

export class SendGridEmailSenderResponse {

  @ApiModelProperty()
  isEmailSent: boolean;

  @ApiModelProperty()
  errorMessage?: string;

  @ApiModelProperty()
  statusCode?: number;

  @ApiModelProperty()
  status?: string;
}

export class SendGridEmailSender {

  constructor() {
  }

  private URL = 'https://api.sendgrid.com/v3/mail/send';

  public async sendTextEmail(senderEmailAddress: string, recipientEmailAddress: string,
                             textMessage: string, subject: string): Promise<SendGridEmailSenderResponse> {

    const input = {
      body: {
        personalizations: [
          {
            to: [
              {
                email: recipientEmailAddress
              }
            ],
            subject: subject
          }
        ],
        from: {
          email: senderEmailAddress
        },
        content: [
          {
            type: 'text/plain',
            value: textMessage
          }
        ]
      },
      headers: {
        'Authorization': `Bearer ${constants.SEND_GRID_KEY}`,
        'Content-Type': 'application/json'
      }
    };

    let response: SendGridEmailSenderResponse = { isEmailSent: true , status: constants.OK.status, statusCode: constants.OK.statusCode};
    try {
      console.log('Sending Send Grid email with params = ', input);
      const sendGridResponse = await fetch(this.URL, {method: 'POST', headers: input.headers, body: JSON.stringify(input.body)});
      const status = await sendGridResponse.status;
      console.log('Send Grid response status = ', status);

      if (status !== 202) {
        response = { isEmailSent: false, errorMessage: 'Send Grid returns wrong statusCode ' + status };
      }

    } catch (e) {
      console.error('SendGrid ERROR', e.toString());
      response = { isEmailSent: false, errorMessage: e.toString() };
    }

    return response;

  }
}
