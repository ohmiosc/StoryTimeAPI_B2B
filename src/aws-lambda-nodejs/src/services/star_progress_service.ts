import {Injectable} from '@nestjs/common';
import { StarsProgress } from '../models/stars_progress_model';
import { isEmpty } from '../lib/validator';
import * as constants from '../constants';
import { StarsProgressDAO } from '../dao/star_progress_dao';
import { AppUserDAO } from '../dao/app_user_dao';
import { SetStarsProgressRequest } from '../requests/set_stars_progress_request';
import { BadRequestException } from '../exception/BadRequestException';
import { NotFoundException } from '../exception/NotFoundException';

@Injectable()
export class StarProgressService {

  constructor(private starsProgressDAO: StarsProgressDAO,
              private appUserDAO: AppUserDAO) {
  }

  public async getStarsProgress(appUserID: string): Promise<StarsProgress> {
    if (!appUserID || isEmpty(appUserID)) throw new BadRequestException('appUserID is empty or has wrong format', constants.BAD_REQUEST.statusCode);

    const starsProgress: StarsProgress[] = await this.starsProgressDAO.getItemsByGSI(
      constants.STARS_PROGRESS_TABLE,
      'appUserID-index',
      'appUserID = :appUserID',
      { ':appUserID': appUserID },
    );

    if (!starsProgress || starsProgress.length === 0) throw new NotFoundException(`Stars progress for id ${appUserID} not found`, constants.NOT_FOUND.statusCode);

    return starsProgress[0];

  }

  public async setStarsProgress(appUserID: string, body: SetStarsProgressRequest): Promise<StarsProgress> {
    if (!appUserID || isEmpty(appUserID)) throw new BadRequestException('appUserID is empty or has wrong format', constants.BAD_REQUEST.statusCode);

    const appUser = await this.appUserDAO.getItemFromDB(constants.APP_USER_TABLE, appUserID);

    if (!appUser) throw new NotFoundException(`User with id ${appUserID} not found`, constants.NOT_FOUND.statusCode);

    const starsProgressArr: StarsProgress[] = await this.starsProgressDAO.getItemsByGSI(
      constants.STARS_PROGRESS_TABLE,
      'appUserID-index',
      'appUserID = :appUserID',
      { ':appUserID': appUserID },
    );

    let starsProgress: StarsProgress;
    if (!starsProgressArr || starsProgressArr.length === 0) {
      starsProgress = new StarsProgress();
      starsProgress.appUserID = appUserID;
    } else {
      starsProgress = starsProgressArr[0];
    }
    Object.keys(body).forEach(key => {
      starsProgress[key] = body[key];
    });

    await this.starsProgressDAO.putItemToDB(constants.STARS_PROGRESS_TABLE, starsProgress);
    return starsProgress;
  }

}
