import { Controller } from '@nestjs/common';
import { OrganizersService } from './organizers.service';

@Controller('organizers')
export class OrganizersController {
  constructor(private readonly organizersService: OrganizersService) {}
}
