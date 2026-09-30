import type { IUserRepository } from "../../user/models/IUserRepository.js";
import type { IRoomRepository } from "../models/IRoomRepository.js";
import type { LeaveRoomReq } from "../models/RoomDTO.js";
import type { WebSocketConnectionManager } from "../../../shared/core/WebSocketConnectionManager.js"; // Import the type
import { RoomWebSocketAction } from "../models/RoomWebSocketActionEnum.js";
import type { RequestValidators } from "../../../shared/RequestValidators.js";

export class LeaveRoomUseCase {
  constructor(
    private readonly roomRepo: IRoomRepository,
    private readonly userRepo: IUserRepository,
    private readonly webSocketManager: WebSocketConnectionManager,
    private readonly requestValidator: RequestValidators,
  ) {}

  public async execute(data: LeaveRoomReq): Promise<boolean> {
    const leavingUser = await this.requestValidator.doesUserExist(data.userId);
    const room = await this.requestValidator.doesRoomExist(data.roomId);

    const roomUsers = await this.userRepo.findUsersByRoomId(data.roomId);

    const nextUser = roomUsers.find((user) => user.getUserId() !== data.userId);

    const inheritingHostId = nextUser ? nextUser.getUserId() : null;

    room.leaveRoom(data.userId, inheritingHostId);
    leavingUser.clearRoomId();

    let updateInheritingHostResult = true;

    if (nextUser) {
      updateInheritingHostResult = await this.userRepo.updateUser(nextUser);
    }

    const leaveRoomResult = await this.roomRepo.updateRoom(room);
    const updateUserResult = await this.userRepo.updateUser(leavingUser);

    this.webSocketManager.broadcastToRoom(data.roomId, {
      action: RoomWebSocketAction.USER_LEFT,
      userId: data.userId,
      message: `${leavingUser.getUsername()} has left the room: ${room.getRoomName()}`,
      data: { leavingUserId: data.userId, newHostId: inheritingHostId },
    });

    return Boolean(
      leaveRoomResult && updateUserResult && updateInheritingHostResult,
    );
  }
}
