import { Entity, ObjectIdColumn, ObjectId, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm"
import { Content } from "./content.entity"


@Entity()
export class Label extends Content{

    @Column()
    name:string
    @Column()
    description:string
    @Column()
    articleId
}