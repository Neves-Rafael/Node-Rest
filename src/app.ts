import fastify from "fastify";
import { transactionRoute } from "./routes/transactions";
import cookie from "@fastify/cookie"

export const app = fastify();

app.register(cookie)

app.register(transactionRoute,{
  prefix: "transactions"
});