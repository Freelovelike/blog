import { Column, Entity } from "typeorm"
import { Content } from "./content.entity"


@Entity()
export class Gallery extends Content{


    @Column()
    url:string
    @Column()
    height:number
    @Column()
    width:number
}