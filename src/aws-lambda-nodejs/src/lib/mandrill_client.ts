const mandrill = require('mandrill-api/mandrill');

export class MandrillClient {

  private FROM_EMAIL: string = 'automail@kantoo.com';
  private FROM_NAME: string = 'Disney';
  private API_KEY = 'c2fyAPi-hDeo-74A6OGWug';

  private mandrillClient;

  constructor() {
    this.mandrillClient = new mandrill.Mandrill(this.API_KEY);
  }

  public async sendMail(mailSubject: string, templateName: string, targetEmailAddress: string, redirectLink?: string) {

    const emailContent = {
      RESETPASSHASH: redirectLink,
    };

    const emailMessage = {
      subject: mailSubject,
      from_email: this.FROM_EMAIL,
      from_name: this.FROM_NAME,
      to: [{
        email: targetEmailAddress,
        type: 'to',
      }],
      headers: {
        'Reply-To': this.FROM_EMAIL,
      },
      global_merge_vars: this.arrayFromObject(emailContent),
    };

    const template = {
      template_name: templateName,
      template_content: [],
      message: emailMessage,
      async: false,
      ip_pool: 'Main Pool',
    };

    console.log(`Sending email ${JSON.stringify(template)}`);
    return new Promise((resolve, reject) => {
      this.mandrillClient.messages.sendTemplate(template, (result) => {
        resolve(result);
      }, (e) => {
        console.error(`An error has occurred while sending email ${JSON.stringify(template)}`, e.toString());
        reject(e);
      });
    });
  }

  private arrayFromObject(content) {
    const val = [];
    for (const key in content) {
      val.push({ name: key, content: content[key] });
    }
    return val;
  }

}
