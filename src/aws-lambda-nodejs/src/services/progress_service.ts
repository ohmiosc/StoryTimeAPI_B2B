import { Injectable } from '@nestjs/common';
import { AppUserProgressionLevels } from '../models/app_user_progression_levels_model';
import { IAppUserProgressionVocabs } from '../models/app_user_progression_vocabs_model';
import { IProgress, Progress } from '../models/progress_model';
import { AppUserProgressionDAO } from '../dao/progress_dao';
import * as constants from '../constants';
import { IAppUserProgressionVideosFranchise } from '../models/app_user_progression_videos_franchise_model';
import { AppUserProgressionVideos } from '../models/app_user_progression_videos_model';
import { AppUserProgressionQuestions } from '../models/app_user_progression_questions_model';
import { AppUserProgressionQuestionsByProduct } from '../models/app_user_product_progression_by_questions_model';
import { SaveUserProgressionQuestionsResponse } from '../responses/save_user_progression_questions_response';
import { IValidator, validateInput } from '../lib/validator';
import { errorResponse, ErrorResponse } from '../responses/error_response';
import { AppUserDAO } from '../dao/app_user_dao';
import { ProductDAO } from '../dao/product_dao';
import { AppUserProgressionQuestionsByProductDAO } from '../dao/app_user_product_progression_by_questions_dao';
import { formatCurrentDate } from '../lib/generator';
import { IProductModel } from '../models/product_model';
import { IAppUser } from '../models/app_user_model';

@Injectable()
export class ProgressService {
    constructor(private appUserProductProgressionDAO: AppUserProgressionDAO,
                private AppUserProgressionQuestionsByProductDAO: AppUserProgressionQuestionsByProductDAO,
                private appUserDAO: AppUserDAO,
                private productDAO: ProductDAO,
    ) {}

    private async getProgressBySessionId(sessionID) {
        const progress: IProgress = await this.appUserProductProgressionDAO.getItemByGSI(
            constants.PROGRESS_TABLE,
            'sessionID-index',
            'sessionID = :sessionID',
            { ':sessionID': sessionID },
        );
        return progress;
    }

    public async updateQuestionsProgress(appUser: IAppUser, appUserID: string, questionsProgress: Array<AppUserProgressionQuestions>): Promise<void> {
        let progress: IProgress;
        let questionsUserDataList: Array<AppUserProgressionQuestions>;
        progress = await this.getProgressBySessionId(appUser.sessionID);
        if (progress === null) {
            progress = new Progress();
            progress.sessionID = appUser.sessionID;
            progress.appUserID = appUserID;
        }

        questionsUserDataList = progress.questionsUserDataList === ( null || void 0) ? [] : progress.questionsUserDataList;
        progress.questionsUserDataList = [...questionsUserDataList, ...questionsProgress];
        console.log(`Putting progress levels to DB: ${JSON.stringify(progress)}`);
        await this.appUserProductProgressionDAO.putItemToDB(constants.PROGRESS_TABLE, progress);

    }

    public async updateLevelsProgress(appUser: IProgress, levelsProgress: Array<AppUserProgressionLevels>){
        let progress: IProgress;
        let levelsUserDataList: Array<AppUserProgressionLevels>;
        progress = await this.getProgressBySessionId(appUser.sessionID);
        if (progress === null) {
            console.log('progress not found');
            progress = new Progress();
            progress.sessionID = appUser.sessionID;
            progress.appUserID = appUser.appUserID;
        }
        levelsUserDataList = progress.levelsUserDataList === ( null || void 0) ? [] : progress.levelsUserDataList;
        progress.levelsUserDataList = [...levelsUserDataList, ...levelsProgress];
        console.log(`Putting progress levels to DB: ${JSON.stringify(progress)}`);
        await this.appUserProductProgressionDAO.putItemToDB(constants.PROGRESS_TABLE, progress);

    }

    public async updateVocabsProgress(appUser: IProgress, vocabsProgress: Array<IAppUserProgressionVocabs>) {
        let progress: IProgress;
        let vocabsUserDataList: Array<IAppUserProgressionVocabs>;
        console.log(`getting progress by sessionID: ${appUser.sessionID}`);
        progress = await this.getProgressBySessionId(appUser.sessionID);
        if (progress === null) {
            console.log('progress not found');
            progress = new Progress();
            progress.sessionID = appUser.sessionID;
            progress.appUserID = appUser.appUserID;
        }
        vocabsUserDataList = progress.vocabsUserDataList === (null || void 0) ? [] : progress.vocabsUserDataList;
        progress.vocabsUserDataList = [...vocabsUserDataList, ...vocabsProgress];
        console.log(`Putting progress vocabs to DB: ${JSON.stringify(progress)}`);
        await this.appUserProductProgressionDAO.putItemToDB(constants.PROGRESS_TABLE, progress);
    }

    public async updateVideosFranchiseProgress(appUser: IProgress, videoFranchiseProgress: Array<IAppUserProgressionVideosFranchise>) {
        let progress: IProgress;
        let videoFranchiseDataList: Array<IAppUserProgressionVideosFranchise>;
        console.log(`getting progress by sessionID: ${appUser.sessionID}`);
        progress = await this.getProgressBySessionId(appUser.sessionID);
        if (progress === null){
            console.log('progress not found');
            progress = new Progress();
            progress.sessionID = appUser.sessionID;
            progress.appUserID = appUser.appUserID;
        }
        videoFranchiseDataList = progress.videosFranchiseUserDataList === (null || void 0) ? [] : progress.videosFranchiseUserDataList;
        progress.videosFranchiseUserDataList = [...videoFranchiseDataList, ...videoFranchiseProgress];
        console.log(`Putting progress franchise to DB: ${JSON.stringify(progress)}`);
        await this.appUserProductProgressionDAO.putItemToDB(constants.PROGRESS_TABLE, progress);
    }

