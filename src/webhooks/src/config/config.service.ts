import { Injectable } from '@nestjs/common';

export interface IDestination {
  name: string;
  id: string;
}

export interface IConfigService {
  appEnv: string;
  appVersion: string;

  unityAuthorizationToken: string;
  unityApiBase: string;
  unityApiKey: string;

  appCenterAPIKey: string;
  appCenterHost: string;

  getAppCenterDestinations(platform: string): IDestination[];
}

@Injectable()
export class ConfigService implements IConfigService {
  constructor() {}

  public get appEnv(): string {
    return process.env.NODE_ENV;
  }

  public get appVersion(): string {
    return process.env.APP_VERSION;
  }

  public get unityAuthorizationToken(): string {
    return `Token ${process.env.UNITYCLOUD_AUTHORIZATION_TOKEN}`;
  }

  public get unityApiBase(): string {
    return process.env.UNITYCLOUD_API_BASE;
  }

  public get unityApiKey(): string {
    return process.env.UNITYCLOUD_API_KEY;
  }

  public get appCenterAPIKey(): string {
    return process.env.APPCENTER_API_KEY;
  }

  public get appCenterHost(): string {
    return process.env.APPCENTER_HOST;
  }

  public getAppCenterDestinations(platform: string): IDestination[] {
    return platform === 'ios' ? [
        {
          id: process.env.IOS_BETA_TESTERS_ID,
          name: 'Beta testers',
        },
      ]
      :
      [
        {
          id: process.env.ANDROID_BETA_TESTERS_ID,
          name: 'Beta testers',
        },
      ];
  }
}

// "id":"6a1811fa-54e5-4fb1-8bfa-361df980af64","name":"Beta testers
