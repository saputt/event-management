import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateEventsDto } from "./dto/create-events.dto";
import { UpdateEventsDto } from "./dto/update-events.dto";
import { EventStatus, OrganizerStatus } from "generated/prisma/enums";

@Injectable()
export class EventsRepository {
    constructor(private prisma: PrismaService) {}

    createEvents(dto: CreateEventsDto, organizerId: string) {
        return this.prisma.event.create({
            data: {
                description: dto.description,
                endAt: dto.endAt,
                name: dto.name,
                startAt: dto.startAt,
                organizerId
            }
        })
    }

    findEventById(eventId: string) {
        return this.prisma.event.findUnique({
            where: {
                id: eventId
            },
            include: {
                organizer: true
            }
        })
    }

    updateEvent(dto: UpdateEventsDto, eventId: string) {
        console.log(dto)
        return this.prisma.event.update({
            where: {
                id: eventId
            },
            data: {
                ...(dto.description && {
                    description: dto.description
                }),
                ...(dto.endAt && {
                    endAt: new Date(dto.endAt)
                }),
                ...(dto.name && {
                    name: dto.name
                }),
                ...(dto.startAt && {
                    startAt: new Date(dto.startAt)
                }),
                ...(dto.status && {
                    status: dto.status
                }),
            }
        })
    }

    findAllEvents() {
        return this.prisma.event.findMany({
            where: {
                status: EventStatus.PUBLIC,
                organizer: {
                    status: OrganizerStatus.ACTIVE
                }
            }
        })
    }

    findMyEvents(userId: string) {
        return this.prisma.event.findMany({
            where: {
                organizer: {
                    userId
                }
            }
        })
    }

    deleteEvent(eventId: string) {
        return this.prisma.event.delete({
            where: {
                id: eventId
            }
        })
    }
}