import fastify from "fastify";
import { knex } from "./database";
import { randomUUID } from "node:crypto";
import { env } from "./env";

const server = fastify()

server.get("/hello", async(req, res) => {
  const transaction = await knex("transactions").insert({
    id: randomUUID(),
    title: "Test create",
    amount: 1000
  }).returning("*")

  return transaction 
})

server.listen({
  port: env.PORT,
}).then(() => {
  console.log("HTTP Server running 🔥🔥🔥")
})
