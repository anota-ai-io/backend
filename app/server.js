const app = require("./app");

let port = process.env.PORT;

if (port == "" || port == null) {
  port = process.env.API_LOCAL_PORT;
}

app.listen(port);
