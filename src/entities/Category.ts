import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToOne,
    JoinColumn,
    OneToMany,
    JoinTable,
    ManyToOne,
  } from "typeorm";
import { Product } from "./Product";

  
  @Entity()
  export class Category {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ unique: true })
    CategoryName: string;
  
  
    @Column()
    Image: string;
  
    @OneToMany(() => Product, (product) => product.Category)
    Product: Product[];

  }
  