import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator"
import { OrganizerStatus } from "generated/prisma/enums"

export class UpdateOrganizerDto {
    @IsOptional()
    @IsString()
    name: string

    @IsOptional()
    @IsString()
    description: string

    @IsOptional()
    @IsString()
    address: string

    @IsOptional()
    @IsEnum(OrganizerStatus)
    status: OrganizerStatus
}