import {
  Entity,
  ObjectIdColumn,
  ObjectId,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity()
export class Content {
  @ObjectIdColumn(
  )
  id?: ObjectId;

  @CreateDateColumn({
    name: 'create_time',
    default: new Date(),
  })
  createTime?: Date;
  @UpdateDateColumn({
    name: 'update_time',
    default: new Date(),
  })
  updateTime?: Date;
  @DeleteDateColumn({
    name: 'delete_time',
    nullable:true,
  })
  deleteAt: Date | null;

  @Column({
    default: ()=>"11111",
  })
  isDelete: boolean = false;
}
