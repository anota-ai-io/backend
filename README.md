# Anota Aí

<p align="center">
    <img src="/docs/icon.png" height="130">
</p>

<p align="center">
    <a href="https://github.com/anota-ai-io/backend/actions/workflows/docker-image.yml"  target="_blank">
      <img src="https://github.com/anota-ai-io/backend/actions/workflows/docker-image.yml/badge.svg" />
    </a>
    <a href="https://documenter.getpostman.com/view/19545370/UVyxRZXu" target="_blank">
      <img src="https://img.shields.io/badge/Docs-Postman-f39f37" />
    </a>
</p>

Anota Aí é um projeto de faculdade para compartilhamento colaborativo de materiais relacionados a um curso, aulas, tarefas, etc.

## Tecnologias

- Backend: API em [Node.js](https://nodejs.org/en/) escrita com [Express](https://expressjs.com/pt-br/)
- Banco de Dados: [PostgreSQL](https://www.postgresql.org/)
- Interface com o banco de dados: [Sequelize](https://sequelize.org/)
- Testes: Suíte de testes escrita com o [Jest](https://jestjs.io/pt-BR/)
- CI/CD: Integração com deploy automático no Render
- Ambiente de desenvolvimento e testes: [Docker](https://www.docker.com/)

## Documentação

Documentação da API disponível no Postman: [API Docs](https://documenter.getpostman.com/view/19545370/UVyxRZXu)

## Frontend

O desenvolvimento do frontend pode ser acompanhado pelo [repositório de frontend](https://github.com/anota-ai-io/frontend).

O deploy do frontend está disponível no Netlify através [deste link](https://anotaai.netlify.app)

## Disponibilidade

A API encontra-se disponível hospedada no Render através do link: [API Anota Aí](https://anotaai.onrender.com).

Hospedagens gratuitas no Render entram em modo de sleeping após 30 minutos sem nenhum trafégo. Esteja ciente de que a primeira requisição pode levar alguns segundos a mais. Após acordar, o servidor responde as chamadas subsequentes normalmente.

## Testes

O container de teste é isolado no arquivo `docker-compose.test.yml`.

Para executar o container com os testes:

```bash
sudo docker-compose -f docker-compose.test.yml up --exit-code-from backend --build

```
