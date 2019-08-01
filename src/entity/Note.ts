import { Base } from "./Base";
import { Entity, Column, ManyToOne, JoinColumn, OneToMany, ManyToMany } from "typeorm";
import { User } from "./User";
import { Tag } from "./Tag";
import { Annex } from "./Annex";

@Entity()
export class Note extends Base {

  @Column({
    default: '未命名'
  })
  name: string;

  @Column({
    default: false
  })
  isFavourite: boolean;

  @Column({
    default: null
  })
  language: string;

  @Column({
    default: false
  })
  isPin: boolean;

  @Column({
    default: null,
    type: 'text',
  })
  content: string;

  @ManyToOne(type => User, user => user.notes)
  @JoinColumn({name: 'user_id'})
  user: User;

  @ManyToMany(type => Tag, tag => tag.notes)
  tags: Tag[];

  @OneToMany(type => Annex, annex => annex.note)
  annexs: Annex[];

}