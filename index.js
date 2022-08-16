const express = require("express");

require("dotenv").config();
const app = express();

const PORT = process.env.PORT;
const STORIES = require("./stories.json");

app.get("/ping", (_req, res) => {
  res.send("pong");
});

app.get("/stories", (_req, res) => {
  res.json(STORIES);
});

app.get("/stories/:title", (req, res) => {
  const { title } = req.params;
  const regex = new RegExp(title, "gi");

  res.send(STORIES.filter((STORY) => regex.test(STORY.title)));
});

app.listen(PORT, () => console.log(`Listening on ${PORT}...`));
