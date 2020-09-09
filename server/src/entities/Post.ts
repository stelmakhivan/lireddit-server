import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
} from 'typeorm'
import { ObjectType, Field, Int } from 'type-graphql'

@ObjectType()
@Entity()
export class Post extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number

  @Field(() => String)
  @CreateDateColumn({ type: 'date' })
  createdAt: Date

  @Field(() => String)
  @UpdateDateColumn({ type: 'date' })
  updatedAt: Date

  @Field(() => String)
  @Column()
  title!: string
}
