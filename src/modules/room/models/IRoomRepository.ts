import type { Room } from "../models/Room.js";

export interface IRoomRepository {
  createRoom(roomName: string, hostId: string): Promise<Room>;
}
