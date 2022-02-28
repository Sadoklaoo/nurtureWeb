import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
  ManyToOne,
} from "typeorm";
import { Client } from "./Client";

@Entity()
export class Allergy {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable:true})
  AllergyName: string;

  @ManyToOne((client) => Client, { onDelete: "CASCADE" })
  @JoinColumn()
  client: Client;
}
