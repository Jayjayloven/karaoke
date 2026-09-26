import type { IUserRepository } from "../../user/models/IUserRepository.js";
import type { IRoomRepository } from "../models/IRoomRepository.js";
import type { LeaveRoomReq } from "../models/RoomDTO.js";
import type { WebSocketConnectionManager } from "../../../shared/core/WebSocketConnectionManager.js"; // Import the type
import { RoomWebSocketAction } from "../models/RoomWebSocketActionEnum.js";

export class LeaveRoomUseCase {
  constructor(
    private readonly roomRepo: IRoomRepository,
    private readonly userRepo: IUserRepository,
    private readonly webSocketManager: WebSocketConnectionManager,
  ) {}

  public async execute(data: LeaveRoomReq): Promise<boolean> {
    const room = await this.roomRepo.findById(data.roomId);
    if (!room) {
      throw new Error(`Room with ID ${data.roomId} not found.`);
    }
    const leavingUser = await this.userRepo.findUserById(data.userId);
    if (!leavingUser) {
      throw new Error(`User with ID ${data.userId} not found.`);
    }

    const roomUsers = await this.userRepo.findUsersByRoomId(data.roomId);

    const nextUser = roomUsers.find((user) => user.getUserId() !== data.userId);

    const inheritingHostId = nextUser ? nextUser.getUserId() : null;

    room.leaveRoom(data.userId, inheritingHostId);
    leavingUser.clearRoomId();

    let updateInheritingHostResult = true;

    if (nextUser != null) {
      updateInheritingHostResult = await this.userRepo.updateUser(nextUser);
    }

    const leaveRoomResult = await this.roomRepo.updateRoom(room);
    const updateUserResult = await this.userRepo.updateUser(leavingUser);

    this.webSocketManager.broadcastToRoom(data.roomId, {
      action: RoomWebSocketAction.USER_LEFT,
      userId: data.userId,
      newHostId: inheritingHostId,
      message: `${leavingUser.getUsername()} has left the room: ${room.getRoomName()}`,
    });

    return Boolean(
      leaveRoomResult && updateUserResult && updateInheritingHostResult,
    );
  }
}
