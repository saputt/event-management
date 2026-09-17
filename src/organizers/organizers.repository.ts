import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateOrganizerDto } from "./dto/create-organizer.dto";

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
}