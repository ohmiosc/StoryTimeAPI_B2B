export interface IDevice {
  id: string;
  appUserID: string;
  productID: string;

  deviceManufacturer?: string;
  deviceModel?: string;
  deviceOS?: string;
}

export class Device implements IDevice {
  appUserID: string;
  deviceManufacturer: string;
  deviceModel: string;
  deviceOS: string;
  id: string;
  productID: string;

  constructor(appUserID: string, deviceManufacturer: string, deviceModel: string, deviceOS: string,
              id: string, productID: string) {
    this.appUserID = appUserID;
    this.deviceManufacturer = deviceManufacturer;
    this.deviceModel = deviceModel;
    this.deviceOS = deviceOS;
    this.id = id;
    this.productID = productID;
  }

}
