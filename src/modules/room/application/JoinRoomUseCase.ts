import type { IUserRepository } from "../../user/models/IUserRepository.js";
import type { IRoomRepository } from "../models/IRoomRepository.js";
import type { JoinRoomReq } from "../models/RoomDTO.js";

export class JoinRoomUseCase {
  constructor(
    private readonly roomRepo: IRoomRepository,
    private readonly userRepo: IUserRepository,
  ) {}

  public async execute(data: JoinRoomReq): Promise<boolean> {
    const requestedRoom = await this.roomRepo.findById(data.roomId);
    const host = await this.userRepo.findUserById(String(data.userId));
    if (!host) {
      throw new Error(
        `Cannot join room: Host with ID ${data.userId} does not exist.`,
      );
    }

    if (!requestedRoom) {
      throw new Error(`Room with ID ${data.roomId} not found.`);
    }

    requestedRoom.validateRoomStatus();
    requestedRoom.validateRoomCode(data.roomCode);
    host.changeRoomId(data.roomId);

    const joinRoomResult = await this.roomRepo.joinRoom(
      data.userId,
      requestedRoom.getId(),
    );
    const updateUserResult = await this.userRepo.updateUser(host);

    return joinRoomResult && updateUserResult;
  }
}
