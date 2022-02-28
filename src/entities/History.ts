import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  CreateDateColumn,
  JoinColumn,
  ManyToMany,
  JoinTable,
  ManyToOne,
} from "typeorm";
import { Client } from "./Client";
import { Product } from "./Product";

@Entity()
export class History {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  SearchString: string;

  @ManyToMany(() => Product)
  @JoinTable({name: 'history_consulted',})
  ConsultedProducts: Product[];

  @Column()
  @CreateDateColumn()
  consultedAt: Date;

  @ManyToOne((client) => Client, { onDelete: "CASCADE" })
  @JoinColumn()
  Client: Client;
}
