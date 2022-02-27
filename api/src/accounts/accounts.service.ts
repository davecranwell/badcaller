import { NotFoundException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { PrismaService } from 'src/prisma/prisma.service';
import { AccountEntity } from './account.entity';

@Injectable()
export class AccountsService {
  constructor(private prisma: PrismaService) {}

  async getById(id: number) {
    const user = await this.prisma.account.findUnique({ where: { id } });
    if (user) {
      return new AccountEntity(user);
    }
    throw new NotFoundException('User with this id does not exist');
  }

  async getByEmail(email: string): Promise<AccountEntity> {
    const user = await this.prisma.account.findUnique({
      where: { email: email.toLowerCase() },
    });
    if (user) {
      return new AccountEntity(user);
    }
    throw new NotFoundException('User with this email does not exist');
  }

  async create(accountData: {
    email: string;
    password?: string;
  }): Promise<AccountEntity> {
    return new AccountEntity(
      await this.prisma.account.create({
        data: {
          ...accountData,
          createdDate: new Date().toISOString(),
          lastAuthDate: new Date().toISOString(),
        },
      }),
    );
  }

  async setRefreshToken(refreshToken: string, userId: number) {
    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
    await this.prisma.account.update({
      where: { id: userId },
      data: { refreshTokenHash },
    });
  }

  async removeRefreshToken(userId: number) {
    return this.prisma.account.update({
      where: { id: userId },
      data: { refreshTokenHash: null },
    });
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: number) {
    const user = await this.prisma.account.findUnique({
      where: { id: userId },
    });

    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.refreshTokenHash,
    );

    if (isRefreshTokenMatching) return new AccountEntity(user);
  }
}
