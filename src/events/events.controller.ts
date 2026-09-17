import { Body, Controller, Post } from '@nestjs/common';
import { EventsService } from './events.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { CreateEventsDto } from './dto/create-events.dto';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  async createEvent(@CurrentUser("userId") userId: string, @Body() dto: CreateEventsDto) {
    return {
      message: "Create events success",
      data: await this.eventsService.createEvents(dto, userId)
    }
  }
}
