import { Module } from '@nestjs/common';
import { OrganizersService } from './organizers.service';
import { OrganizersController } from './organizers.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { OrganizersRepository } from './organizers.repository';

@Module({
  controllers: [OrganizersController],
  providers: [OrganizersService, OrganizersRepository],
  imports: [PrismaModule],
  exports: [OrganizersService]
})
export class OrganizersModule {}
