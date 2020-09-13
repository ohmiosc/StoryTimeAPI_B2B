import { Injectable } from '@nestjs/common';
import { errorResponse, ErrorResponse } from '../responses/error_response';
import { AppUserDAO } from '../dao/app_user_dao';
import { LaunchAppResponse, Signed } from '../responses/launch_app_response';
import { DeviceDAO } from '../dao/device_dao';
import { SessionDAO } from '../dao/session_dao';
import { InstallationDAO } from '../dao/installation_dao';
import { LookupBillingDAO } from '../dao/lookup_billing_dao';
import * as constants from '../constants';
import { formatCurrentDate, timestampWithSixDigits } from '../lib/generator';
import { Logger } from '../lib/logger';
import { GuestAppUser, IAppUser, ILocation, IProduct } from '../models/app_user_model';
import { getLocation } from '../lib/ip_geolocation';
import { publicIP } from '../index';
import { ILookupBilling, IProvider } from '../models/lookup_billing_model';
import { ISession, Session } from '../models/session_model';
import { Device, IDevice } from '../models/device_model';
import { LookupCountryDAO } from '../dao/lookup_country_dao';
import { Installation } from '../models/installation_model';
import { isEmpty, IValidator, validateInput } from '../lib/validator';
import { LookupCountry } from '../models/lookup_country_model';
import { ClientVersionDAO } from '../dao/client_version_dao';
import { ClientVersion } from '../models/client_version_model';
import { ProductDAO } from '../dao/product_dao';
import { IProductModel } from '../models/product_model';

@Injectable()
export class LaunchAppService {
  constructor(
    private appUserDao: AppUserDAO,
    private deviceDAO: DeviceDAO,
    private sessionDao: SessionDAO,
    private installationDAO: InstallationDAO,
    private lookupBillingDAO: LookupBillingDAO,
    private lookupCountryDAO: LookupCountryDAO,
    private clientVersionDAO: ClientVersionDAO,
    private productDAO: ProductDAO
  ) {
  }

