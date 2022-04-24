const request = require("supertest");
const app = require("../../app");
const { models, sequelize } = require("../../src/modules/sequelize");

describe("Leitura de Usuário", () => {
  jest.setTimeout(20000);

  beforeAll(async () => {
    try {
      await sequelize.authenticate();
    } catch (error) {
      console.error("Unable to connect to the database:", error.message);
    }
  });

  afterAll(async () => {
    try {
      await sequelize.close();
    } catch (error) {
      console.error("Unable to close connection to the database:", error.message);
    }
  });

  let accessToken = "";

  // Ada Lovelace
  const userId = 2;
  const userEmail = "ada@email.com";
  const userPassword = "adalovelace";

  test("Não deve ler os dados de um usuário sem informar um token", async () => {
    const response = await request(app).get(`/api/user/${userId}`).send();

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("status");
    expect(response.body.status).toBe("error");
    expect(response.body).toHaveProperty("code");
    expect(response.body.code).toBe("IncorrectParameter");
  });

  test("Deve realizar login e retornar um Access Token", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: userEmail,
      password: userPassword,
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("status");
    expect(response.body.status).toBe("ok");
    expect(response.body).toHaveProperty("response");
    expect(response.body.response).toHaveProperty("accessToken");

    if (response.body.response.accessToken) accessToken = response.body.response.accessToken;
  });

  test("Não deve ler os dados de um usuário inexistente", async () => {
    const response = await request(app)
      .get(`/api/user/99`)
      .set({ authorization: `Bearer ${accessToken}` })
      .send();

    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty("status");
    expect(response.body.status).toBe("error");
    expect(response.body).toHaveProperty("code");
    expect(response.body.code).toBe("UserNotFound");
  });

  test("Nao deve ler os dados de outro usuário", async () => {
    const response = await request(app)
      .get(`/api/user/1`)
      .set({ authorization: `Bearer ${accessToken}` })
      .send();

    expect(response.statusCode).toBe(403);
    expect(response.body).toHaveProperty("status");
    expect(response.body.status).toBe("error");
    expect(response.body).toHaveProperty("code");
    expect(response.body.code).toBe("Forbidden");
  });

  test("Deve ler os dados do usuário", async () => {
    const response = await request(app)
      .get(`/api/user/${userId}`)
      .set({ authorization: `Bearer ${accessToken}` })
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("status");
    expect(response.body.status).toBe("ok");
    expect(response.body).toHaveProperty("response");
    expect(response.body.response).toHaveProperty("user");
    expect(response.body.response.user.id).toBe(userId);
  });
});
