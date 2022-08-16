const express = require("express");

require("dotenv").config();
const app = express();

const PORT = process.env.PORT;

app.get("/ping", (_req, res) => {
  res.send("pong");
});

app.listen(PORT, () => console.log(`Listening on ${PORT}...`));
