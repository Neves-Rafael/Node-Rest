import fastify from "fastify";
import { env } from "./env";
import { transactionRoute } from "./routes/transactions";

const server = fastify();

server.register(transactionRoute,{
  prefix: "transactions"
});

server.listen({
  port: env.PORT,
}).then(() => {
  console.log("HTTP Server running 🔥🔥🔥")
})
