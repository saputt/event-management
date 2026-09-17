import { Type } from "class-transformer"
import { IsDate, IsEnum, IsOptional, IsString } from "class-validator"
import { EventStatus } from "generated/prisma/enums"

export class UpdateEventsDto {
    @IsOptional()
    @IsString()
    name: string         
    
    @IsOptional()
    @IsEnum(EventStatus)
    status: EventStatus    

    @IsOptional()
    @IsString()
    description: string
    
    @IsOptional()
    @Type(() => Date) 
    @IsDate()
    startAt: Date

    @IsOptional()
    @Type(() => Date) 
    @IsDate()
    endAt: Date
}