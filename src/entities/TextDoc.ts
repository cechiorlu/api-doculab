import { ObjectType, Field } from "type-graphql";
import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, UpdateDateColumn, PrimaryColumn, ManyToOne, OneToMany } from "typeorm";
import { User } from "./User";

@ObjectType()
@Entity()
export class TextDoc extends BaseEntity {

    @Field()
    @PrimaryColumn()
    id!: string;

    @Field({ nullable: true })
    @Column()
    title?: string;

    @Field()
    @Column()
    creatorId: number;

    // @Field()
    // @OneToOne(() => User, (user) => user.documents)
    // creator: User;

    // @Field()
    // @OneToMany(() => User, (user) => user.documents)
    // viewers: User;

    // @Field()
    // @OneToMany(() => User, (user) => user.documents)
    // editors: User;

    @Field(() => String)
    @CreateDateColumn()
    createdAt: Date;

    @Field(() => String)
    @UpdateDateColumn()
    updatedAt: Date;
}