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
      
    console.log(createTransactionResponse.body)
    
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
})