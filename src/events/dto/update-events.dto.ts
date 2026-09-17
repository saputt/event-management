import { Type } from "class-transformer"
import { IsDate, IsOptional, IsString } from "class-validator"

export class UpdateEventsDto {
    @IsOptional()
    @IsString()
    name: string         
    
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