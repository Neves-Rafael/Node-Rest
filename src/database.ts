import { knex as setupKnex, Knex} from "knex"

export const config: Knex.Config = {
  client: "sqlite",
  connection : {
    filename: "./src/database/database.db"
  },
  useNullAsDefault: true,
  migrations: {
    extension: "ts",
    directory: "./src/database/migrations"
  }
}

export const knex = setupKnex(config)