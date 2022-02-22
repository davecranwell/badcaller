import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { Auth as AuthModel } from '@prisma/client';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import JwtAuthenticationGuard from 'src/authentication/guards/jwtAuthentication.guard';
import { UpdatesService } from './updates.service';

@ApiTags('Updates')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthenticationGuard)
@Controller('updates')
export class UpdatesController {
  constructor(private readonly updateService: UpdatesService) {}

  @Get(':id')
  async getUpdate(@Param('id') id: string): Promise<AuthModel> {
    return this.updateService.getUpdate(Number(id));
  }

  @Get()
  getUpdates(): Promise<AuthModel[]> {
    return this.updateService.getUpdates();
  }
}
