import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateEventsDto } from "./dto/create-events.dto";
import { UpdateEventsDto } from "./dto/update-events.dto";

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
            }
        })
    }

    updateEvent(dto: UpdateEventsDto, eventId: string) {
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
            }
        })
    }
}