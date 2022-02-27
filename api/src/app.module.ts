import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';

import config from './config/configuration';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthenticationModule } from './authentication/authentication.module';
import { AccountsModule } from './accounts/accounts.module';
import { PhonenumbersModule } from './phonenumbers/phonenumbers.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    AuthenticationModule,
    AccountsModule,
    ThrottlerModule.forRoot({
      ttl: 1,
      limit: 1,
    }),
    PhonenumbersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
