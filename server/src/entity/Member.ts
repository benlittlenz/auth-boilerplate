import { Entity, PrimaryGeneratedColumn } from "typeorm";

// @ObjectType()
@Entity("team")
export class Member {
  @PrimaryGeneratedColumn() id: number;
}
