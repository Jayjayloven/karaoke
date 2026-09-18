import type { IRoomRepository } from "../models/IRoomRepository.js";
import { Room } from "../domain/Room.js";
import type { CreateRoomReq } from "../models/RoomDTO.js";
import { RoomStatusEnum } from "../models/RoomStatus.js";
import type { IUserRepository } from "../../user/models/IUserRepository.js";

export class CreateRoomUseCase {
  constructor(
    private readonly roomRepo: IRoomRepository,
    private readonly userRepo: IUserRepository,
  ) {}

  public async execute(data: CreateRoomReq): Promise<Room> {
    const host = await this.userRepo.findUserById(String(data.hostId));

    if (!host) {
      throw new Error(
        `Cannot create room: Host with ID ${data.hostId} does not exist.`,
      );
    }
    const newRoom = Room.createRoom(
      data.roomName,
      data.hostId,
      RoomStatusEnum.OPEN,
    );
    const savedRoom = await this.roomRepo.createRoom(newRoom);
    const roomId = savedRoom.getId();
    await this.roomRepo.joinRoom(String(data.hostId), roomId);

    host.changeRoomId(roomId);
    await this.userRepo.updateUser(host);

    return savedRoom;
  }
}
