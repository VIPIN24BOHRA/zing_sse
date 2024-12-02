const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();

const { db } = require("./src/moules/db.js");
const { DbUpdateStatus } = require("./src/moules/onUpdateStatus.js");

app.use(cors());

const _dbUpdate = new DbUpdateStatus();
_dbUpdate._init(db);

app.get("/order", (req, res) => {
  res.send({ msg: "this is msg" });
});

app.get("/sse", (req, res) => {
  // Set headers for SSE

  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000"); // Replace with the allowed origin
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  res.write("data: Connected to SSE\n\n");

  _dbUpdate._subscribe(res);

  req.on("close", () => {
    console.log("someone has been disconnected");
    _dbUpdate._unSubscribe(res);
    res.end();
  });
});

const PORT = 3200;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
