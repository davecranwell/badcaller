import {
  HttpException,
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { PostgresErrorCode } from '../types';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePhonenumberDto } from './dto/create-phonenumber.dto';
import { RatePhonenumberDto } from './dto/rate-phonenumber.dto';
import { UpdatePhonenumberDto } from './dto/update-phonenumber.dto';
import { PhonenumberEntity } from './entities/phonenumber.entity';
import { RatingEntity } from './entities/rating.entity';

@Injectable()
export class PhonenumbersService {
  constructor(private prisma: PrismaService) {}

  private async createOnly(
    createPhonenumberDto: CreatePhonenumberDto,
  ): Promise<PhonenumberEntity> {
    return new PhonenumberEntity(
      await this.prisma.phonenumber.create({
        data: {
          id: BigInt(createPhonenumberDto.phonenumber),
          createdDate: new Date().toISOString(),
        },
      }),
    );
  }

  async create(
    createPhonenumberDto: CreatePhonenumberDto,
  ): Promise<PhonenumberEntity> {
    try {
      return await this.createOnly(createPhonenumberDto);
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new BadRequestException('That phone number already exists');
      }
      if (error?.code === PostgresErrorCode.TypeMismatch) {
        throw new BadRequestException('That phone number is invalid');
      }
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async rate(ratePhonenumberDto: RatePhonenumberDto): Promise<RatingEntity> {
    // Create phone number record
    try {
      const number = await this.createOnly(ratePhonenumberDto);
    } catch (e) {}

    // Find previous rating of this number by this user
    const dupeRating = await this.prisma.rating.findFirst({
      where: {
        accountId: 1,
        phonenumberId: BigInt(ratePhonenumberDto.phonenumber),
      },
      select: {
        id: true,
      },
    });

    // manual upsert due to prisma not supporting more complex where clause in .upsert()
    if (dupeRating) {
      return new RatingEntity(
        await this.prisma.rating.update({
          where: {
            id: dupeRating.id,
          },
          data: {
            rating: ratePhonenumberDto.rating,
            createdDate: new Date().toISOString(),
          },
        }),
      );
    } else {
      return new RatingEntity(
        await this.prisma.rating.create({
          data: {
            phonenumberId: BigInt(ratePhonenumberDto.phonenumber),
            rating: ratePhonenumberDto.rating,
            accountId: 1,
            createdDate: new Date().toISOString(),
          },
        }),
      );
    }
  }

  findAll() {
    return `This action returns all phonenumbers`;
  }

  async findOne(id: bigint) {
    const phoneNumber = await this.prisma.phonenumber.findUnique({
      where: { id },
    });

    if (!phoneNumber) {
      throw new NotFoundException('This phone number does not exist');
    }

    return new PhonenumberEntity(phoneNumber);
  }

  update(id: number, updatePhonenumberDto: UpdatePhonenumberDto) {
    return `This action updates a #${id} phonenumber`;
  }

  remove(id: number) {
    return `This action removes a #${id} phonenumber`;
  }
}
