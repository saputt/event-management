import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { OrganizersService } from './organizers.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CreateOrganizerDto } from './dto/create-organizer.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { RoleGuard } from 'src/common/guards/roles.guard';
import { UserRole } from 'generated/prisma/enums';

@UseGuards(JwtAuthGuard)
@Controller('organizers')
export class OrganizersController {
  constructor(private readonly organizersService: OrganizersService) {}

  @UseGuards(RoleGuard(UserRole.ORGANIZER))
  @Post()
  async createOrganizer(@Body() dto: CreateOrganizerDto, @CurrentUser("userId") userId: string) {
    return {
      message: 'Organizer created successfully',
      data: await this.organizersService.createOrganizer(dto, userId)
    }
  }
}
