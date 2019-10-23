import { ObjectType, Field, Int } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  JoinTable,
  ManyToMany,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { Member } from "./Member";
import { User } from "./User";

@ObjectType()
@Entity("team")
export class Team extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column({ nullable: true })
  profileId: number;

  @ManyToMany(() => Member)
  @JoinTable()
  member: Member[];

  @OneToOne(() => User)
  @JoinColumn()
  user: User;
}
