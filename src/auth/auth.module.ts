import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthRepository } from './auth.repository';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService, AuthRepository],
  imports: [
    PrismaModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        const secret = configService.get<string>('SECRET_JWT');
        if (!secret) {
          throw new Error('SECRET_JWT is not set');
        }
        return {
          secret,
          signOptions: { expiresIn: '7d' },
        };
      },
      inject: [ConfigService],
    }),
  ]
})
export class AuthModule {}
