import { ApiProperty } from '@nestjs/swagger';
import { Phonenumber } from '@prisma/client';
import { Transform } from 'class-transformer';

export class PhonenumberEntity implements Phonenumber {
  @ApiProperty({ required: true })
  @Transform(({ value }) => value.toString())
  id: bigint;

  @ApiProperty()
  createdDate: Date;

  constructor(partial: Partial<PhonenumberEntity>) {
    Object.assign(this, partial);
  }
}
