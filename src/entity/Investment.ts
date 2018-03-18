import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  Generated,
  ManyToOne
} from "typeorm"

import { User } from "./User"

@Entity()
export class Investment extends BaseEntity {
  @PrimaryGeneratedColumn() id: number

  @Column()
  @Generated("uuid")
  uuid: string

  @ManyToOne(type => User)
  user: User

  @Column({ unique: true })
  name: string

  @Column() type: string
  @Column() holder: string
  @Column() objective: string

  @Column({ nullable: true })
  dueDate: number
}
