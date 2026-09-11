import type { Room } from "../domain/Room.js";

export interface IRoomRepository {
  findById(id: number): Promise<Room | null>;
  createRoom(room: Room): Promise<Room>;
  deleteRoom(roomId: number): Promise<boolean>;
  joinRoom(userId: string, roomId: number): Promise<boolean>;
}
