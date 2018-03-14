import "reflect-metadata"
import { createConnection, Connection } from "typeorm"
import { graphql } from "graphql"
import { schema } from "./src/schema"
import { ensureAuth } from "./src/authentication"

declare var global: any
let connection: Connection = null

global.createConnection = async () => {
  if (!connection) {
    connection = await createConnection()
  }
}

global.closeConnection = async () => {
  if (connection) {
    await connection.close()
    connection = null
  }
}

global.clearDatabase = () => {
  const tables = connection.entityMetadatas
    .map(entity => `"${entity.tableName}"`)
    .join(", ")

  const sql = `TRUNCATE TABLE ${tables};`

  return connection.query(sql)
}

global.bootApp = testSuiteGlobalRef => {
  testSuiteGlobalRef.beforeAll(testSuiteGlobalRef.createConnection)
  testSuiteGlobalRef.beforeEach(testSuiteGlobalRef.clearDatabase)
  testSuiteGlobalRef.afterAll(testSuiteGlobalRef.closeConnection)
}

global.execute = async (query, variables, context) => {
  const result = await graphql(
    schema,
    query,
    null,
    { ensureAuth: ensureAuth(context && context.user), ...context },
    variables
  )

  if (result.errors && result.errors[0]) {
    throw result.errors[0]
  }

  return result.data
}
