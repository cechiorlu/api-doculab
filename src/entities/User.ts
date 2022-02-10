import { ObjectType, Field } from "type-graphql";
import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, OneToMany } from "typeorm";

@ObjectType()
@Entity()
export class User extends BaseEntity {

    @Field()
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column()
    name?: string;

    @Field()
    @Column({ unique: true })
    email!: string;

    @Field({ nullable: true })
    @Column({ default: "" })
    profile?: string;

    @Column()
    password!: string;

    @Field(() => String)
    @CreateDateColumn()
    createdAt: Date;

    // @OneToMany(() => Document, (doc) => doc.creator)
    // documents: Document[];


    // @OneToMany(() => Document, (doc) => doc.editor)
    // documents: Document[];


    // @OneToMany(() => Document, (doc) => doc.viewer)
    // documents: Document[];
}