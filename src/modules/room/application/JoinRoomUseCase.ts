import type { WebSocketConnectionManager } from "../../../shared/core/WebSocketConnectionManager.js";
import type { IUserRepository } from "../../user/models/IUserRepository.js";
import type { IRoomRepository } from "../models/IRoomRepository.js";
import type { JoinRoomReq } from "../models/RoomDTO.js";
import { RoomWebSocketAction } from "../models/RoomWebSocketActionEnum.js";

export class JoinRoomUseCase {
  constructor(
    private readonly roomRepo: IRoomRepository,
    private readonly userRepo: IUserRepository,
    private readonly webSocketManager: WebSocketConnectionManager,
  ) {}

  public async execute(data: JoinRoomReq): Promise<boolean> {
    const requestedRoom = await this.roomRepo.findById(data.roomId);
    if (!requestedRoom) {
      throw new Error(`Room with ID ${data.roomId} not found.`);
    }
    const user = await this.userRepo.findUserById(String(data.userId));
    if (!user) {
      throw new Error(
        `Cannot join room: Host with ID ${data.userId} does not exist.`,
      );
    }

    requestedRoom.validateRoomStatus();
    requestedRoom.validateRoomCode(data.roomCode);
    user.changeRoomId(data.roomId);

    const joinRoomResult = await this.roomRepo.joinRoom(
      data.userId,
      requestedRoom.getId(),
    );
    const updateUserResult = await this.userRepo.updateUser(user);

    this.webSocketManager.broadcastToRoom(data.roomId, {
      action: RoomWebSocketAction.USER_JOINED,
      userId: data.userId,
      message: `${user.getUsername()} has joined the room: ${requestedRoom.getRoomName()}`,
    });

    return joinRoomResult && updateUserResult;
  }
}
