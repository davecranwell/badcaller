import { Module } from '@nestjs/common';

import { PrismaModule } from 'src/prisma/prisma.module';
import { UpdatesController } from './updates.controller';
import { UpdatesService } from './updates.service';

@Module({
  imports: [PrismaModule],
  controllers: [UpdatesController],
  providers: [UpdatesService],
})
export class UpdatesModule {}
