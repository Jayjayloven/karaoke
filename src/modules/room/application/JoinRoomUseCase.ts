import type { IRoomRepository } from "../models/IRoomRepository.js";
import type { JoinRoomReq } from "../models/RoomDTO.js";

export class JoinRoomUseCase {
  constructor(private readonly roomRepo: IRoomRepository) {}

  public async execute(data: JoinRoomReq): Promise<boolean> {
    const requestedRoom = await this.roomRepo.findById(data.roomId);

    if (!requestedRoom) {
      throw new Error(`Room with ID ${data.roomId} not found.`);
    }

    requestedRoom.validateRoomStatus();
    requestedRoom.validateRoomCode(data.roomCode);

    return await this.roomRepo.joinRoom(data.userId, requestedRoom.getId());
  }

}