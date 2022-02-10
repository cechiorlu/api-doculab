import { TextDoc } from "../entities/TextDoc";
import { Resolver, Query, Arg, Mutation, FieldResolver, Root, ObjectType, Field, Ctx, Int } from "type-graphql";
import { Repository } from "typeorm";
import { MyContext } from "../types";
import { v4 as uuidv4 } from 'uuid';

@ObjectType()
class FieldError {
    @Field()
    field: string;
    @Field()
    message: string;
}

@ObjectType()
class DocumentResponse {
    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];

    @Field(() => TextDoc, { nullable: true })
    doc?: TextDoc;
}


@Resolver(of => TextDoc)
export class DocumentResolver {

    // Get document by id
    @Query(() => TextDoc, { nullable: true })
    doc(@Arg("id", () => Int) id: number): Promise<TextDoc | undefined> {
        return TextDoc.findOne(id);
    }

    // Query to get all documents
    //  ---- add pagination later --------
    @Query(() => [TextDoc], { nullable: true })
    docs() {
        return TextDoc.find()
    }


    //  Create new document
    // done by authorized user
    @Mutation(() => TextDoc)
    createDocument(
        @Ctx () {req, res}: MyContext
    ) {
        return TextDoc.create({
            id: uuidv4(),
            creatorId: 1
            // creatorId: req.session.userId,
        }).save();
    }



}
