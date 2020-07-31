const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");

const app = express();

//Add Middlewares
app.use(bodyParser.json());
app.use(cors());

//Add Routes for the Application
const posts = {};
app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/posts", async (req, res) => {
  const { title } = req.body;
  const id = randomBytes(4).toString("hex");

  posts[id] = { id, title };

  await axios.post("http://event-bus-srv:4005/events", {
    type: "POST_CREATED",
    data: { id, title },
  });

  res.status(201).send(posts[id]);
});

app.post('/events', (req, res) => console.log(req.body.type))

//Listen app on some port
app.listen("4000", () => {
  console.log("New Version")
  console.log("App is running at 4000");
});
