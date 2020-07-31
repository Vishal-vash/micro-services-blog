const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const app = express();

//Use Middlewares
app.use(bodyParser.json());
app.use(cors());

//Declare Routes here
const posts = {};

const handleEvent = (type, data) => {
  if (type == "POST_CREATED") {
    const { id, title } = data;
    posts[id] = { id, title, comments: [] };
  }
  if (type == "COMMENT_CREATED") {
    const { id, content, postId, status } = data;
    posts[postId].comments.push({ id, content, status });
  }
  if (type == "COMMENT_UPDATED") {
    const { id, content, postId, status } = data;
    const post = posts[postId];
    const comment = post.comments.find((comment) => comment.id == id);

    comment.status = status;
    comment.content = content;
  }
};

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/events", (req, res) => {
  const { type, data } = req.body;
  handleEvent(type, data);

  res.send({});
});


//Listen App
app.listen(4002, async () => {
  console.log("App Started and Runnuing at 4002");

  const res = await axios.get('http://event-bus-srv:4005/events');
  for(let event of res.data) {
    console.log("Processing Event : " + event.type);

    handleEvent(event.type, event.data);
  }
});
