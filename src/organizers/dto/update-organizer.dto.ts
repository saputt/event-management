import { IsNotEmpty, IsOptional, IsString } from "class-validator"

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
}