import { createServer } from "node:http";
import { WebSocketServer } from "ws";
import app from "./app.js"; // Import your configured Express app
import { webSocketManager } from "./shared/core/dependencies.js"; // Your Switchboard singleton

// 1. Create the HTTP server using the Express app
const httpServer = createServer(app);

// 2. Create a WebSocket server that does NOT bind automatically
const wss = new WebSocketServer({ noServer: true });

// 3. Intercept the HTTP upgrade request to handle Room IDs
httpServer.on("upgrade", (request, socket, head) => {
  const url = new URL(request.url || "", `http://${request.headers.host}`);

  // Only handle connections trying to reach a specific room
  if (url.pathname.startsWith("/ws/rooms/")) {
    const pathParts = url.pathname.split("/");
    const roomId = pathParts[3]!;

    // Complete handshake and pass to the Switchboard
    wss.handleUpgrade(request, socket, head, (ws) => {
      console.log(`A new singer has appeared in room ${roomId}`);

      // Add client to the in-memory room
      webSocketManager.addClient(roomId, ws);

      // Handle custom messages (like chat or song selection)
      ws.on("message", (rawMessage) => {
        const parsedMessage = JSON.parse(rawMessage.toString());
        console.log(`Room ${roomId} message:`, parsedMessage.text);

        // Example: Broadcast message to everyone else in the room
        webSocketManager.broadcastToRoom(roomId, parsedMessage);
      });

      // Clean up when they leave
      ws.on("close", () => {
        webSocketManager.removeClient(roomId, ws);
      });
    });
  } else {
    socket.destroy();
  }
});

// 4. Start listening on the port
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Dual server is live and listening on http://localhost:${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});
