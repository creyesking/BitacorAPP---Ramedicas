import { Entity, PrimaryGeneratedColumn, Unique, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { MinLength, IsNotEmpty} from 'class-validator';
import { User } from './User';

@Entity()
export class Task {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  description: string;

  @Column()
  @IsNotEmpty()
  time: string;

  @ManyToOne(() => User, u => u.tasks)
  User!: User;

  @Column()
  userId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

}
