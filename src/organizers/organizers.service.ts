import { Injectable } from '@nestjs/common';
import { OrganizersRepository } from './organizers.repository';
import { CreateOrganizerDto } from './dto/create-organizer.dto';

@Injectable()
export class OrganizersService {
    constructor(private organizerRepo: OrganizersRepository) {}

    async createOrganizer(dto: CreateOrganizerDto, userId: string) {
        return this.organizerRepo.createOrganizer(dto, userId)
    }
}