    public async updateVideosProgress(appUser: IProgress, videoProgress: Array<AppUserProgressionVideos>) {
        let progress: IProgress;
        let videoDataList: Array<AppUserProgressionVideos>;

        console.log(`getting progress by sessionID: ${appUser.sessionID}`);
        progress = await this.getProgressBySessionId(appUser.sessionID);
        if (progress === null){
            console.log('progress not found');
            progress = new Progress();
            progress.sessionID = appUser.sessionID;
            progress.appUserID = appUser.appUserID;
        }
        videoDataList = progress.videoUserDataList === (null || void 0) ? [] : progress.videoUserDataList;
        progress.videoUserDataList = [...videoDataList, ...videoProgress];
        console.log(`Putting progress video to DB: ${JSON.stringify(progress)}`);
        await this.appUserProductProgressionDAO.putItemToDB(constants.PROGRESS_TABLE, progress);
    }

    public async saveProgressionQuestions(input: any): Promise<SaveUserProgressionQuestionsResponse | ErrorResponse> {
        const inputValidator: IValidator = validateInput(['appUserID', 'productID', 'versionID', 'questionsUserDataList'], input);
        if (!inputValidator.isValid) {
            return errorResponse(constants.BAD_REQUEST.statusCode,
              constants.BAD_REQUEST.status, inputValidator.message);
        }

        const userID: string = input.appUserID;
        const appUserInput: IAppUser = await this.appUserDAO.getItemFromDB(constants.APP_USER_TABLE, userID);
        if (appUserInput === null){
            return errorResponse(constants.NOT_FOUND.statusCode,
                constants.NOT_FOUND.status, 'No data found for user id');
        }
        appUserInput.sessionID = input.sessionID;
        const currentDate = formatCurrentDate(new Date().getTime());
        const productID: string = input.productID;
        const product: IProductModel = await this.productDAO.getItemFromDB(constants.PRODUCT_TABLE, productID);
        if (product === null){
            return errorResponse(constants.NOT_FOUND.statusCode,
                constants.NOT_FOUND.status, 'No data found for product id');
        }
        const userProgressions: Array<AppUserProgressionQuestionsByProduct> = await this.AppUserProgressionQuestionsByProductDAO.getItemsByGSI(
            constants.APP_USER_PROGRESSION_QUESTIONS_BY_PRODUCT_TABLE,
            'appUserID-productID-index',
            'appUserID = :appUserID',
            { ':appUserID': userID },
        );

        let userProgression: AppUserProgressionQuestionsByProduct;
        const response: SaveUserProgressionQuestionsResponse = {message: ''};

        if (userProgressions === null) {
            userProgression = new AppUserProgressionQuestionsByProduct(userID, currentDate, currentDate, productID, input.questionsUserDataList, input.versionID);
            await this.AppUserProgressionQuestionsByProductDAO.putItemToDB(constants.APP_USER_PROGRESSION_QUESTIONS_BY_PRODUCT_TABLE, userProgression);
            await this.updateQuestionsProgress(appUserInput, userID, input.questionsUserDataList);
            response.message = 'New entry OK';
            return response;
        }
        userProgression = userProgressions.find(item => item.productID === productID);
        userProgression.productID = productID;
        userProgression.versionID = input.versionID;
        userProgression.questionsUserDataList = [...userProgression.questionsUserDataList, ...input.questionsUserDataList];

        await this.AppUserProgressionQuestionsByProductDAO.putItemToDB(constants.APP_USER_PROGRESSION_QUESTIONS_BY_PRODUCT_TABLE, userProgression);
        await this.updateQuestionsProgress(appUserInput, userID, input.questionsUserDataList);
        response.message = 'Old user updated OK';
        return response;
    }

    public async getProgressionQuestions(input: any): Promise <AppUserProgressionQuestionsByProduct | ErrorResponse> {
        const inputValidator: IValidator = validateInput(['appUserID', 'productID'], input);
        if (!inputValidator.isValid) {
            return errorResponse(constants.BAD_REQUEST.statusCode,
              constants.BAD_REQUEST.status, inputValidator.message);
        }
        const userID: string = input.appUserID;
        const appUserInput: IAppUser = await this.appUserDAO.getItemFromDB(constants.APP_USER_TABLE, userID);
        if (appUserInput === null){
            return errorResponse(constants.NOT_FOUND.statusCode,
                constants.NOT_FOUND.status, 'No data found for user id');
        }
        const productID: string = input.productID;
        const product: IProductModel = await this.productDAO.getItemFromDB(constants.PRODUCT_TABLE, productID);
        if (product === null){
            return errorResponse(constants.NOT_FOUND.statusCode,
                constants.NOT_FOUND.status, 'No data found for product id');
        }
        const userProgressions: AppUserProgressionQuestionsByProduct = await this.AppUserProgressionQuestionsByProductDAO.getItemByGSI(
                constants.APP_USER_PROGRESSION_QUESTIONS_BY_PRODUCT_TABLE,
                'appUserID-productID-index',
                'appUserID = :appUserID',
                { ':appUserID': userID },
        );
        if (userProgressions === null){
            const currentDate = formatCurrentDate(new Date().getTime());
            return new AppUserProgressionQuestionsByProduct(userID, currentDate, currentDate, productID, [], 0);
        }

        return userProgressions;

    }
}
