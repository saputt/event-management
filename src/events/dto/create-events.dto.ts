import { Type } from "class-transformer"
import { IsDate, IsNotEmpty, IsString } from "class-validator"

export class CreateEventsDto {
    @IsNotEmpty()
    @IsString()
    name: string         
    
    @IsNotEmpty()
    @IsString()
    description: string
    
    @IsNotEmpty()
    @Type(() => Date) 
    @IsDate()
    startAt: Date

    @IsNotEmpty()
    @Type(() => Date) 
    @IsDate()
    endAt: Date
}