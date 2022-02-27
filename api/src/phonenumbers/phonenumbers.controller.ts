import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';

import { PhonenumbersService } from './phonenumbers.service';
import { PhonenumberEntity } from './entities/phonenumber.entity';
import { CreatePhonenumberDto } from './dto/create-phonenumber.dto';
import { RatePhonenumberDto } from './dto/rate-phonenumber.dto';
import { UpdatePhonenumberDto } from './dto/update-phonenumber.dto';

@ApiTags('Phone numbers')
@UseGuards(ThrottlerGuard)
@Controller('phonenumbers')
@UseInterceptors(ClassSerializerInterceptor)
export class PhonenumbersController {
  constructor(private readonly phonenumbersService: PhonenumbersService) {}

  @Post()
  async create(@Body() createPhonenumberDto: CreatePhonenumberDto) {
    return this.phonenumbersService.create(createPhonenumberDto);
  }

  @Post('/rate')
  async rate(@Body() ratePhoneNumberDto: RatePhonenumberDto) {
    return this.phonenumbersService.rate(ratePhoneNumberDto);
  }

  // @Get()
  // findAll() {
  //   return this.phonenumbersService.findAll();
  // }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.phonenumbersService.findOne(BigInt(id));
  }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updatePhonenumberDto: UpdatePhonenumberDto,
  // ) {
  //   return this.phonenumbersService.update(+id, updatePhonenumberDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.phonenumbersService.remove(+id);
  // }
}
