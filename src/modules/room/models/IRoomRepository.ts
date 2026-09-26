import type { Room } from "../domain/Room.js";

// TODO: change user/host ids to uuid in database

export interface IRoomRepository {
  findRoomById(id: string): Promise<Room | null>;
  createRoom(room: Room): Promise<Room>;
  deleteRoom(roomId: string): Promise<boolean>;
  joinRoom(userId: string, roomId: string): Promise<boolean>;
  updateRoom(room: Room): Promise<boolean>;
}
