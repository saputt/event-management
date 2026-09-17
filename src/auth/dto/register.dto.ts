import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator"
import { UserRole } from "generated/prisma/enums"

export class RegisterDto {
    @IsNotEmpty()
    @IsString()
    email: string

    @IsNotEmpty()
    @IsString()
    password: string
    
    @IsNotEmpty()
    @IsString()
    name: string

    @IsOptional()
    @IsEnum(UserRole)
    role: UserRole
}