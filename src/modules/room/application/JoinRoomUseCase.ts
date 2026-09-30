import type { WebSocketConnectionManager } from "../../../shared/core/WebSocketConnectionManager.js";
import type { RequestValidators } from "../../../shared/RequestValidators.js";
import type { IUserRepository } from "../../user/models/IUserRepository.js";
import type { IRoomRepository } from "../models/IRoomRepository.js";
import type { JoinRoomReq } from "../models/RoomDTO.js";
import { RoomWebSocketAction } from "../models/RoomWebSocketActionEnum.js";

export class JoinRoomUseCase {
  constructor(
    private readonly roomRepo: IRoomRepository,
    private readonly userRepo: IUserRepository,
    private readonly webSocketManager: WebSocketConnectionManager,
    private readonly requestValidator: RequestValidators,
  ) {}

  public async execute(data: JoinRoomReq): Promise<boolean> {
    const user = await this.requestValidator.doesUserExist(data.userId);
    const requestedRoom = await this.requestValidator.doesRoomExist(
      data.roomId,
    );

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
