import { test, beforeAll, afterAll, describe, expect, beforeEach } from "vitest";
import { app } from "../src/app";
import supertest from "supertest";
import { execSync } from "node:child_process"

describe("Transactions Routes", ()=> {
  beforeAll(()=>{
    app.ready()
  })
  
  afterAll(() => {
    app.close()
  })

  beforeEach(()=>{
    execSync("npm run knex migrate:rollback --all")
    execSync("npm run knex migrate:latest")
  })

  
  test("User can create a new transaction", async () => {
    await supertest(app.server)
      .post("/transactions")
      .send({
        title: "New transaction",
        amount: 1000,
        type: "credit"
      }).expect(201)
  })

  // .skip() for skip test
  // .only() for specific test
  // .todo() remember for future

  test("List all transactions", async () => {
    const createTransactionResponse = await supertest(app.server)
      .post("/transactions")
      .send({
        title: "New transaction",
        amount: 1000,
        type: "credit"
      })
      
    const cookies = createTransactionResponse.get("Set-Cookie")
    
    if(!cookies){
      throw new Error("cookie not found")
    }
    
    const listTransactionResponse = await supertest(app.server)
    .get("/transactions")
    .set("Cookie", cookies)
    .expect(200)
    
    expect(listTransactionResponse.body.transactions).toEqual([
      expect.objectContaining({
        title: "New transaction",
        amount: 1000,
      })
    ])
  })

  test("List a specific transaction", async () => {
    const createTransactionResponse = await supertest(app.server)
      .post("/transactions")
      .send({
        title: "New transaction",
        amount: 1000,
        type: "credit"
      })
      
    const cookies = createTransactionResponse.get("Set-Cookie")
    
    if(!cookies){
      throw new Error("cookie not found")
    }
    
    const listTransactionResponse = await supertest(app.server)
    .get("/transactions")
    .set("Cookie", cookies)
    .expect(200)

    const transactionId = listTransactionResponse.body.transactions[0].id

    const getTransactionResponse = await supertest(app.server)
    .get(`/transactions/${transactionId}`)
    .set("Cookie", cookies)
    .expect(200)
    
    expect(getTransactionResponse.body.transactions).toEqual(
      expect.objectContaining({
        title: "New transaction",
        amount: 1000,
      })
    )
  })

  test("Get the summary", async () => {
    const createTransactionResponse = await supertest(app.server)
      .post("/transactions")
      .send({
        title: "Credit transaction",
        amount: 1000,
        type: "credit"
      })
          
    const cookies = createTransactionResponse.get("Set-Cookie")

    if(!cookies){
      throw new Error("cookie not found")
    }

    await supertest(app.server)
      .post("/transactions")
      .set("Cookie", cookies)
      .send({
        title: "Debit transaction",
        amount: 500,
        type: "debit"
      })
    
    const SummaryResponse = await supertest(app.server)
    .get("/transactions/summary")
    .set("Cookie", cookies)
    .expect(200)
    
    expect(SummaryResponse.body.summary).toEqual({
      amount: 500,
    })
  })  
})