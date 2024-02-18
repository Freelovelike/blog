import { Entity, ObjectIdColumn, ObjectId, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm"
import { Content } from "./content.entity"


@Entity()
export class User extends Content{
    @Column()
    account:string
    @Column()
    ip:string
    @Column()
    name:string
    @Column()
    avatar:string
    @Column()
    password:string
}