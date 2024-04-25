import { knex as setupKnex, Knex} from "knex"
import { env } from "./env"

if(!process.env.DATABASE_URL){
  throw new Error("DATABASE_URL not found in env file")
}

export const config: Knex.Config = {
  client: "sqlite",
  connection : {
    filename: env.DATABASE_URL
  },
  useNullAsDefault: true,
  migrations: {
    extension: "ts",
    directory: "./src/database/migrations"
  }
}

export const knex = setupKnex(config)