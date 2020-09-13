import { ConfigService } from '../../config/config.service';
import Axios from 'axios';
import { Injectable, Logger } from '@nestjs/common';

const Fs = require('fs');
const FormData = require('form-data');
const Path = require('path');
const Url = require('url');

@Injectable()
export class AppcenterService {
  // Constructor.
  constructor(
    private readonly configService: ConfigService,
  ) {
  }

  //#region Public methods
  public async uploadToAppCenter(filename: string, notes: string, platform: string, ownerName: string, appName: string, team: string) {
    if (platform === 'android' || platform === 'ios') {
      const res = await this.createAppCenterUpload(ownerName, appName)
        .catch(reason => Logger.error(reason));
      if (res) {
        const { uploadId, uploadUrl } = res;
        let uploadingFailure = null;
        await this.uploadFileToAppCenter(filename, uploadUrl)
          .then(response => Logger.log(`File to app center uploaded, fileName:${filename}`))
          .catch(failure => uploadingFailure = failure);
        if (uploadingFailure) {
          Logger.error(uploadingFailure);
        } else {
          const releaseUrl = await this.commitAppCenterUpload(ownerName, appName, uploadId);
          if (releaseUrl) {
            console.log('commited url:', releaseUrl);
            console.log('Platform -> ', platform);
            console.log('Notes -> ', notes);
            await this.distributeAppCenterUpload(releaseUrl, platform, notes)
              .then(response => {
                console.log('Distribute app to appcenter success, the app name is:', appName);
              })
              .catch(failureReason => {
                console.error('Distribute app to appcenter failure, the reason is:', failureReason);
              });
          }
        }
      } else {
        Logger.error('Can\'\t create  app center upload');
      }
    } else {
      Logger.error('Platform not supported: %s', platform);
    }
  }

  //#endregion
  //#region Private methods

  private async createAppCenterUpload(ownerName, appName): Promise<{ uploadId: string; uploadUrl: string; } | null> {
    const url = `${this.configService.appCenterHost}/v0.1/apps/${ownerName}/${appName}/release_uploads`;
    let result: { upload_id: string; upload_url: string; } = null;
    await Axios.post<{ upload_id: string; upload_url: string; }>(
      url,
      {},
      {
        headers: {
          'X-API-Token': this.configService.appCenterAPIKey,
          'Content-Type': 'application/json',
        },
      },
    )
      .then(response => {
        result = response.data ? response.data : null;
      })
      .catch(failureReason => Logger.error(failureReason));

    return result ? {
      uploadId: result.upload_id,
      uploadUrl: result.upload_url,
    } : null;
  }

  public uploadFileToAppCenter(filename: string, uploadUrl: string) {
    Logger.log('uploadFileToAppCenter: start, ' + filename + ', ' + uploadUrl);
    const that = this;
    const readable = Fs.createReadStream(filename);
    readable.on('error', () => {
      Logger.error('Error reading binary file for upload to App Center');
    });

    // Create FormData
    const form = new FormData();
    form.append('ipa', readable);
    // form.append('apk', readable);
    const parsedUrl = Url.parse(uploadUrl);
    const parsedPath = parsedUrl.pathname + (parsedUrl.search === null?'':parsedUrl.search);
    return new Promise((resolve, reject) => {
      const req = form.submit({
        host: parsedUrl.host,
        path: parsedPath,
        protocol: parsedUrl.protocol,
        headers: {
          'Accept': 'application/json',
          'X-API-Token': this.configService.appCenterAPIKey,
        },
      }, function(err, res) {
        if (err) {
          Logger.error('Error when uploading:');
          reject(err);
        }

        if (res.statusCode !== 200 && res.statusCode !== 201 && res.statusCode !== 204) {
          Logger.log('Uploading failed with status ' + res.statusCode);
          console.log(res);
          reject(err);
        }

        let jsonString = ''; // eslint-disable-line
        res.on('data', (chunk) => {
          jsonString += String.fromCharCode.apply(null, new Uint16Array(chunk));
        });

        res.on('end', () => {
          Logger.log('uploadFileToAppCenter: finished');
          that.deleteFile(filename, resolve);
        });
      });

      // Track upload progress.
      const len = parseInt(req.getHeader('content-length'), 10);
      let cur = 0;
      const total = len / 1048576; // 1048576 - bytes in  1Megabyte

      req.on('data', (chunk) => {
        cur += chunk.length;
        console.log('Uploading ' + (100.0 * cur / len).toFixed(2) + '%, Uploaded: ' + (cur / 1048576).toFixed(2) + ' mb, Total: ' + total.toFixed(2) + ' mb');
      });
    });
  }

  private async commitAppCenterUpload(ownerName: string, appName: string, uploadId: string): Promise<string | null> {
    Logger.log('commitAppCenterUpload: start');
    const commitApiurl = `${this.configService.appCenterHost}/v0.1/apps/${ownerName}/${appName}/release_uploads/${uploadId}`;
    let failureReason: any = null;
    let patchedUrl: string = null;
    await Axios.patch<{ release_url: string }>(commitApiurl, {
        status: 'committed',
      },
      {
        headers: {
          'X-API-Token': this.configService.appCenterAPIKey,
          'Content-Type': 'application/json',
        },
      })
      .then(response => {
        if (response.data && response.data.release_url) {
          patchedUrl = response.data.release_url;
        } else {
          failureReason = 'Can not commit app to appcenter';
        }
      })
      .catch(err => failureReason = err);
    if (failureReason) {
      Logger.error(failureReason);
    }
    return patchedUrl;
  }

  private async  distributeAppCenterUpload(releaseUrl: string, platform: string, notes: string) {
    Logger.log('distributeAppCenterUpload: start');
    const url = `${this.configService.appCenterHost}/${releaseUrl}`;

    const data = {
      release_notes: notes,
      destinations: this.configService.getAppCenterDestinations(platform),
    };

    console.log('Data -> ', data);
    console.log('X-API-Token -> ', this.configService.appCenterAPIKey);

    return Axios.patch(url, data, {
      headers: {
        'X-API-Token': this.configService.appCenterAPIKey,
        'Content-Type': 'application/json',
      },
    });
  }

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
