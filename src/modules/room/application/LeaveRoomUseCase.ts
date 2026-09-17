import type { IUserRepository } from "../../user/models/IUserRepository.js";
import type { IRoomRepository } from "../models/IRoomRepository.js";
import type { LeaveRoomReq } from "../models/RoomDTO.js";

export class LeaveRoomUseCase {
  constructor(
    private readonly roomRepo: IRoomRepository,
    private readonly userRepo: IUserRepository,
  ) {}

  public async execute(data: LeaveRoomReq): Promise<void> {
    const leavingUser = await this.userRepo.findUserById(data.userId);
    if (!leavingUser) {
      throw new Error(`User with ID ${data.userId} not found.`);
    }

    const room = await this.roomRepo.findById(data.roomId);
    if (!room) {
      throw new Error(`Room with ID ${data.roomId} not found.`);
    }

    const roomUsers = await this.userRepo.findUsersByRoomId(data.roomId);

    const nextUser = roomUsers.find((user) => user.getUserId() !== data.userId);
    const inheritingHostId = nextUser
      ? Number.parseInt(nextUser.getUserId())
      : null;

    room.leaveRoom(Number(data.userId), inheritingHostId);

    await this.roomRepo.updateRoom(room);
    leavingUser.clearRoomId();
  }
}
