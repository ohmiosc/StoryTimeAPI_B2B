import {Body, Controller, Get, Logger, Post, Req, UnauthorizedException} from '@nestjs/common';
import { ConfigService } from './../../../config/config.service';
import { UnityEventTypes, UnityService } from './unity.service';
import { AppcenterService } from './../../appcenter/appcenter.service';
import { IUnityWebhookVO } from '../../../vo/unity/unity-webhook.vo';


@Controller('api/webhook/unity')
export class UnityController {

  constructor(
    private readonly configService: ConfigService,
    private readonly unityService: UnityService,
    private readonly appcenterSrvice: AppcenterService,
  ) {
  }

  //#region REST API methods
  @Post()
 async unityCloudBuildWebhook(@Req() req: any, @Body() webhookParams: IUnityWebhookVO) {
    console.log('Controller works !!!');
    // console.log(req.headers, '[UnityController]=>unityCloudBuildWebhook');
    // console.log(webhookParams, '[UnityController]=>unityCloudBuildWebhook');
    const validatedWhHeaders = this.unityService.parseUnityCloudBuildWHHeaders(req);

    console.log('Validation headers = ',validatedWhHeaders);
    if (validatedWhHeaders.isAuthorized) {
      switch (validatedWhHeaders.unityEventType) {
        case UnityEventTypes.CB_SUCCESS:

          const { buildTargetName: projectName } = webhookParams;
          console.log('Controller triggered !!!');
          if (projectName) {
            console.log('Project name -> ', projectName);
            await this.tryToDeploySuccessUCBToAppCenter(webhookParams, 'La-Mark', projectName.replace(/\s/g, '-'), 'La-Mark');
          } else {
            console.error('Can\'\t detect the project name, build target name is:' + webhookParams.buildTargetName);
            Logger.error('Can\'\t detect the project name, build target name is:' + webhookParams.buildTargetName);
          }
          break;
        case UnityEventTypes.CB_STARTED:
          break;
        default:
          Logger.warn('Can\'t\ detect the unityevent type');
          break;
      }
    } else {
        throw new UnauthorizedException('Invalid token');
    }
  }

  @Get()
  unityCloudBuildWebhookVersion() {
    console.log('GET unityCloudBuildWebhookVersion');
    return `The Unity cloud build appcenter integration, source code version: ${this.configService.appVersion}`;
  }

  //#endregion

  //#region Private methods
  private async tryToDeploySuccessUCBToAppCenter(webhookParams: IUnityWebhookVO, ownerName: string, appName: string, team: string) {
    const buildURL = webhookParams.links && webhookParams.links.api_self && webhookParams.links.api_self.href;
    if (buildURL) {
      const result = await this.unityService.getCloudBuildDetails(buildURL);
      if (result) {
        Logger.log(result);
        const downloadedFilename = await this.unityService.downloadCloudBuild(result.url, result.filename)
          .catch(err => Logger.error(err));

        if (downloadedFilename) {
          await this.appcenterSrvice.uploadToAppCenter(downloadedFilename, result.notes, webhookParams.platform, ownerName, appName, team);
        }
        Logger.log('Result of download the build:' + downloadedFilename);
      } else {
        Logger.error('Can\'\t get build details.');
      }
    } else {
      Logger.error('Can\'\t detect build url.');
    }

  }

  //#endregion

}
