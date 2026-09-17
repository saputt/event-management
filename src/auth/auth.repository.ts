import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { RegisterDto } from "./dto/register.dto";

@Injectable()
export class AuthRepository {
    constructor(private prisma: PrismaService) {}

    createUser(registerDto: RegisterDto) {
        return this.prisma.user.create({
            data: registerDto
        })
    }

    findUserById(userId: string) {
        return this.prisma.user.findUnique({
            where: {
                id: userId
            }
        })
    }

    findUserByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: {
                email
            }
        })
    }
}