import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { EventsRepository } from './events.repository';

@Module({
  controllers: [EventsController],
  providers: [EventsService, EventsRepository],
  imports: [PrismaModule]
})
export class EventsModule {}
