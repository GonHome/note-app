import { Note } from "./Note";
import { Base } from "./Base";
import * as md5 from 'md5';
import {isEmpty} from 'lodash';
import { Entity, Column, OneToOne, JoinColumn, OneToMany } from "typeorm";

@Entity()
export class User extends Base {

  constructor(user: User){
    super();
    if(user && !isEmpty(user)){
      this.name = user.name;
      this.password = md5(user.password)
    }
  }

  @Column({
    unique: true
  })
  name: string;

  @Column({
    nullable: false
  })
  password: string;

  @OneToMany(type => Note, note => note.user)
  notes: Note[];

}