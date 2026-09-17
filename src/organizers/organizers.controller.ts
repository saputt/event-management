import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { OrganizersService } from './organizers.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CreateOrganizerDto } from './dto/create-organizer.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { RoleGuard } from 'src/common/guards/roles.guard';
import { UserRole } from 'generated/prisma/enums';
import { UpdateOrganizerDto } from './dto/update-organizer.dto';

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

  @UseGuards(RoleGuard(UserRole.ORGANIZER))
  @Patch("update")
  async updateOrganizer(@Body() dto: UpdateOrganizerDto, @CurrentUser("userId") userId: string) {
    return {
      message: 'Organizer updated successfully',
      data: await this.organizersService.updateOrganizer(dto, userId)
    }
  }

  @UseGuards(RoleGuard(UserRole.USER))
  @Get(":organizerId")
  async getOrganizer(@Param("organizerId") organizerId: string) {
    return {
      message: `Get organizer with id: ${organizerId} successfully`,
      data: await this.organizersService.getOrganizer(organizerId)
    }
  }
}
