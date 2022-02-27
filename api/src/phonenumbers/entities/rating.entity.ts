import { ApiProperty } from '@nestjs/swagger';
import { Rating } from '@prisma/client';
import { Transform, Exclude } from 'class-transformer';

export class RatingEntity implements Rating {
  @Exclude()
  id: number;

  @ApiProperty({ required: true })
  @ApiProperty()
  rating: number;

  @Exclude()
  accountId: number;

  @ApiProperty({ required: true })
  @Transform(({ value }) => value.toString())
  phonenumberId: bigint;

  @ApiProperty()
  createdDate: Date;

  constructor(partial: Partial<RatingEntity>) {
    Object.assign(this, partial);
  }
}
