import type { Room } from "../domain/Room.js";

// TODO: change user/host ids to uuid in database

export interface IRoomRepository {
  findRoomById(id: number): Promise<Room | null>;
  createRoom(room: Room): Promise<Room>;
  deleteRoom(roomId: number): Promise<boolean>;
  joinRoom(userId: string, roomId: number): Promise<boolean>;
  updateRoom(room: Room): Promise<boolean>;
}
