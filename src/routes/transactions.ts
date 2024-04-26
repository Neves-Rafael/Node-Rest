import { z } from "zod";
import { knex } from "../database";
import { FastifyInstance } from "fastify";
import { randomUUID } from "node:crypto";
import { checkSessionIdExists } from "../middlewares/check-session-id";

export async function transactionRoute(server: FastifyInstance){
  server.get("/",{ preHandler:[checkSessionIdExists] }, async (request, reply) => {
    const { sessionId } = request.cookies

    const transactions = await knex("transactions")
      .where("session_id", sessionId)
      .select()

    return reply.send({transactions})
  })

  server.get("/:id",{ preHandler:[checkSessionIdExists] }, async (request, reply) =>{
    const idParams = z.object({
      id: z.string().uuid(),
    })

    const { sessionId } = request.cookies
    
    const { id } = idParams.parse(request.params)
    
    const transactions = await knex("transactions").where({
      session_id: sessionId,
      id
    }).first()
    
    return reply.send({transactions})
  })

  server.get("/summary",{ preHandler:[checkSessionIdExists] }, async (request, reply)=>{
    const { sessionId } = request.cookies

    const summary = await knex("transactions")
    .where({
      session_id: sessionId,
    })
    .sum("amount", { as : "amount" })
    .first()

    return { summary }
  })

  server.post("/", async (request, reply) => {
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(["credit", "debit"])
    })

    const { title, amount, type } = createTransactionBodySchema.parse(request.body)

    let sessionId = request.cookies.sessionId

    if(!sessionId){
      sessionId = randomUUID()

      reply.cookie("sessionId", sessionId,{
        path: "/",
        maxAge: 60 * 60 * 24 * 7, //7 days
      })
    }

    await knex("transactions").insert({
      id: randomUUID(),
      title,
      amount: type === "credit" ? amount : amount * -1,
      session_id: sessionId,
    })
    
    return reply.status(201).send()
  })
}