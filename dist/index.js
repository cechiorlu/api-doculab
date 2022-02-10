"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const typeorm_1 = require("typeorm");
const apollo_server_express_1 = require("apollo-server-express");
const type_graphql_1 = require("type-graphql");
const user_1 = require("./resolvers/user");
const redis_1 = require("redis");
const express_session_1 = __importDefault(require("express-session"));
const connect_redis_1 = __importDefault(require("connect-redis"));
const constants_1 = require("./utils/constants");
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const document_1 = require("./resolvers/document");
const http_1 = require("http");
const socket_io_1 = require("socket.io");
dotenv_1.default.config();
const PORT = process.env.PORT || 4000;
const main = async () => {
    await (0, typeorm_1.createConnection)({
        type: "postgres",
        host: "localhost",
        port: 5432,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: "lireddit",
        migrations: [path_1.default.join(__dirname, "./migrations/*")],
        entities: [path_1.default.join(__dirname, "./entities/*")],
    });
    const app = (0, express_1.default)();
    const RedisStore = (0, connect_redis_1.default)(express_session_1.default);
    const redisClient = (0, redis_1.createClient)();
    await redisClient.connect();
    redisClient.on('error', (err) => {
        console.log('Redis error ' + err);
    });
    redisClient.on('connect', (err) => {
        console.log('Connected to redis successfully');
    });
    app.use((0, cors_1.default)({
        origin: 'http://localhost:3000',
        credentials: true,
    }));
    app.use((0, express_session_1.default)({
        name: constants_1.COOKIE_NAME,
        store: new RedisStore({
            client: redisClient,
            disableTouch: true,
        }),
        cookie: {
            secure: constants_1.__prod__,
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 12,
            sameSite: "lax",
        },
        saveUninitialized: false,
        secret: process.env.SESSION_SECRET,
        resave: false,
    }));
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema: await (0, type_graphql_1.buildSchema)({
            resolvers: [user_1.UserResolver, document_1.DocumentResolver],
        }),
        context: ({ req, res }) => ({ req, res }),
    });
    await apolloServer.start();
    apolloServer.applyMiddleware({ app });
    const httpServer = (0, http_1.createServer)(app);
    const io = new socket_io_1.Server(httpServer, {});
    io.on("connection", (socket) => {
        console.log("socket connected successfully");
        console.log(socket.id);
    });
    httpServer.listen(PORT, () => {
        console.log(`server started on localhost:${PORT}`);
    });
};
main().catch(error => {
    console.log('error message: ' + error.message);
});
//# sourceMappingURL=index.js.map