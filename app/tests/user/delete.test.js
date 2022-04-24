const request = require("supertest");
const app = require("../../app");
const { models, sequelize } = require("../../src/modules/sequelize");

describe("Remoção de Usuário", () => {
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

  // Dennis Ritchie
  const userId = 4;
  const userEmail = "dennisritchie@email.com";
  const userPassword = "dennisritchie";

  test("Deve retornar todos os dados do usuário do banco de dados", async () => {
    const user = await models.user.findOne({
      where: {
        id: userId,
      },
      raw: true,
    });

    expect(user).toHaveProperty("id");
    expect(user.id).toBe(userId);
  });

  test("Não deve remover um usuário sem informar um token", async () => {
    const response = await request(app).delete(`/api/user`).send();

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

  test("Não deve remover um usuário sem informar um id", async () => {
    const response = await request(app)
      .delete(`/api/user`)
      .set({ authorization: `Bearer ${accessToken}` })
      .send({
        email: userEmail,
        password: userPassword,
      });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("status");
    expect(response.body.status).toBe("error");
    expect(response.body).toHaveProperty("code");
    expect(response.body.code).toBe("IncorrectParameter");
  });

  test("Não deve remover um usuário sem informar um email", async () => {
    const response = await request(app)
      .delete(`/api/user`)
      .set({ authorization: `Bearer ${accessToken}` })
      .send({
        id: userId,
        password: userPassword,
      });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("status");
    expect(response.body.status).toBe("error");
    expect(response.body).toHaveProperty("code");
    expect(response.body.code).toBe("IncorrectParameter");
  });

  test("Não deve remover um usuário sem informar uma senha", async () => {
    const response = await request(app)
      .delete(`/api/user`)
      .set({ authorization: `Bearer ${accessToken}` })
      .send({
        id: userId,
        email: userEmail,
      });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("status");
    expect(response.body.status).toBe("error");
    expect(response.body).toHaveProperty("code");
    expect(response.body.code).toBe("IncorrectParameter");
  });

  test("Não deve remover os dados de usuário passando uma senha incorreta", async () => {
    const response = await request(app)
      .delete(`/api/user`)
      .set({ authorization: `Bearer ${accessToken}` })
      .send({
        id: userId,
        email: userEmail,
        password: "wrongpassword",
      });

    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty("status");
    expect(response.body.status).toBe("error");
    expect(response.body).toHaveProperty("code");
    expect(response.body.code).toBe("Unauthorized");
  });

  test("Não deve remover os dados de usuário passando um id de outro usuário", async () => {
    const response = await request(app)
      .delete(`/api/user`)
      .set({ authorization: `Bearer ${accessToken}` })
      .send({
        id: 1,
        email: userEmail,
        password: userPassword,
      });

    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty("status");
    expect(response.body.status).toBe("error");
    expect(response.body).toHaveProperty("code");
    expect(response.body.code).toBe("Unauthorized");
  });
});
