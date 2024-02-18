import { ApiProperty } from "@nestjs/swagger"
import { Content } from "src/entity/content.entity"
import { Entity } from "typeorm"

@Entity()
export class CreateLabelDto extends Content{
    @ApiProperty()
    name:string
    @ApiProperty()
    description:string

}

