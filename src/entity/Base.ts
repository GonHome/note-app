import { 
  Entity, 
  BaseEntity, 
  CreateDateColumn, 
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  Column,
  ObjectIdColumn,
  ObjectID, 
} from "typeorm";

export class Base extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    /** 创建时间 */
    @CreateDateColumn()
    createTime: string

    /** 更新时间 */
    @CreateDateColumn()
    updateTime: string

    @Column({
      default: false
    })
    isDelete: boolean;

}