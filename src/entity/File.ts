import { Base } from "./Base";
import { Entity, Column, ChildEntity } from "typeorm";

@Entity()
export class File extends Base {

  @Column({
    default: null
  })
  name: string;

  @Column({
    default: null
  })
  url: string;

}