import 'reflect-metadata'
import { createConnection } from 'typeorm'
import express from 'express'
import Redis from 'ioredis'
import session from 'express-session'
import connectRedis from 'connect-redis'
import cors from 'cors'
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from 'type-graphql'

import { PostResolver } from './resolvers/post'
import { UserResolver } from './resolvers/user'
import { __prod__, COOKIE_NAME } from './constants'
import { Post } from './entities/Post'
import { User } from './entities/User'

const main = async () => {
  const connection = await createConnection({
    type: 'postgres',
    database: 'lireddit-db',
    username: 'postgres',
    password: 'postgres',
    logging: true,
    synchronize: true,
    entities: [Post, User],
  })

  const app = express()

  const RedisStore = connectRedis(session)
  const redis = new Redis()

  app.use(
    cors({
      origin: 'http://localhost:3000',
      credentials: true,
    })
  )

  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({ client: redis, disableTouch: true }),
      secret: 'wekurqkjwbvnfbguiefnajsgrhy',
      resave: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
        httpOnly: true,
        secure: __prod__, // only works in https
        sameSite: 'lax',
      },
      saveUninitialized: false,
    })
  )

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [PostResolver, UserResolver],
      validate: false,
      // dateScalarMode: 'timestamp', // "timestamp" or "isoDate"
    }),
    context: ({ req, res }) => ({ req, res, redis }),
  })

  apolloServer.applyMiddleware({
    app,
    cors: false,
  })

  app.listen(4000, () => {
    console.log('server started on localhost:4000')
  })
}

main().catch((e) => console.error(e))
