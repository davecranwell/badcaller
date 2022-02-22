import { Injectable, NotFoundException } from '@nestjs/common';
import { Auth as AuthModel } from '@prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UpdatesService {
  constructor(private prisma: PrismaService) {}

  async getUpdates(): Promise<AuthModel[]> {
    return this.prisma.auth.findMany({});
  }

  async getUpdate(id: number): Promise<AuthModel> {
    const update = await this.prisma.auth.findUnique({ where: { id } });
    if (update) return update;
    throw new NotFoundException('Update not found');
  }
}
