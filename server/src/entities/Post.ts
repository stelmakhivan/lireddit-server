import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  ManyToOne,
} from 'typeorm'
import { ObjectType, Field, Int } from 'type-graphql'
import { User } from './User'

@ObjectType()
@Entity()
export class Post extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number

  @Field(() => String)
  @Column()
  title!: string

  @Field(() => String)
  @Column()
  text!: string

  @Field(() => String)
  @Column({ type: 'int', default: 0 })
  points!: number

  @Field()
  @Column()
  creatorId: number

  @ManyToOne(() => User, (user) => user.posts)
  creator: User

  @Field(() => String)
  @CreateDateColumn({ type: 'date' })
  createdAt: Date

  @Field(() => String)
  @UpdateDateColumn({ type: 'date' })
  updatedAt: Date
}
