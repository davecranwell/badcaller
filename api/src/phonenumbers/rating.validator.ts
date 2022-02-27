import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint()
export class IsValidRatingConstraint implements ValidatorConstraintInterface {
  validate(rating: any, args: ValidationArguments) {
    return rating > 0 && rating < 10;
  }

  defaultMessage(args: ValidationArguments) {
    return '$property is not a valid rating value';
  }
}

export function IsValidRating(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidRatingConstraint,
    });
  };
}
