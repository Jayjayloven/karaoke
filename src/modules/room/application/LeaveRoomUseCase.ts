import type { IRoomRepository } from "../models/IRoomRepository.js";
import type { IUserRepository } from "../../user/models/IUserRepository.js";
import type { LeaveRoomReq } from "../models/RoomDTO.js";

export class LeaveRoomUseCase {
  constructor(
    private readonly roomRepo: IRoomRepository,
    private readonly userRepo: IUserRepository,
  ) {}

  public async execute(data: LeaveRoomReq): Promise<void> {
    const room = await this.roomRepo.findById(data.roomId);
    if (!room) {
      throw new Error(`Room with ID ${data.roomId} not found.`);
    }

    // 1. Fetch users currently in this room via UserRepo
    const roomUsers = await this.userRepo.findUsersByRoomId(data.roomId);

    const nextUser = roomUsers.find(
      (user) => Number.parseInt(user.id) !== data.userId,
    );
    const inheritingHostId = nextUser ? Number.parseInt(nextUser.id) : null;

    // 2. Domain Entity changes state (host transfer or closing)
    room.leaveRoom(data.userId, inheritingHostId);

    await this.roomRepo.updateRoom(room);

    await this.userRepo.clearRoomId(data.userId);
  }
}
