import type { WebSocketConnectionManager } from "../../../shared/core/WebSocketConnectionManager.js";
import type { RequestValidators } from "../../../shared/RequestValidators.js";
import type { UserRepository } from "../../user/infrastructure/UserRepository.js";
import type { RoomRepository } from "../infrastructure/RoomRepository.js";
import type { ChangeUserReq } from "../models/RoomDTO.js";
import { RoomWebSocketAction } from "../models/RoomWebSocketActionEnum.js";

export class ChangeHostUseCase {
  constructor(
    private readonly roomRepository: RoomRepository,
    private readonly requestValidator: RequestValidators,
    private readonly webSocketManager: WebSocketConnectionManager,
  ) {}

  public async execute(data: ChangeUserReq) {
    await this.requestValidator.doesUserExist(data.userId);
    const newHost = await this.requestValidator.doesUserExist(data.newHostId);
    const room = await this.requestValidator.doesRoomExist(data.roomId);

    room.isRoomHost(data.userId);
    newHost.isUserInRoom(data.roomId);

    room.changeHost(data.newHostId);

    const result = this.roomRepository.updateRoom(room);

    this.webSocketManager.broadcastToRoom(data.roomId, {
      action: RoomWebSocketAction.USER_JOINED,
      userId: data.userId,
      message: `${newHost.getUsername} has been made host`,
      data: { newHost: newHost.getUserInfo() },
    });

    return result;
  }
}
