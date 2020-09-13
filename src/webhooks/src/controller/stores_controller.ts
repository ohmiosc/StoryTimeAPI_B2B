import { Body, Controller, Post } from '@nestjs/common';
import * as constants from '../constants';
import { StoreResponse } from '../response/store_response';
import { GoogleStoreService } from '../service/google_store_service';
import { AppStoreService } from '../service/app_store_service';


@Controller()
export class StoresController {

  constructor(private googleStoreService: GoogleStoreService,
              private appStoreService: AppStoreService){}

  @Post(constants.ANDROID_HANDLER_PATH)
  public async handleAndroidNotification(@Body() input): Promise<StoreResponse> {
    console.log('Running Android Handler with input = ' + JSON.stringify(input));
    const response: StoreResponse = await this.googleStoreService.handleAndroidNotification(input);
    console.log('Android Handler returns ' + JSON.stringify(response));
    return response;
  }

  @Post(constants.APPLE_HANDLER_PATH)
  public async handleAppleNotification(@Body() input): Promise<StoreResponse> {
    console.log('Running Apple Handler with input = ' + JSON.stringify(input));
    const response: StoreResponse = await this.appStoreService.handleAppleNotification(input);
    console.log('Apple Handler returns ' + JSON.stringify(response));
    return response;
  }

}
