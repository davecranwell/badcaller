import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

import { IsValidPhoneNumber } from '../phoneNumber.validator';

export class CreatePhonenumberDto {
  @ApiProperty({ required: true })
  @IsValidPhoneNumber()
  @IsNotEmpty()
  @IsString()
  phonenumber: string;
}
