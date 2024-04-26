import fastify from "fastify";
import { env } from "./env";
import { transactionRoute } from "./routes/transactions";
import cookie from "@fastify/cookie"

const server = fastify();

server.register(cookie)

server.register(transactionRoute,{
  prefix: "transactions"
});

server.listen({
  port: env.PORT,
}).then(() => {
  console.log("HTTP Server running 🔥🔥🔥")
})
