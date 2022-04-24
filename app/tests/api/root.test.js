const request = require("supertest");
const app = require("../../app");

describe("Testes da estrutura de resposta da API", () => {
  test("A raiz da API deve retornar um OK 200", async () => {
    const response = await request(app).get("/api");

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("status");
    expect(response.body.status).toBe("ok");
  });

  test("A raiz da URL deve retornar um OK 200", async () => {
    const response = await request(app).get("/");

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("status");
    expect(response.body.status).toBe("ok");
  });

  test("Uma rota inexistente deve retornar error 404 Not Found", async () => {
    const response = await request(app).get("/inexistent");

    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty("status");
    expect(response.body.status).toBe("error");
  });
});
