module.exports = {
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "",
  password: "",
  database: process.env.NODE_ENV === "test" ? "myinvestments-test" : "myinvestments",
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
