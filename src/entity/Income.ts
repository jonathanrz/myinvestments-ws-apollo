import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  Generated,
  ManyToOne
} from "typeorm"

import { Investment } from "./Investment"
import { User } from "./User"

@Entity()
export class Income extends BaseEntity {
  @PrimaryGeneratedColumn() id: number

  @Column()
  @Generated("uuid")
  uuid: string

  @ManyToOne(type => User)
  user: User
  @ManyToOne(type => Investment, investment => investment.incomes)
  investment: Investment

  @Column() date: number
  @Column() quantity: number
  @Column() value: number
  @Column({ default: 0 })
  bought: number
  @Column({ default: 0 })
  sold: number
  @Column({ default: 0 })
  gross: number
  @Column({ default: 0 })
  ir: number
  @Column({ default: 0 })
  fee: number
}
