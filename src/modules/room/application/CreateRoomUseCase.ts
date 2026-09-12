import type { IRoomRepository } from "../models/IRoomRepository.js";
import { Room } from "../domain/Room.js";
import type { CreateRoomReq } from "../models/RoomDTO.js";
import { RoomStatusEnum } from "../models/RoomStatus.js";

export class CreateRoomUseCase {
  constructor(private readonly roomRepo: IRoomRepository) {}

  public async execute(data: CreateRoomReq): Promise<Room> {
    const newRoom = Room.createRoom(
      data.roomName,
      data.hostId,
      RoomStatusEnum.OPEN,
    );
    const savedRoom = await this.roomRepo.createRoom(newRoom);
    await this.roomRepo.joinRoom(
      String(savedRoom.getHostId()),
      savedRoom.getId(),
    );
    return savedRoom;
  }
}
