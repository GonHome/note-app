import { Base } from "./Base";
import { Entity, Column, ManyToOne, JoinColumn, OneToMany, ManyToMany, JoinTable } from "typeorm";
import { Note } from "./Note";

@Entity()
export class Tag extends Base {

  @Column({
    default: '未命名'
  })
  name: string;

  

  @ManyToMany(type => Note, note => note.tags)
  @JoinTable()
  notes: Note[];

}