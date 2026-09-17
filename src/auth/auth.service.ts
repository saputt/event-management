import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthRepository } from './auth.repository';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { hashing } from 'src/common/helpers/hash.helper';
import { UserRole } from 'generated/prisma/enums';
import { JwtPayload } from 'src/common/decorators/current-user.decorator';

@Injectable()
export class AuthService {
    constructor(
        private authRepo: AuthRepository,
        private jwt: JwtService,
        private configService: ConfigService
    ) {}

    private async signToken(payloadToken: JwtPayload) {
        const secret = this.configService.get<string>('SECRET_JWT');
        if (!secret) {
            throw new BadRequestException("SECRET_JWT is not set")
        }
        return await this.jwt.signAsync(payloadToken, {
            secret,
            expiresIn: '7d',
        });
    }

    async isEmailExist(email: string) {
        const user = await this.authRepo.findUserByEmail(email)
        
        if (!user) {
            throw new UnauthorizedException("Unauthorized")
        }

        return user
    }

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
    
    async login(loginDto: LoginDto) {
        const user = await this.isEmailExist(loginDto.email)

        const isCorrectPassword = await hashing.compare(loginDto.password, user.password)

        if (!isCorrectPassword) {
            throw new UnauthorizedException("Unauthorized")
        }

        const payloadToken: JwtPayload = {
            role: user.role,
            userId: user.id
        }

        return {
            accessToken: await this.signToken(payloadToken),
            role: user.role,
            userId: user.id
        }
    }
}
