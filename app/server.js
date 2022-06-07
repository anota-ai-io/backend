const app = require("./app");
const { Server } = require("socket.io");
const http = require("http");
const { CommentEmiter, activeSockets } = require("./src/modules/socket");

// Inicia Servidor da API
let port = process.env.PORT;

if (port == "" || port == null) {
  port = process.env.API_LOCAL_PORT;
}

// Inicia Servidor do Socket
const socketServer = http.createServer(app);

const io = new Server(socketServer, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("User Connected");

  socket.on("register", (data) => {
    console.log(`Registrando listener para o Socket: ${data.socketId} no post: ${data.postId}`);

    if (activeSockets.hasOwnProperty(data.postId)) {
      // Já existe uma lista de sockets ativos para esse post, adicionar ao final
      const sockets = activeSockets[data.postId];

      activeSockets[data.postId] = [
        ...sockets,
        { socketObj: socket, clientId: data.socketId, postId: data.postId },
      ];
    } else {
      // Não existe uma lista de sockets ativos para esse post, inciar lista
      activeSockets[data.postId] = [
        { socketObj: socket, clientId: data.socketId, postId: data.postId },
      ];
    }

    console.log("Sockets Ativos:", activeSockets);
  });

  socket.on("unregister", (data) => {
    console.log(`Removendo  listener para o Socket: ${data.socketId} no post: ${data.postId}`);

    if (activeSockets.hasOwnProperty(data.postId)) {
      // Existe uma lista ativa de sockets para esse post, remover o solicitado
      const sockets = activeSockets[data.postId];

      activeSockets[data.postId] = sockets.filter((register) => register.clientId != data.socketId);

      if (activeSockets[data.postId].length === 0) delete activeSockets[data.postId];
    } else {
      console.log("Nenhum socket registrado para o post ID na tentativa de unregister.");
    }
    console.log("Sockets Ativos:", activeSockets);
  });
});

CommentEmiter.on("new_comment", (data) => {
  console.log("Novo evento de comentário recebido.");

  // Percorrer cada um dos sockets ativos para esse post
  if (activeSockets.hasOwnProperty(data.postId)) {
    const sockets = activeSockets[data.postId];

    for (const socket in sockets) {
      const socketObj = sockets[socket].socketObj;
      socketObj.emit("new_comment", data);
    }
  } else {
    console.log(`Nenhum socket ativo para o post ${data.postId}`);
  }
});

socketServer.listen(port);
