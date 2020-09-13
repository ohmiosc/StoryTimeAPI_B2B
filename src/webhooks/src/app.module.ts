import { Module } from '@nestjs/common';
import { StoresController } from './controller/stores_controller';
import { GoogleStoreService } from './service/google_store_service';
import { AppUserDAO } from './dao/app_user_dao';
import { SubscriptionHistoryDAO } from './dao/subscription_history_dao';
import { AppUserTypeHistoryDAO } from './dao/app_user_type_history_dao';
import { AppStoreService } from './service/app_store_service';
import { TransactionDAO } from './dao/transaction_dao';
import { SubscriptionHistoryDAONew } from './dao/subscription_history_dao_new';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import {UnityModule} from "./api/webhook/unity/unity.module";

@Module({
  imports: [ConfigModule, UnityModule],
  controllers: [StoresController],
  providers: [
    GoogleStoreService,
    AppStoreService,
    ConfigService,

    AppUserDAO,
    SubscriptionHistoryDAO,
    AppUserTypeHistoryDAO,
    TransactionDAO,
    SubscriptionHistoryDAONew,
  ],
})
export class AppModule {}
