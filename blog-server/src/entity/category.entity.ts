import { Entity, ObjectIdColumn, ObjectId, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm"
import { Content } from "./content.entity"
import { IsString } from "class-validator"


@Entity()
export class Category extends Content{
    
    @Column()
    @IsString()
    name:string

    @Column()
    @IsString()
    description:string
    
    @Column()
    @IsString()
    articleId
}