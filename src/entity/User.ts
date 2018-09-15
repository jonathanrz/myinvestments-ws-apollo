import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  BeforeInsert,
  BeforeUpdate
} from "typeorm"
import * as bcrypt from "bcrypt"

const SALT_ROUNDS = 5

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn() id: number

  @Column({ unique: true })
  email: string

  @Column() password: string

  @BeforeInsert()
  @BeforeUpdate()
  async encryptPassword() {
    this.password = await bcrypt.hash(this.password, SALT_ROUNDS)
  }

  validatePassword(plainTextPassword: string) {
    return bcrypt.compare(plainTextPassword, this.password)
  }
}
