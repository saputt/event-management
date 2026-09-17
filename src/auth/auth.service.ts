import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserRole } from 'generated/prisma/enums';
import { RegisterDto } from './dto/register.dto';
import { hashing } from 'src/common/helpers/hash.helper';

@Injectable()
export class AuthService {
    constructor(
        private authRepo: AuthRepository,
        private jwt: JwtService,
        private configService: ConfigService
    ) {}

    async isEmailAlreadyExist(email: string) {
        const user = await this.authRepo.findUserByEmail(email)
        
        if (user) {
            throw new UnauthorizedException("Unauthorized")
        }

        return user
    }

    async register(registerDto: RegisterDto) {
        await this.isEmailAlreadyExist(registerDto.email)

        return this.authRepo.createUser({
            email: registerDto.email,
            name: registerDto.name,
            password: await hashing.hash(registerDto.password),
            role: registerDto.role ?? UserRole.USER
        })
    }
}
