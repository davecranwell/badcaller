import { Module } from '@nestjs/common';

import { PrismaModule } from 'src/prisma/prisma.module';
import { PhonenumbersService } from './phonenumbers.service';
import { PhonenumbersController } from './phonenumbers.controller';

@Module({
  imports: [PrismaModule],
  controllers: [PhonenumbersController],
  providers: [PhonenumbersService],
})
export class PhonenumbersModule {}
