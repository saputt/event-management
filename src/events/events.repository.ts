import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateEventsDto } from "./dto/create-events.dto";

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
}