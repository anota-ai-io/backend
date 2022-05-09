const crypto = require("crypto");
const dotenv = require("dotenv").config({ path: "../../../.env" });
const { models, sequelize } = require("../../src/modules/sequelize");

const config = async () => {
  console.log("> Inicianco configuração do banco de dados de teste.");
  try {
    console.log("  > Iniciando sincronização do banco de dados.");

    await sequelize.sync({ force: true });

    console.log("  > Banco de dados sincronizado com sucesso.");
  } catch (error) {
    console.error("  > Erro ao sincronizar banco de dados:", error);
  }

  console.log("  > Iniciando rotina de seeds");

  const users = [
    // A conta do Allan Turing é utilizada para o teste de ativação de conta de usuário
    {
      name: "Allan Turing",
      email: "allan@email.com",
      password: crypto.createHash("md5").update("allanturing").digest("hex"),
      active: false,
      activationCode: "1234567812345678",
      userName: "allanturing",
    },
    // A conta da Ada é utilizada para o teste de leitura de usuário e de login
    {
      name: "Ada Lovelace",
      email: "ada@email.com",
      password: crypto.createHash("md5").update("adalovelace").digest("hex"),
      active: true,
      activationCode: "1234567812345678",
      userName: "adalovelace",
    },
    // A conta do Von Neumann deve permencer inativa para falhar no teste de login
    {
      name: "Von Neumann",
      email: "vonneumann@email.com",
      password: crypto.createHash("md5").update("vonneumann").digest("hex"),
      active: false,
      activationCode: "1234567812345678",
      userName: "vonneumann",
    },
    // A conta do Dennis é utilizada para o teste de remoção de usuário
    {
      name: "Dennis Ritchie",
      email: "dennisritchie@email.com",
      password: crypto.createHash("md5").update("dennisritchie").digest("hex"),
      active: true,
      activationCode: "1234567812345678",
      userName: "dennisritchie",
    },
  ];

  try {
    for (const user of users) {
      await models.user.create(user);
    }
  } catch (error) {
    console.log(`  > Erro durante rotina de seeds: ${error.message}`);
  }

  console.log("  > Todos os seeds foram executados");

  console.log("> Configuração do banco de dados de teste finalizada.");

  await sequelize.close();
};

config();
