import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';
import { OrganizersModule } from './organizers/organizers.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    AuthModule, 
    EventsModule, 
    OrganizersModule, 
    PrismaModule,
    ConfigModule.forRoot({
        isGlobal: true,
    }),
  ]
})
export class AppModule {}
