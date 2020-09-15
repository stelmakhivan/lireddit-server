import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  ManyToOne,
  OneToMany,
} from 'typeorm'
import { ObjectType, Field, Int } from 'type-graphql'

import { User } from './User'
import { Updoot } from './Updoot'

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

  @Field(() => Int, { nullable: true })
  voteStatus!: number | null

  @Field()
  @Column()
  creatorId: number

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.posts)
  creator: User

  @OneToMany(() => Updoot, (updoot) => updoot.post)
  updoots: Updoot[]

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date
}
