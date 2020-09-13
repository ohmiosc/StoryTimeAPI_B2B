import { BadRequestException, Injectable } from '@nestjs/common';
import { isEmpty } from '../lib/validator';
import { ContentVersionDAO } from '../dao/content_version_dao';
import * as constants from '../constants';
import { ContentVersion } from '../models/content_version';

@Injectable()
export class ContentService {

  constructor(private contentVersionDAO: ContentVersionDAO) {
  }

  public async getContentVersions(clientVersion: string, env: string): Promise<ContentVersion[]>{

    if (!env || isEmpty(env)) throw new BadRequestException('env is empty');
    if (env !== 'dev' && env !== 'qa' && env !== 'prod') throw new BadRequestException('wrong env specified');
    const contentVersionTable = env + constants.CONTENT_VERSION_TABLE_ENV;
    return await this.contentVersionDAO.getAllItems(contentVersionTable);

  }

}
