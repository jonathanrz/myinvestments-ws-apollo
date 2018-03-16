module.exports = {
  type: "postgres",
  host: process.env.POSTGRES_HOST || "localhost",
  port: process.env.POSTGRES_PORT || 5432,
  username: process.env.POSTGRES_USER || "",
  password: process.env.POSTGRES_PASSWORD || "",
  database:
    process.env.NODE_ENV === "test" ? "myinvestments-test" : "myinvestments",
  dropSchema: process.env.NODE_ENV === "test",
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
