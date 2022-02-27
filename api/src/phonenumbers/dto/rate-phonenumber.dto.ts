import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

import { IsValidRating } from '../rating.validator';
import { IsValidPhoneNumber } from '../phoneNumber.validator';

export class RatePhonenumberDto {
  @ApiProperty({ required: true })
  @IsValidPhoneNumber()
  @IsNotEmpty()
  @IsString()
  phonenumber: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsNumber()
  @IsValidRating()
  rating: number;
}
