import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';
import { OrganizersModule } from './organizers/organizers.module';

@Module({
  imports: [AuthModule, EventsModule, OrganizersModule]
})
export class AppModule {}
