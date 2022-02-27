import { PartialType } from '@nestjs/swagger';
import { CreatePhonenumberDto } from './create-phonenumber.dto';

export class UpdatePhonenumberDto extends PartialType(CreatePhonenumberDto) {}
