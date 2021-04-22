import { Entity, PrimaryGeneratedColumn, Unique, Column, OneToMany, BeforeInsert } from 'typeorm';
import { MinLength, IsNotEmpty, IsEmail } from 'class-validator';
import * as bcrypt from 'bcryptjs';
import { Task } from './Task';

@Entity()
@Unique(['username'])
export class User  {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @MinLength(6)
  @IsEmail()
  @IsNotEmpty()
  username: string;

  @Column()
  @MinLength(6)
  @IsNotEmpty()
  password: string;

  @Column()
  @IsNotEmpty()
  role: string;

  @Column()
  @IsNotEmpty()
  area: string;

  @OneToMany(() => Task, t => t.User)
  tasks: Task[];

  @BeforeInsert()
  hashPassword(): void {
    const salt = bcrypt.genSaltSync(10);
    this.password = bcrypt.hashSync(this.password, salt);
  }

  checkPassword(password: string): boolean {
    return bcrypt.compareSync(password, this.password);
  }

}
