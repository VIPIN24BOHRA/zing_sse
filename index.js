const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const { db } = require("./src/moules/db.js");
const { DbUpdateStatus } = require("./src/moules/onUpdateStatus.js");
const { pidgeDeliveryBoyEventHandler } = require("./src/moules/deliveryBoy.js");

app.use(cors());
app.use(express.json());

const _dbUpdate = new DbUpdateStatus();
_dbUpdate._init(db);

console.log("new changes for allow origin all");

app.get("/order", (req, res) => {
  res.send({ msg: "this is msg" });
});

app.get("/webhook/rider", (req, res) => {
  res.send({ msg: "rider webhook is up and running" });
});

app.get("/webhook/piedge/rider", (req, res) => {
  res.send({ msg: "rider webhook is up and running" });
});

app.post("/webhook/piedge/rider", async (req, res) => {
  try {
    const body = req.body;
    console.log(body);
    const result = await pidgeDeliveryBoyEventHandler(body);

    res.status(200).json({
      success: result,
    });
  } catch (e) {
    console.error(e);
    res
      .status(500)
      .json({ success: false, error: e.message || "Internal Server Error" });
  }
});

app.get("/sse", (req, res) => {
  // Set headers for SSE

  res.setHeader("Access-Control-Allow-Origin", "*"); // Replace with the allowed origin
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

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
