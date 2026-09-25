import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { OrganizersRepository } from './organizers.repository';
import { CreateOrganizerDto } from './dto/create-organizer.dto';
import { UpdateOrganizerDto } from './dto/update-organizer.dto';
import { OrganizerStatus } from 'generated/prisma/enums';

@Injectable()
export class OrganizersService {
    constructor(private organizerRepo: OrganizersRepository) {}

    async isUserHaveOrganizer(userId: string) {
        const organizer = await this.organizerRepo.findOrganizerByUserId(userId)

        if (!organizer) {
            throw new NotFoundException('You dont have organizer')
        }

        return organizer
    }
    
    async isUserAlreadyHaveOrganizer(userId: string) {
        const organizer = await this.organizerRepo.findOrganizerByUserId(userId)

        if (organizer) {
            throw new ConflictException('You already have organizer')
        }

        return organizer
    }

    async createOrganizer(dto: CreateOrganizerDto, userId: string) {
        await this.isUserAlreadyHaveOrganizer(userId)

        return this.organizerRepo.createOrganizer(dto, userId)
    }

    async updateOrganizer(dto: UpdateOrganizerDto, userId: string) {
        await this.isUserHaveOrganizer(userId)

        return this.organizerRepo.updateOrganizer(dto, userId)
    }   

    async getOrganizer(organizerId: string) {
        const organizer = await this.organizerRepo.findOrganizerById(organizerId)

        if (!organizer) {
            throw new NotFoundException(`Organizer with id: ${organizerId} not found`)
        }

        if (organizer.status !== OrganizerStatus.ACTIVE) {
            throw new UnauthorizedException("Organization is no longer active")
        }

        return organizer
    }

    async getMyOrganizer(userId: string) {
        return this.isUserHaveOrganizer(userId)
    }
}

