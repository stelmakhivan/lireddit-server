import 'reflect-metadata'
import { PostResolver } from './resolvers/post'
import { MikroORM } from '@mikro-orm/core'
import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from 'type-graphql'

// import { __prod__ } from './constants'
// import { Post } from './entities/Post'
import { HelloResolver } from './resolvers/hello'
import microConfig from './mikro-orm.config'

const main = async () => {
  const orm = await MikroORM.init(microConfig)
  await orm.getMigrator().up()

  const app = express()
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver],
      validate: false,
      // dateScalarMode: 'timestamp', // "timestamp" or "isoDate"
    }),
    context: () => ({ em: orm.em }),
  })

  apolloServer.applyMiddleware({ app })

  app.listen(4000, () => {
    console.log('server started on localhost:4000')
  })
}

main().catch((e) => console.error(e))
