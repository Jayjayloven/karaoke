import { WebSocket } from "ws";

export class WebSocketConnectionManager {
  private rooms: Map<string, Set<WebSocket>> = new Map();

  public addClient(roomId: string, ws: WebSocket): void {
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, new Set<WebSocket>());
    }
    
    this.rooms.get(roomId)!.add(ws);
  }

  public removeClient(roomId: string, ws: WebSocket): void {
    const room = this.rooms.get(roomId);
    if (!room) return;

    room.delete(ws); 

    if (room.size === 0) {
      this.rooms.delete(roomId);
    }
  }

  public broadcastToRoom(roomId: string, message: any): void {
    const room = this.rooms.get(roomId);
    if (!room) return;

    const messageString = JSON.stringify(message);

    for (const client of room) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(messageString);
      }
    }
  }
}