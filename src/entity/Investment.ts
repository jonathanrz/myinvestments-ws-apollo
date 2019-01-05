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

  @Column() name: string
  @Column() type: string
  @Column({ nullable: true })
  incomeType: string
  @Column() holder: string
  @Column() objective: string

  @Column({ nullable: true })
  dueDate: number
}
