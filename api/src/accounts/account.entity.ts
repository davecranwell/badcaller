import { ApiProperty } from '@nestjs/swagger';
import { Account } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class AccountEntity implements Account {
  @ApiProperty({ required: true })
  id: number;

  @ApiProperty({ required: true })
  email: string;

  @Exclude()
  password: string;

  accessToken: string;
  refreshToken: string;

  @Exclude()
  refreshTokenHash: string;

  @Exclude()
  createdDate: Date;

  @Exclude()
  lastAuthDate: Date;

  constructor(partial: Partial<AccountEntity>) {
    Object.assign(this, partial);
  }
}
