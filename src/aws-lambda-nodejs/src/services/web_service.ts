import { Injectable } from '@nestjs/common';
import { SESEmailSenderResponse, SESEmailSender } from '../lib/ses_email_sender';
import { IValidator, validateEmail, validateInput } from '../lib/validator';
import * as constants from '../constants';
import { ReCAPTCHAValidator } from '../lib/recaptcha_validator';
import { MandrillClient } from '../lib/mandrill_client';
import { errorResponse, ErrorResponse } from '../responses/error_response';

@Injectable()
export class WebService {

  private sesEmailSender: SESEmailSender;
  private captchaValidator: ReCAPTCHAValidator;
  private mandrillClient: MandrillClient;

  constructor() {
    this.sesEmailSender = new SESEmailSender();
    this.captchaValidator = new ReCAPTCHAValidator();
    this.mandrillClient = new MandrillClient();
  }

  public async sendContactUsEmail(input: any): Promise<SESEmailSenderResponse | ErrorResponse> {
    const inputValidator: IValidator = validateInput(['name', 'email', 'message', 'token', 'lang'], input);

    if (!inputValidator.isValid) {
      return errorResponse(constants.BAD_REQUEST.statusCode,
        constants.BAD_REQUEST.status, inputValidator.message);
    }

    const { message, name, email, token, lang} = input;
    const emailValidator = validateEmail(email);

    if (!emailValidator.isValid) {
      return errorResponse(constants.BAD_REQUEST.statusCode,
        constants.BAD_REQUEST.status, emailValidator.message);
    }

    const isCaptchaTokenValid = await this.captchaValidator.validateReCAPTCHA(token);

    if (!isCaptchaTokenValid) {
      return errorResponse(constants.BAD_REQUEST.statusCode,
        constants.BAD_REQUEST.status, 'ReCAPTCHA token is not valid');
    }

    const composedMessage = this.composeMessage(message, name, email);
    const template = this.defineTemplateByLanguage(lang);
    await this.mandrillClient.sendMail(constants.CONTACT_US_WEB_EMAIL_SUBJECT, template, email);
    const response: SESEmailSenderResponse = await this.sesEmailSender.sendTextEmail(constants.CONTACT_US_SENDER_EMAIL,
      constants.CONTACT_US_RECIPIENT_EMAIL, composedMessage, constants.WEB_CONTACT_US_SUBJECT);

    return response;

  }

  private composeMessage(messageBody: string, recipientName: string, recipientEmail: string) {
    let message = messageBody + '\n';
    message += '\n';
    message += recipientName + ',' + '\n';
    message += recipientEmail;
    return message;
  }

  private defineTemplateByLanguage(lang) {
    let template = constants.CONTACT_US_WEB_TEMPLATE_PT;

    switch (lang) {
      case 'en':
        template = constants.CONTACT_US_WEB_TEMPLATE_EN;
        break;
      case 'es':
        template = constants.CONTACT_US_WEB_TEMPLATE_ES;
        break;
    }

    return template;
  }
}
