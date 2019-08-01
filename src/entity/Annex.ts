import { Base } from "./Base";
import { Entity, Column, ManyToOne, JoinColumn, OneToMany, ManyToMany, JoinTable } from "typeorm";
import { Note } from "./Note";

@Entity()
export class Annex extends Base {

  @Column({
    default: null
  })
  name: string;

  

  @ManyToOne(type => Note, note => note.annexs)
  @JoinColumn({name: 'note_id'})
  note: Note;

}