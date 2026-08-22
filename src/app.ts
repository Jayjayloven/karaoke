import express from "express";
import { createServer } from "node:http";
import { WebSocketServer } from "ws";

const app = express();
app.use(express.json());


const httpServer = createServer(app);
const wss = new WebSocketServer({ server: httpServer });

app.get("/", (req, res) => {
  res.send("Karaoke App API is running!");
});

// wss handling
wss.on("connection", (ws) => {
  console.log("A new singer has appeared");

  ws.on("message", (rawMessage) => {
    const parsedMessage = JSON.parse(rawMessage.toString());
    console.log(parsedMessage.text);
    ws.send("HELLO FROM THE BACKEND!")
  });
});

// 4. Using the new PORT variable
httpServer.listen(process.env.PORT, () => {
  console.log(`Dual server is live and listening on http://localhost:${process.env.PORT}`);
});

export default app;
