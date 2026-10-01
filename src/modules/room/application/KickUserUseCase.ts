import type { WebSocketConnectionManager } from "../../../shared/core/WebSocketConnectionManager.js";
import type { RequestValidators } from "../../../shared/RequestValidators.js";
import type { UserRepository } from "../../user/infrastructure/UserRepository.js";
import type { KickUserReq } from "../models/RoomDTO.js";
import { RoomWebSocketAction } from "../models/RoomWebSocketActionEnum.js";

export class KickUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly requestValidator: RequestValidators,
    private readonly webSocketManager: WebSocketConnectionManager,
  ) {}

  public async execute(data: KickUserReq) {
    await this.requestValidator.doesUserExist(data.userId);
    const userToBeRemoved = await this.requestValidator.doesUserExist(
      data.userToBeRemovedId,
    );
    const room = await this.requestValidator.doesRoomExist(data.roomId);

    room.isRoomHost(data.userId);
    userToBeRemoved.isUserInRoom(data.roomId);

    userToBeRemoved.clearRoomId();

    const result = this.userRepository.updateUser(userToBeRemoved);

    this.webSocketManager.broadcastToRoom(data.roomId, {
      action: RoomWebSocketAction.USER_JOINED,
      userId: data.userId,
      message: `${userToBeRemoved.getUsername} has been kicked from room: ${room.getRoomName()}`,
      data: { kickedUser: userToBeRemoved.getUserInfo() },
    });

    return result;
  }
}
