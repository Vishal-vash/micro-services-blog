const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();

//Use middleware
app.use(bodyParser.json());

//Declare Routes
app.post("/events", async (req, res) => {
  const { type, data } = req.body;
  if (type == "COMMENT_CREATED") {
    status = data.content.includes("orange") ? "rejected" : "approved";

    await axios.post("http://localhost:4005/events", {
      type: "COMMENT_MODERATED",
      data: { ...data, status },
    });
  }

  res.send({});
});

//Listen to app
app.listen(4003, () => {
  console.log("App is running and listening to 4003");
});
