import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '../../../config/config.service';
import Axios from 'axios';

// const dotenv = require('dotenv');
// dotenv.config();



const https = require('https');
const Path = require('path');
const Url = require('url');
const Fs = require('fs');

export enum UnityEventTypes {
  CB_SUCCESS = 'cloudBuild.success',
  CB_STARTED = 'cloudBuild.started',
  UNKNOW = 'UNKNOW'
}

export enum UCBReqestHeaders {
  userAgent = 'user-agent',
  authorization = 'authorization',
  xUnityEvent = 'x-unity-event'
}

export interface IUnityWHHeaderValidation {
  isAuthorized?: boolean;
  unityEventType: string;
}

@Injectable()
export class UnityService {

  // Constructor.
  constructor(
    private readonly configService: ConfigService,
  ) {
  }

  //#region Public methods
  /**
   * Try to parse unity cloud build webhook request headers.
   * @param request Unity Webhook request
   * @returns parse result @type {IUnityWHHeaderValidation}
   */
  public parseUnityCloudBuildWHHeaders(request: any): IUnityWHHeaderValidation {
    const headers: { [key: string]: string } = request && request.headers;
    const isAllHeadersExist = (): boolean => {
      for (const header in UCBReqestHeaders) {
        const headerKey = UCBReqestHeaders[header];
        if (!headers[headerKey]) {
          console.error('Can\'\t find the header param, with key:', header);
          return false;
        }
      }
      return true;
    };
    const getValidEventType = (): UnityEventTypes => {
      const currentHeaderValue = headers[UCBReqestHeaders.xUnityEvent];
      for (const eventTypeKey in  UnityEventTypes) {
        const eventType = UnityEventTypes[eventTypeKey];
        if (eventType === currentHeaderValue)
          return eventType as UnityEventTypes;
      }

      return UnityEventTypes.UNKNOW;
    };
    const isAuthorized = (): boolean => {
      const authorizationValue = headers[UCBReqestHeaders.authorization];
      console.log('AuthorizationValue = ', authorizationValue);
      return authorizationValue === this.configService.unityAuthorizationToken;
    };
      console.log('Is all headers exist -> ', isAllHeadersExist());
      console.log('Is Authorized -> ', isAuthorized() );
      console.log('Authorization from env -> ', this.configService.unityAuthorizationToken);


      if (isAllHeadersExist()) {
      return {
        isAuthorized: isAuthorized(),
        unityEventType: getValidEventType(),
      };
    }
    return {
      unityEventType: UnityEventTypes.CB_SUCCESS,
    };
  }

  /**
   *
   */
  public async downloadCloudBuild(binaryURL: string, filename: string): Promise<any> {

    Logger.log('downloadBinary: start');
    Logger.log('   ' + binaryURL);
    Logger.log('   ' + filename);

    return new Promise((resolve, reject) =>
      this.deleteFile(filename, () =>
        https.get(binaryURL, (res) => {

          const writeStream = Fs.createWriteStream(filename, { 'flags': 'a' });

          const len = parseInt(res.headers['content-length'], 10);
          let cur = 0;
          const total = len / 1048576; // 1048576 - bytes in  1Megabyte

          res.on('data', (chunk) => {
            cur += chunk.length;
            writeStream.write(chunk, 'binary');
            Logger.log('Downloading ' + (100.0 * cur / len).toFixed(2) + '%, Downloaded: ' + (cur / 1048576).toFixed(2) + ' mb, Total: ' + total.toFixed(2) + ' mb');
          });

          res.on('end', () => {
            Logger.log('downloadBinary: finished');
            writeStream.end();
          });

          writeStream.on('finish', () => {
            resolve(filename);
          });
        }).on('error', (e) => {
          console.error(e);
          reject(e);
        }),
      ),
    );
  }

  public async getCloudBuildDetails(buildURL: string): Promise<{
    url: any;
    filename: string;
    notes: string
  } | null> {
    let failureReason: any;

    const url = this.configService.unityApiBase + buildURL;
    const result = await Axios.get(url, {
      headers: {
        'Authorization': 'Basic ' + this.configService.unityApiKey,
      },
    })
      .catch(error => failureReason = error);
    if (result && result.data) {
      const parsedData = result.data;
      let notes = 'Git branch: ' + parsedData.scmBranch + '\n\n';
      console.log('Cpommits:', parsedData.changeset);
      if (parsedData.changeset) {
        notes += 'Commits:\n';

        for (const commit of parsedData.changeset.reverse()) {
          notes += `  - [${commit.commitId.substr(0, 8)}] ${commit.message}\n`;
        }
      }
      const parsedUrl = Url.parse(parsedData.links.download_primary.href);
      const filename = '/tmp/' + Path.basename(parsedUrl.pathname);
      return {
        url: parsedUrl,
        filename,
        notes,
      };
    }
    return null;
  }

  //#endregion
  //#region Private methods
  // Delete file, used to clear up any binary downloaded.
  private deleteFile(filename: string, cb: () => void): void {
    Fs.access(filename, function(err) {
      if (!err || err.code !== 'ENOENT') {
        // Delete File.
        Fs.unlink(filename, (err) => {
          if (err) {
            Logger.error('Error when deleting file: %j', err);
          }

          cb();
        });
      } else {
        cb();
      }
    });
  }

  //#endregion

}
