const database = process.env.POSTGRES_DB_NAME || "myinvestments"
const isTestEnv = process.env.NODE_ENV === "test"

module.exports = {
  type: "postgres",
  host: process.env.POSTGRES_HOST || "localhost",
  port: process.env.POSTGRES_PORT || 5432,
  username: process.env.POSTGRES_USER || "",
  password: process.env.POSTGRES_PASSWORD || "",
  database: isTestEnv ? `${database}-test` : database,
  dropSchema: isTestEnv,
  synchronize: true,
  logging: false,
  entities: ["src/entity/**/*.ts"],
  migrations: ["src/migration/**/*.ts"],
  subscribers: ["src/subscriber/**/*.ts"],
  cli: {
    entitiesDir: "src/entity",
    migrationsDir: "src/migration",
    subscribersDir: "src/subscriber"
  }
}
