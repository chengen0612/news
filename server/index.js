const express = require("express");
const axios = require("axios");

require("dotenv").config();
const app = express();

const PORT = process.env.PORT;
const STORIES = require("./stories.json");

const fetchTopStories = () => {
  return axios
    .get("https://hacker-news.firebaseio.com/v0/topstories.json")
    .then((response) => {
      if (response.status !== 200) {
        throw new Error("Failed to fetch top stories");
      }
      return response.data;
    });
};

const fetchStoryDetails = (storyId) => {
  return axios
    .get(`https://hacker-news.firebaseio.com/v0/item/${storyId}.json`)
    .then((response) => {
      if (response.status !== 200) {
        throw new Error(`Failed to fetch story details of ${storyId}`);
      }
      return response.data;
    });
};

// Logger
app.use((req, _res, next) => {
  console.log(
    `Request details, Method: ${req.method}, Original url: ${req.originalUrl}`
  );

  next();
});

// CORS
app.use((_req, res, next) => {
  res.header("Access-Control-Allows-Origin", "*");

  next();
});

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

app.get("/topstories", async (_req, res, next) => {
  const LIMIT = 10;

  try {
    const topStories = await fetchTopStories();
    const requests = topStories.slice(0, LIMIT).map(fetchStoryDetails);
    const storiesWithDetails = await Promise.all(requests);

    res.send(storiesWithDetails);
  } catch (error) {
    next(new Error("Unsuccessful request to hacker-news: " + error.message));
  }
});

app.use((err, _req, res, _next) => {
  console.error("err", err);
  res
    .status(500)
    .send({ type: "error", message: err.message || "Internal error" });
});

app.listen(PORT, () => console.log(`Listening on ${PORT}...`));
