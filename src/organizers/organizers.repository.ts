import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateOrganizerDto } from "./dto/create-organizer.dto";
import { UpdateOrganizerDto } from "./dto/update-organizer.dto";

@Injectable()
export class OrganizersRepository {
    constructor(private prisma: PrismaService) {}

    createOrganizer(dto: CreateOrganizerDto, userId: string) {
        return this.prisma.organizer.create({
            data: {
                name: dto.name,
                ...(dto.address && {
                    address: dto.address
                }),
                ...(dto.description && {
                    description: dto.description
                }),
                userId
            }
        })
    }

    findOrganizerByUserId(userId: string) {
        return this.prisma.organizer.findUnique({
            where: {
                userId
            }
        })
    }

    findOrganizerById(organizerId: string) {
        return this.prisma.organizer.findUnique({
            where: {
                id: organizerId
            }
        })
    }

    updateOrganizer(dto: UpdateOrganizerDto, userId: string) {
        return this.prisma.organizer.update({
            where: {
                userId
            },
            data: {
                ...(dto.name && {
                    name: dto.name
                }),
                ...(dto.description && {
                    description: dto.description
                }),
                ...(dto.address && {
                    address: dto.address
                }),
            }
        })
    }
}