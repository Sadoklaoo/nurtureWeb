import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
  ManyToOne
  } from "typeorm";
import { Client } from "./Client";
import { User } from "./User";

  
  @Entity()
  export class Skin{
  
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    SkinDescription: string;
  
    @Column()
    SkinType: SkinTypes;

    @Column({ type: "float" })
    Nature: number;

    @Column({ type: "float" })
    Hydratation: number;

    @Column({ type: "float" })
    Imperfection: number;

    @Column({ type: "float" })
    Sensitivity: number;

    @Column({ type: "float" })
    Eclat: number;

    @Column({ type: "float" })
    AntiAge: number;

    @OneToOne(() => Client, (client) => client.Skin)
    @JoinColumn()
    Client:Client
    
  
  }
  
  enum SkinTypes {
    Normal="NORMAL",
    Dry="DRY",
    Oily="OILY",
    Combination="COMBINATION"

  }
  
  
  
  
  
  
  