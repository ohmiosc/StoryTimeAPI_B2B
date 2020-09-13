import { ClassSerializerInterceptor, Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import * as constants from '../constants';
import { ApiBadRequestResponse, ApiImplicitQuery, ApiOkResponse } from '@nestjs/swagger';
import { ErrorResponse } from '../responses/error_response';
import { ContentService } from '../services/content_service';
import { plainToClass } from 'class-transformer';
import { ContentVersion } from '../models/content_version';

@Controller()
export class ContentController {

  constructor(private contentService: ContentService) {
  }

  @Get(constants.AVAILABLE_CONTENT_VERSIONS_PATH)
  @ApiImplicitQuery({ name: 'client_id', type: String })
  @ApiImplicitQuery({ name: 'content_env', type: String })
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOkResponse({ description: 'Successful response', type: [ContentVersion] })
  @ApiBadRequestResponse({ description: 'Bad request response', type: ErrorResponse })
  public async getContentVersions(@Query('client_id') client_id: string,
                                  @Query('content_env') content_env: string) {
    console.log(`Get all content versions with client_id ${client_id} and content_env ${content_env} `);
    const response = await this.contentService.getContentVersions(client_id, content_env);
    console.log('Get all content versions response = ', response);
    return plainToClass(ContentVersion, response);
  }

}
