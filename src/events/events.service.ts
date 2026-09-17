import { Injectable } from '@nestjs/common';
import { EventsRepository } from './events.repository';
import { CreateEventsDto } from './dto/create-events.dto';
import { OrganizersService } from 'src/organizers/organizers.service';

@Injectable()
export class EventsService {
    constructor(
        private eventsRepo: EventsRepository,
        private organizersService: OrganizersService
    ) {}

    async createEvents(dto: CreateEventsDto, userId: string) {
        const organizer = await this.organizersService.isUserHaveOrganizer(userId)

        return this.eventsRepo.createEvents(dto, organizer.id)
    }
}
