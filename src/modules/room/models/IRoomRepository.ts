import type { Room } from "../models/Room.js";

export interface IRoomRepository {
  createRoom(roomName: string, hostId: number): Promise<Room>;
  deleteRoom(roomId: number, userId: number): Promise<boolean>;
}
