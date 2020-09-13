import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { GameDAO } from '../dao/game_dao';
import { VideoDAO } from '../dao/video_dao';
import { CollectionDAO } from '../dao/collection_dao';
import { Game } from '../models/game_model';
import { AppUserDAO } from '../dao/app_user_dao';
import * as constants from '../constants';
import { IAppUser } from '../models/app_user_model';
import { validateInput } from '../lib/validator';
import { CommonSuccessResponse } from '../responses/common_success_response';
import { StepProgress } from '../models/common/steps_progress';
import { Video } from '../models/video_model';
import { Collection } from '../models/collection_model';
import { Sticker } from '../models/common/sticker';

@Injectable()
export class PageProgressService {

  constructor(private gameDAO: GameDAO,
              private videoDAO: VideoDAO,
              private collectionDAO: CollectionDAO,
              private appUserDAO: AppUserDAO,
  ) {

  }

  public async getGameProgress(userId: string, gameId: string): Promise<Game> {

    if (!userId || !gameId) throw new BadRequestException('userId and gameId are strict params');

    const appUser: IAppUser = await this.appUserDAO.getItemFromDB(constants.APP_USER_TABLE, userId);
    if (!appUser) throw new NotFoundException(`User with id ${userId} not found`);

    const game = await this.gameDAO.getItemByGSI(
      constants.GAME_TABLE,
      'gameId-index',
      'gameId = :gameId',
      { ':gameId': gameId });

    if (!game) throw new NotFoundException(`Game with id ${gameId} not found`);
    return game;
  }

  public async putGameProgress(userId: string, gameId: string, game: Game): Promise<CommonSuccessResponse> {

    if (!userId || !gameId) throw new BadRequestException('userId and gameId are strict params');
    if (!game) throw new BadRequestException('Invalid json');

    const inputValidator = validateInput(['stepsProgress'], game);
    if (!inputValidator.isValid) throw new BadRequestException(inputValidator.message);

    const appUser: IAppUser = await this.appUserDAO.getItemFromDB(constants.APP_USER_TABLE, userId);
    if (!appUser) throw new NotFoundException(`User with id ${userId} not found`);

    let fetchedGame: Game = await this.gameDAO.getItemByGSI(
      constants.GAME_TABLE,
      'gameId-index',
      'gameId = :gameId',
      { ':gameId': gameId });

    if (!fetchedGame) {
      console.log(`Game with id ${gameId} not found. Creating new game ...`);
      fetchedGame = new Game(userId, gameId);
    }
    fetchedGame.stepsProgress = this.filterStepsProgress(game.stepsProgress);

    return await this.gameDAO.putItemToDB(constants.GAME_TABLE, fetchedGame);
  }

  public async getVideoProgress(userId: string, videoId: string): Promise<Video> {

    if (!userId || !videoId) throw new BadRequestException('userId and videoId are strict params');

    const appUser: IAppUser = await this.appUserDAO.getItemFromDB(constants.APP_USER_TABLE, userId);
    if (!appUser) throw new NotFoundException(`User with id ${userId} not found`);

    const video: Video = await this.videoDAO.getItemByGSI(
      constants.VIDEO_TABLE,
      'videoId-index',
      'videoId = :videoId',
      { ':videoId': videoId });

    if (!video) throw new NotFoundException(`Video with id ${videoId} not found`);
    return video;
  }

  public async putVideoProgress(userId: string, videoId: string, video: Video): Promise<CommonSuccessResponse> {

    if (!userId || !videoId) throw new BadRequestException('userId and videoId are strict params');
    if (!video) throw new BadRequestException('Invalid json');

    const inputValidator = validateInput(['stepsProgress', 'movieProgress', 'movieStarCount', 'movieUTCTime'], video);
    if (!inputValidator.isValid) throw new BadRequestException(inputValidator.message);

    const appUser: IAppUser = await this.appUserDAO.getItemFromDB(constants.APP_USER_TABLE, userId);
    if (!appUser) throw new NotFoundException(`User with id ${userId} not found`);

    let fetchedVideo: Video = await this.videoDAO.getItemByGSI(
      constants.VIDEO_TABLE,
      'videoId-index',
      'videoId = :videoId',
      { ':videoId': videoId });

    if (!fetchedVideo) {
      console.log(`Video with id ${videoId} not found. Creating new video ...`);
      fetchedVideo = new Video(userId, videoId, video.movieProgress, video.movieStarCount, video.movieUTCTime);
    } else {
      fetchedVideo.movieProgress = video.movieProgress;
      fetchedVideo.movieStarCount = video.movieStarCount;
      fetchedVideo.movieUTCTime = video.movieUTCTime;
    }
    fetchedVideo.stepsProgress = this.filterStepsProgress(video.stepsProgress);

    return await this.videoDAO.putItemToDB(constants.VIDEO_TABLE, fetchedVideo);
  }

  public async getCollectionProgress(userId: string, collectionId: string): Promise<Collection> {

    if (!userId || !collectionId) throw new BadRequestException('userId and collectionId are strict params');

    const appUser: IAppUser = await this.appUserDAO.getItemFromDB(constants.APP_USER_TABLE, userId);
    if (!appUser) throw new NotFoundException(`User with id ${userId} not found`);

    const collection = await this.collectionDAO.getItemByGSI(
      constants.COLLECTION_TABLE,
      'collectionId-index',
      'collectionId = :collectionId',
      { ':collectionId': collectionId });

    if (!collection) throw new NotFoundException(`Collection with id ${collectionId} not found`);
    return collection;
  }

  public async putCollectionProgress(userId: string, collectionId: string, collection: Collection): Promise<CommonSuccessResponse> {

    if (!userId || !collectionId) throw new BadRequestException('userId and collectionId are strict params');
    if (!collection) throw new BadRequestException('Invalid json');

    const inputValidator = validateInput(['stickers'], collection);
    if (!inputValidator.isValid) throw new BadRequestException(inputValidator.message);

    const appUser: IAppUser = await this.appUserDAO.getItemFromDB(constants.APP_USER_TABLE, userId);
    if (!appUser) throw new NotFoundException(`User with id ${userId} not found`);

    let fetchedCollection: Collection = await this.collectionDAO.getItemByGSI(
      constants.COLLECTION_TABLE,
      'collectionId-index',
      'collectionId = :collectionId',
      { ':collectionId': collectionId });

    if (!fetchedCollection) {
      console.log(`Collection with id ${collectionId} not found. Creating new collection ...`);
      fetchedCollection = new Collection(userId, collectionId);
    }
    fetchedCollection.stickers = this.filterStickers(collection.stickers);

    return await this.collectionDAO.putItemToDB(constants.COLLECTION_TABLE, fetchedCollection);
  }

  private filterStepsProgress(stepProgress: StepProgress[]) {
    let res: StepProgress[];
    if (stepProgress && stepProgress.length > 0) {
      res = [];
      stepProgress.forEach((item: StepProgress) => {
        res.push(new StepProgress(item.id, item.stepStatus));
      });
    }
    return res;
  }

  private filterStickers(stickers: Sticker[]) {
    let res: Sticker[];
    if (stickers && stickers.length > 0) {
      res = [];
      stickers.forEach((item: Sticker) => {
        res.push(new Sticker(item.id, item.stickersCount));
      });
    }
    return res;
  }
}
