import {
  PrimaryGeneratedColumn,
  Column,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import {
  IsEmail,
  Min,
  Max,
  IsInt,
  Length,
  IsNotEmpty,
  MaxLength,
  MinLength,
} from "class-validator";
import * as bcrypt from "bcryptjs";

export abstract class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column({ nullable: true  })
  phoneNumber: number;

  @Column("datetime", { nullable: true })
  birthDate: Date;

  @Column({ nullable: true })
  // @Length(4, 100)
  password: string;

  @Column({ default: false })
  verified: boolean;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  role: string;
  @Column()
  sexe: string;



  hashPassword() {
    this.password = bcrypt.hashSync(this.password, 8);
  }

  checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
    return bcrypt.compareSync(unencryptedPassword, this.password);
  }
}
