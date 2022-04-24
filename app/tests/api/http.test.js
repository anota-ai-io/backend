const http = require("../../src/modules/http");

describe("Objetos de retorno HTTP", () => {
  test("O Objeto OK deve retornar código 200", async () => {
    const obj = http.ok({
      message: "Objeto de retorno Ok",
    });

    expect(obj.statusCode).toBe(200);
    expect(obj).toHaveProperty("body");
  });

  test("O Objeto Created deve retornar código 201", async () => {
    const obj = http.created({
      message: "Objeto de retorno Created",
    });

    expect(obj.statusCode).toBe(201);
    expect(obj).toHaveProperty("body");
  });

  test("O Objeto Bad Request deve retornar código 400", async () => {
    const obj = http.badRequest({
      message: "Objeto de retorno Bad Request",
    });

    expect(obj.statusCode).toBe(400);
    expect(obj).toHaveProperty("body");
  });

  test("O Objeto Unauthorized deve retornar código 401", async () => {
    const obj = http.unauthorized({
      message: "Objeto de retorno Unauthorized",
    });

    expect(obj.statusCode).toBe(401);
    expect(obj).toHaveProperty("body");
  });

  test("O Objeto Forbidden deve retornar código 403", async () => {
    const obj = http.forbidden({
      message: "Objeto de retorno Forbidden",
    });

    expect(obj.statusCode).toBe(403);
    expect(obj).toHaveProperty("body");
  });

  test("O Objeto Not Found deve retornar código 404", async () => {
    const obj = http.notFound({
      message: "Objeto de retorno Not Found",
    });

    expect(obj.statusCode).toBe(404);
    expect(obj).toHaveProperty("body");
  });

  test("O Objeto Conflict deve retornar código 409", async () => {
    const obj = http.conflict({
      message: "Objeto de retorno Conflict",
    });

    expect(obj.statusCode).toBe(409);
    expect(obj).toHaveProperty("body");
  });

  test("O Objeto Failure deve retornar código 500", async () => {
    const obj = http.failure({
      message: "Objeto de retorno Failure",
    });

    expect(obj.statusCode).toBe(500);
    expect(obj).toHaveProperty("body");
  });
});
