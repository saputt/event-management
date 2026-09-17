import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { EventsRepository } from './events.repository';
import { OrganizersModule } from 'src/organizers/organizers.module';

@Module({
  controllers: [EventsController],
  providers: [EventsService, EventsRepository],
  imports: [PrismaModule, OrganizersModule]
})
export class EventsModule {}
