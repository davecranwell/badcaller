import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  Paramtype,
} from '@nestjs/common';

@Injectable()
export class LowerCasePipe implements PipeTransform {
  constructor(private source: string, private fields: string[]) {}

  transform(value: any, metadata: ArgumentMetadata) {
    if (!value || metadata?.type !== this.source) return value;

    this.fields.forEach((field) => {
      value[field] && (value[field] = value[field].toLowerCase());
    });

    return value;
  }
}
