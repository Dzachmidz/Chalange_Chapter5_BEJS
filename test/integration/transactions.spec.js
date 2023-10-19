const app = require("../../app");
const request = require("supertest");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
let user = {};
let account = {};
let transaction = {};

describe("test POST /api/v1/transaction endpoint", () => {
  test(" Berhasil: Transaksi berhasil dibuat.", async () => {
    const data = {
      userId: 1,
      sourceAccountId: 1,
      destinasiAccountId: 2,
      amount: 1000,
    };
    let { statusCode, body } = await request(app)
      .post("/api/v1/transactions")
      .send({data});
    transaction = body.data;

    expect(statusCode).toBe(201);
    expect(body).toHaveProperty("status");
    expect(body).toHaveProperty("message");
    expect(body).toHaveProperty("data");
    expect(body.data).toHaveProperty("sourceAccountId");
    expect(body.data).toHaveProperty("destinasiAccountId");
    expect(body.data).toHaveProperty("amount");
    expect(body.data.sourceAccountId).toBe(data.sourceAccountId);
    expect(body.data.destinasiAccountId).toBe(data.destinasiAccountId);
    expect(body.data.amount).toBe(data.amount);
  });

  //   test("Error: test userId belum terdaftar ", async () => {
  //     const data = {
  //       userId: 0,
  //       bankName: "Bank BTN",
  //       bankAccountNumber: "123456789",
  //       balance: 350000.0,
  //     };
  //     const response = await request(app).post("/api/v1/accounts").send(data);
  //     expect(response.statusCode).toBe(400);
  //     expect(response.body).toHaveProperty("status");
  //     expect(response.body).toHaveProperty("message");
  //   });
});

// describe("test GET /api/v1/accounts endpoint", () => {
//   test("berhasil : menampilkan semua data", async () => {
//     const { statusCode, body } = await request(app).get("/api/v1/accounts");

//     expect(statusCode).toBe(200);
//     expect(body).toHaveProperty("status");
//     expect(body).toHaveProperty("message");
//     expect(body).toHaveProperty("data");
//   });
// });

// describe("test GET /api/v1/accounts/{id} endpoint", () => {
//   test(" berhasil : test cari account dengan id yang terdaftar", async () => {
//     try {
//       const accountId = account.id;
//       const { statusCode, body } = await request(app).get(
//         `/api/v1/users/${accountId}`
//       );

//       expect(statusCode).toBe(200);
//       expect(body).toHaveProperty("status");
//       expect(body).toHaveProperty("message");
//       expect(body).toHaveProperty("data");
//       expect(body.data).toHaveProperty("userId");
//       expect(body.data).toHaveProperty("bankName");
//       expect(body.data).toHaveProperty("bankAccountNumber");
//       expect(body.data).toHaveProperty("balance");
//       expect(body.data.userId).toBe(data.userId);
//       expect(body.data.bankName).toBe(data.bankName);
//       expect(body.data.bankAccountNumber).toBe(data.bankAccountNumber);
//       expect(body.data.balance).toBe(data.balance);
//     } catch (err) {
//       expect(err).toBe(err);
//     }
//   });

//     test("failed : test cari account dengan id yang tidak terdaftar", async () => {
//       try {
//         const { statusCode, body } = await request(app).get(
//           `/api/v1/accounts/${account.id + 1000}`
//         );

//         expect(statusCode).toBe(500);
//         expect(body).toHaveProperty("status");
//         expect(body).toHaveProperty("message");
//       } catch (err) {
//         expect(err).toBe(err);
//       }
//     });
// });
