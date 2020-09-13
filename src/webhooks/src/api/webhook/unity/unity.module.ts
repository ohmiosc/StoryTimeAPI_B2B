import { Module } from '@nestjs/common';
import { UnityController } from './unity.controller';
import { ConfigService } from '../../../config/config.service';
import { UnityService } from './unity.service';
import { AppcenterService } from '../../appcenter/appcenter.service';

@Module({
    controllers: [UnityController],
    providers: [ConfigService, UnityService, AppcenterService]
})
export class UnityModule {}