  public async launchApp(
    input: any
  ): Promise<LaunchAppResponse | ErrorResponse> {
    if (publicIP === null || publicIP === void 0) {
      return errorResponse(
        constants.BAD_REQUEST.statusCode,
        constants.BAD_REQUEST.status,
        'ipAddress is empty'
      );
    }
    const inputValidator: IValidator = validateInput(['productID', 'deviceID',
      'appVersion', 'deviceModel', 'deviceOS', 'platform'], input);

    if (!inputValidator.isValid) {
      return errorResponse(constants.BAD_REQUEST.statusCode,
        constants.BAD_REQUEST.status, inputValidator.message);
    }

    const sessionID = timestampWithSixDigits();
    const location: ILocation = await getLocation(publicIP);
    const contentVersion = await this.defineContentVersion(input.appVersion);

    const lookUpBilling: ILookupBilling = await this.lookupBillingDAO.getItemByGSI(
      constants.LOOKUP_BILLING_TABLE,
      'detectedCountry-index',
      'detectedCountry = :v1',
      { ':v1': location.country }
    );
    if (lookUpBilling === null) {
      console.log(`No operators found for ${location.country}`);
    }

    let ageOptin: Signed;
    let signUpProcess: Signed;
    let legal: Signed;
    let appUser: IAppUser;
    let isDeviceChanged: boolean = false;

    if (input.appUserID.length > 0) {
      try {
        console.log(`Trying to find user with id = ${input.appUserID} in DB`);
        appUser = await this.appUserDao.getItemByGSI(
          constants.APP_USER_TABLE,
          'id-index',
          'id = :v1',
          { ':v1': input.appUserID }
        );

        if (appUser !== null) {
          Logger.info('appuser:', appUser);
          if (input.deviceID !== appUser.deviceID) {
            Logger.info(
              `Users's device ids are not equal : ${input.deviceID} !== ${
                appUser.deviceID
                }`
            );
            appUser.deviceID = input.deviceID;
            Logger.info(`AppUser with new device id = ${input.deviceID}`);
            isDeviceChanged = true;
          }

          if (this.isIPAddressNew(publicIP, appUser.location)) {
            Logger.info(`ipAddress has been changed. Updating location ...`);
            const newLocationsList: ILocation[] = this.getUpdatedLocation(
              location,
              appUser.location
            );
            appUser.location = newLocationsList;
            Logger.info(
              `AppUser with new location list = ${JSON.stringify(appUser)}`
            );
          }

          if (lookUpBilling === null) {
            appUser.operatorsList = [];
          } else {
            appUser.operatorsList = lookUpBilling.provider;
          }

          const session: ISession = new Session(
            sessionID,
            appUser.id,
            appUser.productID.split('-')[1],
            appUser.userType,
            appUser.platform,
            appUser.lastLanguage,
            appUser.productName,
            appUser.appVersion,
            input.appsFlyerRefferal,
            input.deviceAdvertisingID,
            input.endTime,
            input.launchSource,
            appUser.productName
          );
          Logger.info(`Updating appVersion and sessionID...`);
          appUser.appVersion = input.appVersion;
          appUser.sessionID = session.id;
          await this.appUserDao.putItemToDB(constants.APP_USER_TABLE, appUser);
          await this.sessionDao.putItemToDB(constants.SESSION_TABLE, session);

          if (isDeviceChanged) {
            Logger.info(
              `Device changed. Adding device info into Device table ...`
            );
            const device: IDevice = new Device(
              appUser.id,
              input.deviceManufacturer,
              input.deviceModel,
              input.deviceOS,
              appUser.productID,
              appUser.deviceID
            );
            await this.deviceDAO.putItemToDB(constants.DEVICE_TABLE, device);
          }
          ageOptin = {
            isSigned: appUser.ageOptin,
            date: appUser.ageOptinDate
          };
          signUpProcess = {
            isSigned: appUser.signUpProcess,
            date: appUser.signUpProcessDate
          };
          legal = {
            isSigned: appUser.isLegalSigned,
            date: appUser.legalDate
          };
          const isRtl: boolean = await this.getTextDirectionByProductId(appUser.productID);
          return new LaunchAppResponse(
            appUser.id,
            appUser.deviceID,
            appUser.productID,
            sessionID,
            appUser.userType,
            ageOptin,
            signUpProcess,
            legal,
            contentVersion,
            appUser.operatorsList,
            isRtl
          );
        }

        Logger.info(`User with id = ${input.appUserID} not found`);
      } catch (error) {
        Logger.info(error);
      }
    }

    const appUsers: IAppUser[] = await this.appUserDao.getItemsByGSI(
      constants.APP_USER_TABLE,
      'deviceID-index',
      'deviceID = :v1',
      { ':v1': input.deviceID }
    );
    if (appUsers !== null && appUsers.length > 0) {
      const appUser = appUsers[0];
      Logger.info('Found user by device id', appUser);

      if (this.isIPAddressNew(publicIP, appUser.location)) {
        Logger.info(`ipAddress has been changed. Updating location ...`);
        const newLocationsList: ILocation[] = this.getUpdatedLocation(
          location,
          appUser.location
        );
        appUser.location = newLocationsList;
        Logger.info(
          `AppUser with new location list = ${JSON.stringify(appUser)}`
        );
      }

      if (lookUpBilling === null) {
        appUser.operatorsList = [];
      } else {
        appUser.operatorsList = lookUpBilling.provider;
      }
      const session: ISession = new Session(
        sessionID,
        appUser.id,
        appUser.productID.split('-')[1],
        appUser.userType,
        appUser.platform,
        appUser.lastLanguage,
        appUser.productName,
        appUser.appVersion,
        input.appsFlyerRefferal,
        input.deviceAdvertisingID,
        input.endTime,
        input.launchSource,
        appUser.productName
      );
      Logger.info(`Updating appVersion and sessionID...`);
      appUser.appVersion = input.appVersion;
      appUser.sessionID = session.id;
      await this.appUserDao.putItemToDB(constants.APP_USER_TABLE, appUser);
      await this.sessionDao.putItemToDB(constants.SESSION_TABLE, session);

      if (isDeviceChanged) {
        Logger.info(`Device changed. Adding device info into Device table ...`);
        const device: IDevice = new Device(
          appUser.id,
          input.deviceManufacturer,
          input.deviceModel,
          input.deviceOS,
          appUser.productID,
          appUser.deviceID
        );
        await this.deviceDAO.putItemToDB(constants.DEVICE_TABLE, device);
      }
      ageOptin = {
        isSigned: appUser.ageOptin,
        date: appUser.ageOptinDate
      };
      signUpProcess = {
        isSigned: appUser.signUpProcess,
        date: appUser.signUpProcessDate
      };
      legal = {
        isSigned: appUser.isLegalSigned,
        date: appUser.legalDate
      };
      const isRtl: boolean = await this.getTextDirectionByProductId(appUser.productID);
      return new LaunchAppResponse(
        appUser.id,
        appUser.deviceID,
        appUser.productID,
        sessionID,
        appUser.userType,
        ageOptin,
        signUpProcess,
        legal,
        contentVersion,
        appUser.operatorsList,
        isRtl
      );
    }

    Logger.info(
      `Cannot find user by AppUserId and DeviceID. Creating guest user ...`
    );

    let lookUpCountry: LookupCountry;
    let productName: string;
    let isCountryFound: boolean;

    lookUpCountry = await this.lookupCountryDAO.getItemByGSI(
      constants.LOOKUP_COUNTRY_TABLE,
      'detectedCountry-index',
      'detectedCountry = :v1',
      { ':v1': location.country }
    );

    if (lookUpCountry !== null) {
      isCountryFound = true;
      Logger.info(`Country  ${location.country} exists in LookUpCountry`);

    } else {
      isCountryFound = false;
      Logger.info(
        `Country  ${location.country} does not exists in LookUpCountry`
      );
      lookUpCountry = await this.lookupCountryDAO.getItemByGSI(
        constants.LOOKUP_COUNTRY_TABLE,
        'detectedCountry-index',
        'detectedCountry = :v1',
        { ':v1': constants.DEFAULT_COUNTRY_KEY }
      );

    }
    const fullProductID = input.productID + '-' + lookUpCountry.productLanguage.toLowerCase();
    const language = lookUpCountry.productLanguage;
    productName = `${input.productID.toLowerCase()}-${language.toLowerCase()}`;
    const locationList: ILocation[] = this.getUpdatedLocation(location, null);
    const operatorsList: IProvider[] = lookUpBilling === null ? [] : lookUpBilling.provider;
    const productsList: IProduct[] = this.getNewProductsList(input.deviceID, productName);

    const userType = isCountryFound
      ? constants.ALTERNATIVE_GUEST
      : constants.IAP_GUEST;
    Logger.info(`UserType = ${userType}`);

    const guest: GuestAppUser = this.createGuestUser(
      input.deviceID,
      fullProductID,
      sessionID,
      userType,
      operatorsList,
      locationList,
      productsList,
      input.platform,
      input.appVersion,
      productName
    );
    const session = new Session(
      sessionID,
      guest.id,
      guest.productID,
      userType,
      guest.platform,
      language,
      guest.productName,
      guest.appVersion,
      input.appsFlyerRefferal,
      input.deviceAdvertisingID,
      input.endTime,
      input.launchSource,
      productName
    );

    await this.sessionDao.putItemToDB(constants.SESSION_TABLE, session);
    await this.appUserDao.putItemToDB(constants.APP_USER_TABLE, guest);
    const installationId = timestampWithSixDigits();
    const installationDate = formatCurrentDate(new Date().getTime());
    const installation = new Installation(
      guest.id,
      location.country,
      input.deviceAdvertisingID,
      input.deviceManufacturer,
      input.deviceModel,
      installationId,
      installationDate,
      [],
      language,
      input.appsFlyerRefferal,
      guest.productID
    );

    await this.installationDAO.putItemToDB(
      constants.INSTALLATION_TABLE,
      installation
    );

    const device: IDevice = new Device(
      guest.id,
      input.deviceManufacturer,
      input.deviceModel,
      guest.platform,
      guest.deviceID,
      guest.productID
    );
    await this.deviceDAO.putItemToDB(constants.DEVICE_TABLE, device);
    const isRtl: boolean = await this.getTextDirectionByProductId(guest.productID);
    return new LaunchAppResponse(
      guest.id,
      guest.deviceID,
      guest.productID,
      guest.sessionID,
      guest.userType,
      undefined,
      undefined,
      undefined,
      contentVersion,
      guest.operatorsList,
      isRtl
    );
  }

