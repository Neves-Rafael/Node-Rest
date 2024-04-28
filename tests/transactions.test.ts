import { test, beforeAll, afterAll, describe, expect } from "vitest";
import { app } from "../src/app";
import supertest from "supertest";

describe("Transactions Routes", ()=> {
  beforeAll(()=>{
    app.ready()
  })
  
  afterAll(() => {
    app.close()
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
      console.log(cookies)
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