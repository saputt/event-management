import { IsNotEmpty, IsOptional, IsString } from "class-validator"

export class CreateOrganizerDto {
    @IsNotEmpty()
    @IsString()
    name: string

    @IsOptional()
    @IsString()
    description: string

    @IsOptional()
    @IsString()
    address: string
}