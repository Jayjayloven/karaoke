import { WebSocket } from "ws";

export class WebSocketConnectionManager {
  private rooms: Map<number, Set<WebSocket>> = new Map();

  public addClient(roomId: number, ws: WebSocket): void {
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, new Set<WebSocket>());
    }
    
    this.rooms.get(roomId)!.add(ws);
  }

  public removeClient(roomId: number, ws: WebSocket): void {
    const room = this.rooms.get(roomId);
    if (!room) return;

    room.delete(ws); 

    if (room.size === 0) {
      this.rooms.delete(roomId);
    }
  }

  public broadcastToRoom(roomId: number, message: any): void {
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