import { SES } from 'aws-sdk';
import { SendEmailRequest } from 'aws-sdk/clients/ses';
import { ApiModelProperty } from '@nestjs/swagger';
import * as constants from '../constants';

const options = {
  region: 'us-east-1',
  accessKeyId: process.env.AU_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AU_AWS_SECRET_ACCESS_KEY,
};

export const ses = new SES(options);

export class SESEmailSenderResponse {

  @ApiModelProperty()
  isEmailSent: boolean;

  @ApiModelProperty()
  errorMessage?: string;

  @ApiModelProperty()
  statusCode?: number;

  @ApiModelProperty()
  status?: string;
}

export class SESEmailSender {

  constructor() {
  }

  public async sendTextEmail(senderEmailAddress: string, recipientEmailAddress: string,
                             textMessage: string, subject: string): Promise<SESEmailSenderResponse> {

    const sendEmailRequest: SendEmailRequest = {
      Destination: {
        ToAddresses: [recipientEmailAddress],
      },
      Message: {
        Body: {
          Text: {
            Charset: 'UTF-8',
            Data: textMessage,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: subject,
        },
      },
      Source: senderEmailAddress,
    };

    let response: SESEmailSenderResponse;
    console.log(`SES sending email with request `, JSON.stringify(sendEmailRequest));
    try {
      const messageID = await ses.sendEmail(sendEmailRequest).promise();
      response = { isEmailSent: true , status: constants.OK.status, statusCode: constants.OK.statusCode};
      return response;
    } catch (e) {
      console.error(e.toString());
      response = { isEmailSent: false, errorMessage: e.toString() };
      return response;
    }
  }
}
