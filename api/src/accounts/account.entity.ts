import { ApiProperty } from '@nestjs/swagger';
import { Auth } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class AccountEntity implements Auth {
  @ApiProperty({ required: true })
  id: number;

  @ApiProperty({ required: true })
  email: string;

  @ApiProperty({ required: true })
  name: string | null;

  @Exclude()
  password: string;

  accessToken: string;
  refreshToken: string;

  @Exclude()
  refreshTokenHash: string;

  constructor(partial: Partial<AccountEntity>) {
    Object.assign(this, partial);
  }
}
