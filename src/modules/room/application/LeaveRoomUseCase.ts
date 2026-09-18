import type { IUserRepository } from "../../user/models/IUserRepository.js";
import type { IRoomRepository } from "../models/IRoomRepository.js";
import type { LeaveRoomReq } from "../models/RoomDTO.js";
import type { WebSocketConnectionManager } from "../infrastructure/WebSocketConnectionManager.js"; // Import the type

export class LeaveRoomUseCase {
  constructor(
    private readonly roomRepo: IRoomRepository,
    private readonly userRepo: IUserRepository,
    private readonly webSocketManager: WebSocketConnectionManager,
  ) {}

  public async execute(data: LeaveRoomReq): Promise<boolean> {
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

    const inheritingHostId = nextUser ? Number(nextUser.getUserId()) : null;

    room.leaveRoom(Number(data.userId), inheritingHostId);
    leavingUser.clearRoomId();

    let updateInheritingHostResult = true; 

    if (nextUser != null) {
      updateInheritingHostResult = await this.userRepo.updateUser(nextUser);
    }

    const leaveRoomResult = await this.roomRepo.updateRoom(room);
    const updateUserResult = await this.userRepo.updateUser(leavingUser);

    this.webSocketManager.broadcastToRoom(data.roomId, {
      type: "USER_LEFT",
      userId: data.userId,
      newHostId: inheritingHostId,
      message: `${leavingUser.getUsername()} has left the room.`,
    });

    return Boolean(
      leaveRoomResult && updateUserResult && updateInheritingHostResult,
    );
  }
}
