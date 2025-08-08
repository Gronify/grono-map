// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from '@nestjs/swagger';
import { CreateMarkerDto } from './create-marker.dto';

export class UpdateMarkerDto extends PartialType(CreateMarkerDto) {}
