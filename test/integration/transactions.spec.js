const app = require("../../app");
const request = require("supertest");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
let transaction = {};

describe("Testing transaction POST /api/v1/transaction endpoint", () => {
  test("should can create new transaction", async () => {
    try {
      const data = {
        sourceAccountId: 1,
        destinasiAccountId: 2,
        amount: 10000,
      };
      const { statusCode, body } = await request(app)
        .post("/api/v1/transactions")
        .send({ data });
      transaction = body.data;

      expect(statusCode).toBe(201);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
      expect(body.data).toHaveProperty("sourceAccountId");
      expect(body.data).toHaveProperty("destinasiAccountId");
      expect(body.data).toHaveProperty("amount");
      expect(body.data.amount).toBe(data.amount);
      expect(body.data.sourceAccountId.bankName).toBe(data.bankName);
      expect(body.data.sourceAccountId.bankAccountNumber).toBe(
        data.bankAccountNumber
      );
      expect(body.data.sourceAccountId.balance).toBe(data.balance);
      expect(body.data.destinasiAccountId.bankName).toBe(data.bankName);
      expect(body.data.destinasiAccountId.bankAccountNumber).toBe(
        data.bankAccountNumber
      );
      expect(body.data.destinasiAccountId.balance).toBe(data.balance);
    } catch (err) {
      expect(err).toBe(err);
    }
  });

  test("should can't create new transaction balance less", async () => {
    try {
      const data = {
        sourceAccountId: 1,
        destinasiAccountId: 2,
        amount: 10000000,
      };
      const { statusCode, body } = await request(app)
        .post("/api/v1/transactions")
        .send({ data });
      expect(statusCode).toBe(400);
      expect(body).toHaveProperty("success");
      expect(body).toHaveProperty("message");
    } catch (err) {
      expect(err).toBe(err);
    }
  });

  test("should can't create new transaction source_account_id or destination_account_id not found", async () => {
    try {
      const data = {
        sourceAccountId: 999,
        destinasiAccountId: 999,
        amount: 10000000,
      };
      const { statusCode, body } = await request(app)
        .post("/api/v1/transactions")
        .send({
          data,
        });
      expect(statusCode).toBe(404);
      expect(body).toHaveProperty("success");
      expect(body).toHaveProperty("message");
    } catch (err) {
      expect(err).toBe(err);
    }
  });

  test("should can't create new transaction unauthorized", async () => {
    try {
      const data = {
        sourceAccountId: 999,
        destinasiAccountId: 999,
        amount: 10000000,
      };
      const { statusCode, body } = await request(app)
        .post("/api/v1/transactions")
        .send({
          data
        });

      expect(statusCode).toBe(400);
      expect(body).toHaveProperty("success");
      expect(body).toHaveProperty("message");
} catch (err) {
      expect(err).toBe(err);
    }
  });
});

describe("test GET /api/v1/transactions endpoint", () => {
  test("Berhasil: Menampilkan semua data transaksi.", async () => {
    const { statusCode, body } = await request(app).get("/api/v1/transactions");

    expect(statusCode).toBe(200);
    expect(body).toHaveProperty("status");
    expect(body).toHaveProperty("message");
    expect(body).toHaveProperty("data");
  });
});

describe("test GET /api/v1/transactions/{id} endpoint", () => {
  test(" Berhasil: Test mencari transaksi dengan ID yang terdaftar.", async () => {
    try {
      const transactionId = transaction.id;
      const { statusCode, body } = await request(app).get(
        `/api/v1/transactions/${transactionId.id}`
      );

      expect(statusCode).toBe(200);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
      expect(body.data).toHaveProperty("sourceAccountId");
      expect(body.data).toHaveProperty("destinasiAccountId");
      expect(body.data).toHaveProperty("amount");
      expect(body.data.amount).toBe(data.amount);
      expect(body.data.sourceAccountId.bankName).toBe(data.bankName);
      expect(body.data.sourceAccountId.bankAccountNumber).toBe(
        data.bankAccountNumber
      );
      expect(body.data.sourceAccountId.balance).toBe(data.balance);
      expect(body.data.destinasiAccountId.bankName).toBe(data.bankName);
      expect(body.data.destinasiAccountId.bankAccountNumber).toBe(
        data.bankAccountNumber
      );
      expect(body.data.destinasiAccountId.balance).toBe(data.balance);
    } catch (err) {
      expect(err).toBe(err);
    }
  });

  test("Gagal: Test mencari transaksi dengan ID yang tidak terdaftar.", async () => {
    try {
      const { statusCode, body } = await request(app).get(
        `/api/v1/transactions/${transactionId + 1000}`
      );

      expect(statusCode).toBe(400);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
    } catch (err) {
      expect(err).toBe(err);
    }
  });
});
