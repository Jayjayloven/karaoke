import type { IRoomRepository } from "../models/IRoomRepository.js";
import type { Room } from "../models/Room.js";
import type { CreateRoomReq } from "../models/RoomDTO.js";

export class CreateRoomUseCase {
  constructor(private readonly roomRepo: IRoomRepository) {}

  public async execute(data: CreateRoomReq): Promise<Room> {
    try {
      console.log('in createRoomUseCase')
      const result = await this.roomRepo.createRoom(data.roomName, data.hostId);
      return result;
    } catch (err) {
      console.error("Failed to execute CreateRoom use case:", err);
      throw err;
    }
  }
}
