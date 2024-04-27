import { test, beforeAll, afterAll } from "vitest";
import { app } from "../src/app";
import supertest from "supertest";

beforeAll(()=>{
  app.ready()
})

afterAll(() => {
  app.close()
})

test("User can create a new transaction", async () => {
  const response = await supertest(app.server)
    .post("/transactions")
    .send({
      title: "New transaction",
      amount: 1000,
      type: "credit"
    }).expect(201)
})