const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { randomBytes } = require("crypto");
const axios = require("axios");

//Declare an App Here
const app = express();

//Add Middlewares Here
app.use(bodyParser.json());
app.use(cors());

//Add App Routes Here
const commentsByPost = {};

app.get("/posts/:id/comments", (req, res) => {
  res.send(commentsByPost);
});

app.post("/posts/:id/comments", async (req, res) => {
  const commentId = randomBytes(4).toString("hex");
  const { id } = req.params;
  const { content } = req.body;
  const comments = commentsByPost[id] || [];

  comments.push({ id: commentId, content, status: "pending" });
  commentsByPost[id] = comments;

  await axios.post("http://event-bus-srv:4005/events", {
    type: "COMMENT_CREATED",
    data: {
      id: commentId,
      content,
      postId: id,
      status: "pending",
    },
  });

  res.status(201).send(commentsByPost);
});

app.post("/events", async (req, res) => {
  const { type, data } = req.body;
  if (type == "COMMENT_MODERATED") {
      const {id, postId, status} = data;
      const comments = commentsByPost[postId];

      const comment = comments.find(comment => comment.id == id)
      comment.status = status;

      await axios.post('http://event-bus-srv:4005/events', {
          type: 'COMMENT_UPDATED',
          data: {...data, status}
      })
  }

  res.send({});
});

//Listen to app on a certain port
app.listen("4001", () => {
  console.info("App is running at 4001");
});
