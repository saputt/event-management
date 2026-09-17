import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { OrganizersRepository } from './organizers.repository';
import { CreateOrganizerDto } from './dto/create-organizer.dto';
import { UpdateOrganizerDto } from './dto/update-organizer.dto';

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
}

