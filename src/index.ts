import "reflect-metadata";
import express from 'express';
import path from 'path';
import { createConnection } from "typeorm";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./resolvers/user";
import { createClient } from 'redis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import { COOKIE_NAME, __prod__ } from "./utils/constants";
import dotenv from 'dotenv';
import cors from 'cors'
import { MyContext } from "./types";
import { DocumentResolver } from "./resolvers/document";
import { createServer } from "http";
import { Server } from "socket.io";


dotenv.config()
const PORT = process.env.PORT || 4000

const main = async () => {
    // typeorm create new connection
    await createConnection({
        type: "postgres",
        host: "localhost",
        port: 5432,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: "lireddit",
        migrations: [path.join(__dirname, "./migrations/*")],
        entities: [path.join(__dirname, "./entities/*")],
        // synchronize: true,
    })

    const app = express();

    const RedisStore = connectRedis(session);
    const redisClient = createClient();
    await redisClient.connect();

    // listen for redis connection error
    redisClient.on('error', (err) => {
        console.log('Redis error ' + err);
    });

    redisClient.on('connect', (err) => {
        console.log('Connected to redis successfully');
    });
    

    // cors setup

    app.use(
        cors({
            // origin: process.env.CORS_ORIGIN,
            origin:  'http://localhost:3000',
            credentials: true,
        })
    );


    app.use(
        session({
            name: COOKIE_NAME,
            store: new RedisStore({
                client: redisClient,
                disableTouch: true,
            }),
            cookie: {
                secure: __prod__,
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 12,
                sameSite: "lax",
            },
            saveUninitialized: false,
            secret: process.env.SESSION_SECRET as string,
            resave: false,
        })
    )


    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [UserResolver, DocumentResolver],
        }),
        context: ({ req, res }): MyContext => ({ req, res }),
    });


    await apolloServer.start()
    apolloServer.applyMiddleware({ app });

    const httpServer = createServer(app);
    const io = new Server(httpServer, { /* options */ });

    io.on("connection", (socket) => {
        console.log("socket connected successfully")
        console.log(socket.id);

        // socket.on('get-document')
    });


    httpServer.listen(PORT, () => {
        console.log(`server started on localhost:${PORT}`);
    });
}



main().catch(error => {
    console.log('error message: ' + error.message);
})