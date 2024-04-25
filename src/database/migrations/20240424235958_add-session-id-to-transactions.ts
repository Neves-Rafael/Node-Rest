import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  knex.schema.alterTable("transaction", (table)=>{
    table.uuid("session_id").after("id").index()
  })
}

export async function down(knex: Knex): Promise<void> {
  knex.schema.alterTable("transaction", (table)=>{
    table.dropColumn("session_id")
  })
}