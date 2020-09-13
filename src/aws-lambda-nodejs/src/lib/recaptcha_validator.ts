const fetch = require('node-fetch');

export class ReCAPTCHAValidator {

  private CAPTCHA_SECRET_SHARED_KEY = '6LdNO54UAAAAAItc0LgOxNarb-NfdHpPqTXGgyJC';
  private CAPTCHA_VALIDATION_URL = 'https://www.google.com/recaptcha/api/siteverify';

  public async validateReCAPTCHA(token: string): Promise<boolean> {

    const options: any = {
      method: 'GET',
      mode: 'no-cors',
    };

    const url = this.CAPTCHA_VALIDATION_URL + '?secret=' + this.CAPTCHA_SECRET_SHARED_KEY + '&response=' + token;
    console.log(`Getting info from ReCAPTCHA validation...`);
    try {
      const response = await fetch(url, options);
      const captchaResponse = await response.json();
      console.log('ReCAPTCHA validation response = ', captchaResponse);
      return captchaResponse.success;
    } catch (e) {
      console.log(`An error has occurred while getting response from ReCAPTCHA validation ${e.toString()}`);
      return false;
    }
  }
}
