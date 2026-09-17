import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { EventsService } from './events.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { CreateEventsDto } from './dto/create-events.dto';
import { UpdateEventsDto } from './dto/update-events.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/roles.guard';
import { UserRole } from 'generated/prisma/enums';

@UseGuards(JwtAuthGuard)
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @UseGuards(RoleGuard(UserRole.ORGANIZER))
  @Post()
  async createEvent(@CurrentUser("userId") userId: string, @Body() dto: CreateEventsDto) {
    return {
      message: "Create events success",
      data: await this.eventsService.createEvents(dto, userId)
    }
  }

  @UseGuards(RoleGuard(UserRole.ORGANIZER))
  @Patch(":eventId")
  async updateEvent(@CurrentUser("userId") userId: string, @Body() dto: UpdateEventsDto, @Param("eventId") eventId: string) {
    return {
      message: "Update events success",
      data: await this.eventsService.updateEvents(dto, userId, eventId)
    }
  }

  @UseGuards(RoleGuard(UserRole.USER))
  @Get()
  async getAllEvents() {
    return {
      message: "Get all events success",
      data: await this.eventsService.getAllEvents()
    }
  }

  @UseGuards(RoleGuard(UserRole.ORGANIZER))
  @Get("me")
  async getMyEvents(@CurrentUser("userId") userId: string) {
    return {
      message: "Get all my events success",
      data: await this.eventsService.getAllMyEvents(userId)
    }
  }

  @Get(":eventId")
  async getEvent(@Param("eventId") eventId: string, @CurrentUser("role") role: UserRole, @CurrentUser("userId") userId: UserRole) {
    return {
      message: `Get event with id: ${eventId} success`,
      data: await this.eventsService.getEvent(eventId, role, userId)
    }
  }

  @UseGuards(RoleGuard(UserRole.ORGANIZER))
  @Delete(":eventId")
  async deleteEvent(@Param("eventId") eventId: string, @CurrentUser("userId") userId: string) {
    return {
      message: `Delete event with id: ${eventId} success`,
      data: await this.eventsService.deleteEvent(eventId, userId)
    }
  }
}