  private isIPAddressNew(
    ipAddress: string,
    existingLocation: ILocation[]
  ): boolean {
    const isLocationFinded = existingLocation.find(
      i => i.ipAddress === ipAddress
    );
    return !!isLocationFinded ? false : true;
  }

  private getUpdatedLocation(
    locationByIPResponse: ILocation,
    existedLocation: ILocation[]
  ): ILocation[] {
    if (existedLocation === null) {
      existedLocation = [];
    }
    const newLocation: ILocation = locationByIPResponse;
    existedLocation.push(newLocation);
    return existedLocation;
  }

  private getNewProductsList(deviceId: string, productId: string) {
    return [{ deviceId, productId }];
  }

  private createGuestUser(deviceID: string, productID: string, sessionID: string, userType: number,
                          operatorsList: IProvider[], location: ILocation[], products: IProduct[],
                          platform: string, appVersion: string, productName: string): GuestAppUser {
    const id = timestampWithSixDigits();
    const creationDate = formatCurrentDate(new Date().getTime());
    const guest: GuestAppUser = new GuestAppUser(
      id, deviceID, productID, sessionID, creationDate, userType, operatorsList, location, products, platform, appVersion, productName, null);
    return guest;
  }

  private async getTextDirectionByProductId(productId: string): Promise<boolean> {
    let isRtl: boolean = false;
    try {
      const product: IProductModel = await this.productDAO.getItemFromDB(constants.PRODUCT_TABLE, productId);
      if (!product) return isRtl;
      isRtl = product.textDirection === 'rtl';
      return isRtl;
    } catch (e) {
      console.error(e.toString());
      return isRtl;
    }
  }

  private async defineContentVersion(clientVersion): Promise<string> {
    console.log('Defining content version for ', clientVersion);
    const fetchedClientVersion: ClientVersion = await this.clientVersionDAO.getItemFromDB(constants.CLIENT_VERSION_TABLE, clientVersion);

    if (!fetchedClientVersion) {
      console.log(`Client version ${clientVersion} not found inside ${constants.CLIENT_VERSION_TABLE}`);
      console.log('Setting up initial content ', constants.CONTENT_INITIAL_VERSION);
      return constants.CONTENT_INITIAL_VERSION;
    } else {
      const contentVersion = fetchedClientVersion.contentVersion;

      if (isEmpty(contentVersion)) {
        console.log('Content version is empty');
        console.log('Setting up initial content ', constants.CONTENT_INITIAL_VERSION);
        return constants.CONTENT_INITIAL_VERSION;
      }

      return contentVersion;
    }
  }

  private parseIp(ipAddress) {
    const array = ipAddress.split(',');
    if (array.length < 2) return ipAddress;
    return array[0].toString();
  }
}
