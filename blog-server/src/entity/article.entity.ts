import {
  Column,
  Entity
} from 'typeorm';
import { Content } from './content.entity';

@Entity()
export class Article extends Content {
  @Column()
  title: string = '';

  @Column()
  content: string = '';

  @Column({
    default: 1,
  })
  likes: number = 0;

  @Column({
    default: ()=>0,
  })
  views: number = 0;

  @Column()
  PresenterId: string;

  @Column()
  category:string

  @Column()
  description:string
}
