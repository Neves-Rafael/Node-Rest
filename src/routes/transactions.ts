import { FastifyInstance } from "fastify";
import { knex } from "../database";
import { randomUUID } from "node:crypto";
import { z } from "zod";

export async function transactionRoute(server: FastifyInstance){
  server.get("/", async (request, reply) =>{
    const transactions = await knex("transactions").select()

    return reply.send({transactions})
  })

  server.get("/:id", async (request, reply) =>{
    const idParams = z.object({
      id: z.string().uuid(),
    })
    
    const { id } = idParams.parse(request.params)
    
    const transactions = await knex("transactions").where({id}).first()
    
    console.log(transactions)
    return reply.send({transactions})
  })


  server.post("/", async (request, reply) => {

    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(["credit", "debit"])
    })

    const { title, amount, type } = createTransactionBodySchema.parse(request.body)

    await knex("transactions").insert({
      id: randomUUID(),
      title,
      amount: type === "credit" ? amount : amount * -1,
    })
    
    return reply.status(201).send()
  })
}