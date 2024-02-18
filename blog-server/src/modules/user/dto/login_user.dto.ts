import { ApiProperty } from "@nestjs/swagger"

export class LoginUserDto {
    @ApiProperty()
    name:string
    @ApiProperty()
    password:string
}
