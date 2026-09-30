import type { WebSocketConnectionManager } from "../../../shared/core/WebSocketConnectionManager.js";
import type { RequestValidators } from "../../../shared/RequestValidators.js";
import type { User } from "../../user/domain/User.js";
import type { IUserRepository } from "../../user/models/IUserRepository.js";
import type { IRoomRepository } from "../models/IRoomRepository.js";
import type { DeleteRoomReq } from "../models/RoomDTO.js";
import { RoomWebSocketAction } from "../models/RoomWebSocketActionEnum.js";

// TODO: change to a soft delete
export class DeleteRoomUseCase {
  constructor(
    private readonly roomRepo: IRoomRepository,
    private readonly userRepo: IUserRepository,
    private readonly webSocketManager: WebSocketConnectionManager,
    private readonly requestValidator: RequestValidators,
  ) {}

  public async execute(data: DeleteRoomReq): Promise<boolean> {
    const room = await this.requestValidator.doesRoomExist(data.roomId);

    const host = await this.requestValidator.doesUserExist(data.hostId);

    room.validateOwnership(data.hostId);

    const usersInRoom = await this.userRepo.findUsersByRoomId(data.roomId);

    await Promise.all(
      usersInRoom.map(async (user: User) => {
        user.clearRoomId();
        await this.userRepo.updateUser(user);
      }),
    );

    this.webSocketManager.broadcastToRoom(data.roomId, {
      action: RoomWebSocketAction.ROOM_CLOSED,
      userId: data.hostId,
      message: `${host.getUsername()} has closed the room: ${room.getRoomName()}`,
    });

    return await this.roomRepo.deleteRoom(room.getId());
  }
}
