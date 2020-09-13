import { errorResponse, ErrorResponse } from '../responses/error_response';
import { Injectable, NotFoundException } from '@nestjs/common';
import { IValidator, validateInput } from '../lib/validator';
import * as constants from '../constants';
import { SpinnerGameProgress } from '../models/spinner_game_progress_model';
import { CommonSuccessResponse } from '../responses/common_success_response';
import { AppUserDAO } from '../dao/app_user_dao';
import { IAppUser } from '../models/app_user_model';
import { SpinnerGameProgressDAO } from '../dao/user_data_dao';
import { GetSpinnerProgressRequest } from '../requests/get_spinner_progress_request';

@Injectable()
export class SpinnerGameProgressService {

  constructor(private spinnerGameProgressDAO: SpinnerGameProgressDAO,
              private appUserDAO: AppUserDAO) {
  }

  public async setSpinnerGameProgress(input: SpinnerGameProgress): Promise<CommonSuccessResponse> {
    const inputValidator: IValidator = validateInput(['franchiseID', 'level', 'bestScore', 'bonusIndex', 'offsetVocablary',
      'CommonVocabs', 'BonusVocabs', 'versionID', 'appUserID', 'productID'], input);

    if (!inputValidator.isValid) {
      return errorResponse(constants.BAD_REQUEST.statusCode,
        constants.BAD_REQUEST.status, inputValidator.message);
    }

    const appUser: IAppUser = await this.appUserDAO.getItemFromDB(constants.APP_USER_TABLE, input.appUserID);

    if (!appUser) throw new NotFoundException(`User with id ${input.appUserID} not found`);

    const fetchedSpinnerGameProgress: SpinnerGameProgress[] = await this.spinnerGameProgressDAO.getItemsByGSI(constants.WHEEL_GAME_PROGRESS_TABLE, 'appUserID-index',
      'appUserID = :appUserID',
      { ':appUserID': input.appUserID });

    let spinnerGameProgress: SpinnerGameProgress = !fetchedSpinnerGameProgress ? undefined : fetchedSpinnerGameProgress.filter((spinnerGameProgress: SpinnerGameProgress) =>
      (spinnerGameProgress.franchiseID === input.franchiseID))[0];

    if (!spinnerGameProgress) {
      spinnerGameProgress = new SpinnerGameProgress(input.franchiseID, input.level, input.bestScore, input.bonusIndex, input.offsetVocablary,
        input.CommonVocabs, input.BonusVocabs, input.appUserID, input.productID, input.versionID);
    }
    else {
      Object.keys(input).forEach(key => {
        spinnerGameProgress[key] = input[key];
      });
    }
    return await this.spinnerGameProgressDAO.putItemToDB(constants.WHEEL_GAME_PROGRESS_TABLE, spinnerGameProgress);
  }

  public async getSpinnerGameProgress(input: GetSpinnerProgressRequest): Promise<SpinnerGameProgress | ErrorResponse> {

    const inputValidator: IValidator = validateInput(['productID', 'appUserID', 'franchiseID'], input);
    if (!inputValidator.isValid) {
      return errorResponse(constants.BAD_REQUEST.statusCode,
        constants.BAD_REQUEST.status, inputValidator.message);
    }

    const appUser: IAppUser = await this.appUserDAO.getItemFromDB(constants.APP_USER_TABLE, input.appUserID);
    if (!appUser) throw new NotFoundException(`User with id ${input.appUserID} not found`);

    const fetchedSpinnerGameProgress: SpinnerGameProgress[] = await this.spinnerGameProgressDAO.getItemsByGSI(constants.WHEEL_GAME_PROGRESS_TABLE, 'appUserID-index',
      'appUserID = :appUserID',
      { ':appUserID': input.appUserID });

    const spinnerGameProgress: SpinnerGameProgress = !fetchedSpinnerGameProgress ? undefined : fetchedSpinnerGameProgress.filter((spinnerGameProgress: SpinnerGameProgress) =>
      (spinnerGameProgress.franchiseID === input.franchiseID))[0];

    if (!spinnerGameProgress) throw new NotFoundException(`Spinner progress not found for user ${input.appUserID} with franchiseID ${input.franchiseID}`);
    return spinnerGameProgress;
  }

}
