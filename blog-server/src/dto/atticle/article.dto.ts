import { ApiProperty } from "@nestjs/swagger"

export class ArticleCreateDto {
    @ApiProperty({description:"文章标题",example:"网易春风"})
    title:string=""
    @ApiProperty({description:"文章内容",example:"网易春风"})
    content:string=""
    
    @ApiProperty({description:"作者id",example:"1"})
    PresenterId:string
    @ApiProperty({description:"文章分类",example:"前端"})
    category:string
    @ApiProperty({description:"文章描述",example:"这是"})
    description
}