const app = require("../../app");
const request = require("supertest");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
let token;

describe("Testing Authentication endpoint", () => {
  describe("Testing Register POST /api/v1/auth/register endpoint", () => {
    test("should can register new account", async () => {
      const name = "Fahmi test",
        email = "fahmitest@mail.com",
        password = "fahmi12345",
        password_confirmation = "fahmi12345",
        identity_type = "KTP",
        identity_number = "123456789012",
        address = "Sidoarjo";
      const { statusCode, body } = await request(app)
        .post("/api/v1/auth/register")
        .send({
          name,
          email,
          password,
          password_confirmation,
          identity_type,
          identity_number,
          address,
        });

      expect(statusCode).toBe(201);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
      expect(body.data).toHaveProperty("name");
      expect(body.data).toHaveProperty("email");
      expect(body.data).toHaveProperty("password");
      expect(body.data).toHaveProperty("password_confirmation");
      expect(body.data).toHaveProperty("profile");
      expect(body.data.profile).toHaveProperty("identity_type");
      expect(body.data.profile).toHaveProperty("identity_number");
      expect(body.data.profile).toHaveProperty("address");
      expect(body.data.name).toBe(name);
      expect(body.data.email).toBe(email);
      expect(body.data.password).toBe(password);
      expect(body.data.password_confirmation).toBe(password_confirmation);
      expect(body.data.profile.identity_type).toBe(identity_type);
      expect(body.data.profile.identity_number).toBe(identity_number);
      expect(body.data.profile.address).toBe(address);
    });
    test("should can't register new account email alredy exist", async () => {
      const name = "Fahmi Test",
        email = "fahmitest@mail.com",
        password = "fahmi12345",
        password_confirmation = "fahmi12345",
        identity_type = "KTP",
        identity_number = "123456789012",
        address = "Sidoarjo";
      const { statusCode, body } = await request(app)
        .post("/api/v1/auth/register")
        .send({
          name,
          email,
          password,
          password_confirmation,
          identity_type,
          identity_number,
          address,
        });

      expect(statusCode).toBe(400);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
    });

    test("should can't create user with invalid password length", async () => {
      const name = "usertest1";
      const email = "usertest1@mail.com";
      const password = "password123";
      const { statusCode, body } = await request(app)
        .post("/api/v1/auth/register")
        .send({
          name,
          email,
          password,
        });
      expect(statusCode).toBe(400);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
    });
  });

  describe("Testing Login POST /api/v1/auth/login endpoint", () => {
    let email = "fahmitestlogin@mail.com";
    let password = "fahmi12345";
    beforeEach(async () => {
      await request(app).post("/api/v1/auth/register").send({
        email,
        password,
      });
    });

    test("should can login", async () => {
      const { statusCode, body } = await request(app)
        .post("/api/v1/auth/login")
        .send({
          email,
          password,
        });

      expect(statusCode).toBe(200);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
      expect(body.data).toHaveProperty("token");
      expect(body.data.token).toHaveProperty(token);
    });
  });

  describe("Testing Authenticate GET /api/v1/auth/whoami", () => {
    const name = "Fahmi Test Authenticate";
    const email = "fahmitestauthenticate@mail.com";
    const password = "fahmi12345";
    const password_confirmation = "fahmi12345";
    let token = "";
    beforeEach(async () => {
      await request(app).post("/api/v1/auth/register").send({
        name,
        email,
        password,
        password_confirmation,
      });
      const { body } = await request(app).post("/api/v1/auth/login").send({
        email,
        password,
      });
      token = body.data.token;
    });

    test("should can authenticate", async () => {
      const { statusCode, body } = await request(app).get(
        "/api/v1/auth/whoami"
      );

      expect(statusCode).toBe(200);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("data");
      expect(body.data).toHaveProperty("name");
      expect(body.data).toHaveProperty("email");
      expect(body.data.name).toBe(name);
      expect(body.data.email).toBe(email);
    });

    test("should can't authenticate invalid token", async () => {
      const { statusCode, body } = await request(app).get(
        "/api/v1/auth/whoami"
      );

      expect(statusCode).toBe(401);
      expect(body).toHaveProperty("status");
      expect(body).toHaveProperty("message");
    });
  });
});
