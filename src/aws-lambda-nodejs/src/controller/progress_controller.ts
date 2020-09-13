import { Body, ClassSerializerInterceptor, Controller, Get, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { StarProgressService } from '../services/star_progress_service';
import * as constants from '../constants';
import { ApiBadRequestResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse } from '@nestjs/swagger';
import { StarsProgress } from '../models/stars_progress_model';
import { SetStarsProgressRequest } from '../requests/set_stars_progress_request';
import { ErrorResponse } from '../responses/error_response';
import { PageProgressService } from '../services/page_progress_service';
import { Game } from '../models/game_model';
import { plainToClass } from 'class-transformer';
import { CommonSuccessResponse } from '../responses/common_success_response';
import { Video } from '../models/video_model';
import { Collection } from '../models/collection_model';
import { SpinnerGameProgressService } from '../services/spinner_game_progress_service';
import { SpinnerGameProgress } from '../models/spinner_game_progress_model';
import { GetSpinnerProgressRequest } from '../requests/get_spinner_progress_request';
import { SetUserDataResponse } from '../responses/user_data_response';

@Controller()
export class ProgressController {

  constructor(private starsProgressService: StarProgressService,
              private pageProgressService: PageProgressService,
              private spinnerGameProgressService: SpinnerGameProgressService,
  ) {
  }

  @Get(constants.STARS_PROGRESS_PATH)
  @ApiOkResponse({ description: 'Successful response', type: StarsProgress })
  @ApiBadRequestResponse({ description: 'Bad request response', type: ErrorResponse })
  @ApiNotFoundResponse({ description: 'Not found response', type: ErrorResponse })
  public async getStars(@Param('id') id: string) {
    console.log('Get stars progress API input = ', id);
    const starsProgress = await this.starsProgressService.getStarsProgress(id);
    console.log('Get stars progress API output = ', starsProgress);

    return starsProgress;
  }

  @Post(constants.STARS_PROGRESS_PATH)
  @ApiOkResponse({ description: 'Successful response', type: StarsProgress })
  @ApiBadRequestResponse({ description: 'Bad request response', type: ErrorResponse })
  @ApiNotFoundResponse({ description: 'Not found response', type: ErrorResponse })
  public async setStars(@Param('id') id: string, @Body() setStarsProgressRequest: SetStarsProgressRequest) {
    console.log('Set stars progress API input = ', setStarsProgressRequest);
    const setStarsProgressResponse = await this.starsProgressService.setStarsProgress(id, setStarsProgressRequest);
    console.log('Set stars progress API output = ', setStarsProgressResponse);
    return setStarsProgressResponse;

  }

  @Get(constants.GAME_PROGRESS_PATH)
  @ApiOkResponse({ description: 'Successful Response', type: Game })
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBadRequestResponse({ description: 'Bad Request Response', type: ErrorResponse })
  @ApiNotFoundResponse({ description: 'Not Found Response', type: ErrorResponse })
  public async getGameProgress(@Param('id') userId: string, @Param('gameId') gameId): Promise<Game> {
    console.log(`Getting game progress with userId = ${userId} and gameId = ${gameId} ...`);
    const game: Game = await this.pageProgressService.getGameProgress(userId, gameId);
    console.log('Get game progress response = ', game);
    return plainToClass(Game, game);

  }

  @Put(constants.GAME_PROGRESS_PATH)
  @ApiOkResponse({ description: 'Successful Response', type: CommonSuccessResponse })
  @ApiBadRequestResponse({ description: 'Bad Request Response', type: ErrorResponse })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Response', type: ErrorResponse })
  @ApiNotFoundResponse({ description: 'Not Found Response', type: ErrorResponse })
  public async putGameProgress(@Param('id') userId: string, @Param('gameId') gameId, @Body() game: Game) {
    console.log(`Putting game progress with userId = ${userId} and gameId = ${gameId} and game ${JSON.stringify(game)} ...`);
    const response = await this.pageProgressService.putGameProgress(userId, gameId, game);
    console.log('Put game progress response = ', response);
    return response;

  }

  @Get(constants.VIDEO_PROGRESS_PATH)
  @ApiOkResponse({ description: 'Successful Response', type: Video })
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBadRequestResponse({ description: 'Bad Request Response', type: ErrorResponse })
  @ApiNotFoundResponse({ description: 'Not Found Response', type: ErrorResponse })
  public async getVideoProgress(@Param('id') userId: string, @Param('videoId') videoId): Promise<Video> {
    console.log(`Getting video progress with userId = ${userId} and videoId = ${videoId} ...`);
    const video: Video = await this.pageProgressService.getVideoProgress(userId, videoId);
    console.log('Get video progress response = ', video);
    return plainToClass(Video, video);

  }

  @Put(constants.VIDEO_PROGRESS_PATH)
  @ApiOkResponse({ description: 'Successful Response', type: CommonSuccessResponse })
  @ApiBadRequestResponse({ description: 'Bad Request Response', type: ErrorResponse })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Response', type: ErrorResponse })
  @ApiNotFoundResponse({ description: 'Not Found Response', type: ErrorResponse })
  public async putVideoProgress(@Param('id') userId: string, @Param('videoId') videoId, @Body() video: Video) {
    console.log(`Putting video progress with userId = ${userId} and videoId = ${videoId} and video ${JSON.stringify(video)} ...`);
    const response = await this.pageProgressService.putVideoProgress(userId, videoId, video);
    console.log('Put video progress response = ', response);
    return response;

  }

  @Get(constants.COLLECTION_PROGRESS_PATH)
  @ApiOkResponse({ description: 'Successful Response', type: Collection })
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBadRequestResponse({ description: 'Bad Request Response', type: ErrorResponse })
  @ApiNotFoundResponse({ description: 'Not Found Response', type: ErrorResponse })
  public async getCollectionProgress(@Param('id') userId: string, @Param('collectionId') collectionId): Promise<Collection> {
    console.log(`Getting collection progress with userId = ${userId} and collectionId = ${collectionId} ...`);
    const collection: Collection = await this.pageProgressService.getCollectionProgress(userId, collectionId);
    console.log('Get collection progress response = ', collection);
    return plainToClass(Collection, collection);

  }

  @Put(constants.COLLECTION_PROGRESS_PATH)
  @ApiOkResponse({ description: 'Successful Response', type: CommonSuccessResponse })
  @ApiBadRequestResponse({ description: 'Bad Request Response', type: ErrorResponse })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Response', type: ErrorResponse })
  @ApiNotFoundResponse({ description: 'Not Found Response', type: ErrorResponse })
  public async putCollectionProgress(@Param('id') userId: string, @Param('collectionId') collectionId, @Body() collection: Collection) {
    console.log(`Putting collection progress with userId = ${userId} and collectionId = ${collectionId} and video ${JSON.stringify(collection)} ...`);
    const response = await this.pageProgressService.putCollectionProgress(userId, collectionId, collection);
    console.log('Put collection progress response = ', response);
    return response;
  }

  @Post(constants.SET_SPINNER_GAME_PROGRESS)
  @ApiOkResponse({ description: 'Successful response', type: CommonSuccessResponse })
  @ApiBadRequestResponse({ description: 'Bad request response', type: ErrorResponse })
  @ApiNotFoundResponse({ description: 'Not found response', type: ErrorResponse })
  public async putSpinnerProgress(@Body() input: SpinnerGameProgress): Promise<CommonSuccessResponse> {
    console.log('Putting spinner progress ' + JSON.stringify(input));
    const response: (SetUserDataResponse | ErrorResponse) = await this.spinnerGameProgressService.setSpinnerGameProgress(input);
    console.log('Put spinner progress returns ', response);
    return response;
  }

  @Post(constants.GET_SPINNER_GAME_PROGRESS)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOkResponse({ description: 'Successful response', type: SpinnerGameProgress })
  @ApiBadRequestResponse({ description: 'Bad request response', type: ErrorResponse })
  @ApiNotFoundResponse({ description: 'Not found response', type: ErrorResponse })
  public async getSpinnerProgress(@Body() input: GetSpinnerProgressRequest): Promise<SpinnerGameProgress> {
    console.log('Getting spinner progress with input = ', input);
    const spinnerProgress: SpinnerGameProgress | ErrorResponse = await this.spinnerGameProgressService.getSpinnerGameProgress(input);
    console.log('Get spinner progress returns ', spinnerProgress);
    return plainToClass(SpinnerGameProgress, spinnerProgress);
  }
}
