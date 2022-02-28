import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
  JoinColumn,
  ManyToOne,
} from "typeorm";
import { Category } from "./Category";
import { Ingredient } from "./Ingredient";

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ProductName: string;

  @Column({ unique: true })
  Reference: string;

  @Column({ type: "float" })
  Price: number;

  @Column({ type: "float" })
  Rank: number;

  @Column()
  Image: string;

  @Column()
  Type: string;

  @Column()
  ProductDescription: string;
  @Column()
  ProductSecondDescription: string;

  @Column()
  ProductDimensions: string;

  @Column()
  PreferedSkinType: string;

  @ManyToMany(() => Ingredient)
  @JoinTable({name: 'product_ingredients',})
  ProductIngredients: Ingredient[];


  @ManyToOne((category) => Category, { onDelete: "CASCADE" })
  @JoinColumn()
  Category: Category;
}
