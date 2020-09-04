import { MikroORM } from '@mikro-orm/core'
import express from 'express'

// import { __prod__ } from './constants'
// import { Post } from './entities/Post'
import microConfig from './mikro-orm.config'

const main = async () => {
  const orm = await MikroORM.init(microConfig)
  await orm.getMigrator().up()

  const app = express()

  app.get('/', (_, res) => {
    res.send('Hello')
  })

  app.listen(4000, () => {
    console.log('server started on localhost:4000')
  })
}

main().catch(e => console.error(e))