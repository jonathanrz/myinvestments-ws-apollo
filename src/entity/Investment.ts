import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  Generated,
  ManyToOne,
  OneToMany
} from "typeorm"

import { User } from "./User"
import { Income } from "./Income"

@Entity()
export class Investment extends BaseEntity {
  @PrimaryGeneratedColumn() id: number

  @Column()
  @Generated("uuid")
  uuid: string

  @ManyToOne(type => User)
  user: User
  @OneToMany(type => Income, income => income.investment, {
    eager: true
  })
  incomes: Income[]

  @Column({ unique: true })
  name: string

  @Column() type: string
  @Column() holder: string
  @Column() objective: string

  @Column({ nullable: true })
  dueDate: number
}
