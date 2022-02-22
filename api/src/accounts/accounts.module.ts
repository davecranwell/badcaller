import { Module } from '@nestjs/common';

import { PrismaModule } from 'src/prisma/prisma.module';
import { AccountsService } from './accounts.service';

@Module({
  imports: [PrismaModule],
  providers: [AccountsService],
  exports: [AccountsService],
})
export class AccountsModule {}
