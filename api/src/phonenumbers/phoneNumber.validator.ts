import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import parsePhoneNumber from 'libphonenumber-js';

@ValidatorConstraint()
export class IsValidPhoneNumberConstraint
  implements ValidatorConstraintInterface
{
  validate(number: any, args: ValidationArguments) {
    const parsed = parsePhoneNumber(`+${number}`);

    if (!parsed || !parsed.isValid()) {
      return false;
    }
    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return '$property is not a valid phone number';
  }
}

export function IsValidPhoneNumber(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidPhoneNumberConstraint,
    });
  };
}
