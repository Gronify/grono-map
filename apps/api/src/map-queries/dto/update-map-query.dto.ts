// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from '@nestjs/swagger';
import { CreateMapQueryDto } from './create-map-query.dto';

export class UpdateMapQueryDto extends PartialType(CreateMapQueryDto) {}
