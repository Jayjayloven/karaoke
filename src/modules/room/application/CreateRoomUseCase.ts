import type { IRoomRepository } from "../models/IRoomRepository.js";
import { Room } from "../domain/Room.js";
import type { CreateRoomReq } from "../models/RoomDTO.js";
import { RoomStatusEnum } from "../models/RoomStatus.js";
import type { IUserRepository } from "../../user/models/IUserRepository.js";
import type { RequestValidators } from "../../../shared/RequestValidators.js";

export class CreateRoomUseCase {
  constructor(
    private readonly roomRepo: IRoomRepository,
    private readonly userRepo: IUserRepository,
    private readonly requestValidator: RequestValidators,
  ) {}

  public async execute(data: CreateRoomReq): Promise<Room> {
    const host = await this.requestValidator.doesUserExist(data.hostId);

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
