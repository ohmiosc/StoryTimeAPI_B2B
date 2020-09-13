import { Module } from '@nestjs/common';
import { AppcenterService } from './appcenter.service';
import { ConfigService } from '../../config/config.service';

@Module({

  providers: [ConfigService],
  exports: [AppcenterService],
})
export class AppcenterModule {
}
