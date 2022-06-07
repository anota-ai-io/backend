const app = require("./app");
const { Server } = require("socket.io");
const http = require("http");
const { CommentEmiter } = require("./src/modules/socket");

// Inicia Servidor da API
let port = process.env.PORT;

if (port == "" || port == null) {
  port = process.env.API_LOCAL_PORT;
}

app.listen(port);

// Inicia Servidor do Socket
const socketServer = http.createServer(app);

const io = new Server(socketServer, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("User Connected");

  let postId = null;

  socket.on("disconnect", () => {
    console.log("Bye Bye");
  });

  socket.on("register", (data) => {
    console.log(`Registrando listener para o Post de ID ${data.postId}`);
    postId = parseInt(data.postId);
  });

  CommentEmiter.on("new_comment", (data) => {
    console.log("Novo evento de comentário recebido", data);

    if (data.postId === postId) {
      console.log("Novo comentário no ID registrado, propagando...");
      socket.emit("new_comment", data);
    }
  });
});

socketServer.listen(5000);
