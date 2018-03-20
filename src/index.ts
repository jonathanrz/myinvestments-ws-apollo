import "reflect-metadata"
import * as express from "express"
import * as bodyParser from "body-parser"
import * as cors from "cors"
import { get } from "lodash"
import { GraphQLServer } from "graphql-yoga"
import { createConnection } from "typeorm"
import { schema } from "./schema"
import { authentication, ensureAuth } from "./authentication"

const PORT: number = parseInt(process.env.PORT, 10) || 4000

createConnection().then(() => {
  const server = new GraphQLServer({
    schema,
    context: ({ request }) => {
      const user = get(request, "session.passport.user")

      return {
        user,
        ensureAuth: ensureAuth(user)
      }
    }
  })

  server.express.use(bodyParser.urlencoded({ extended: false }))
  server.express.use(bodyParser.json())
  server.express.use(cors)

  authentication(server.express)

  server.start({ port: PORT }, () =>
    console.log(`Server is running on port ${PORT}`)
  )
})
