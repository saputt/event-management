import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { EventsRepository } from './events.repository';
import { CreateEventsDto } from './dto/create-events.dto';
import { OrganizersService } from 'src/organizers/organizers.service';
import { UpdateEventsDto } from './dto/update-events.dto';

@Injectable()
export class EventsService {
    constructor(
        private eventsRepo: EventsRepository,
        private organizersService: OrganizersService
    ) {}

    async isEventExist(eventId: string) {
        const event = await this.eventsRepo.findEventById(eventId)

        if (!event) {
            throw new NotFoundException(`Event with id: ${eventId} doesnt exist`)
        }

        return event
    }

    async createEvents(dto: CreateEventsDto, userId: string) {
        const organizer = await this.organizersService.isUserHaveOrganizer(userId)

        return this.eventsRepo.createEvents(dto, organizer.id)
    }

    async updateEvents(dto: UpdateEventsDto, userId: string, eventId: string) {
        const organizer = await this.organizersService.isUserHaveOrganizer(userId)

        const event = await this.isEventExist(eventId)

        if (event.organizerId != organizer.id) {
            throw new UnauthorizedException(`You're not authorized to update this event`)
        }

        return this.eventsRepo.updateEvent(dto, eventId)
    }

    async getAllEvents() {
        return this.eventsRepo.findAllEvents()
    }

    async getAllMyEvents(userId: string) {
        return this.eventsRepo.findMyEvents(userId)
    }

    async getEvent(eventId: string) {
        return this.isEventExist(eventId)
    }

    async deleteEvent(eventId: string, userId: string) {
        const organizer = await this.organizersService.isUserHaveOrganizer(userId)

        const event = await this.isEventExist(eventId)

        if (event.organizerId != organizer.id) {
            throw new UnauthorizedException(`You're not authorized to delete this event`)
        }

        await this.eventsRepo.deleteEvent(eventId)

        return true
    }
}
