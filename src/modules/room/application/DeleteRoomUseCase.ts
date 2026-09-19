import type { WebSocketConnectionManager } from "../../../shared/core/WebSocketConnectionManager.js";
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
  ) {}

  public async execute(data: DeleteRoomReq): Promise<boolean> {
    const room = await this.roomRepo.findById(data.roomId);
    if (!room) {
      throw new Error(`Room with ID ${data.roomId} not found.`);
    }

    const host = await this.userRepo.findUserById(String(data.hostId));
    if (!host) {
      throw new Error(
        `Cannot join room: Host with ID ${data.hostId} does not exist.`,
      );
    }

    room.verifyOwnership(data.hostId);

    const usersInRoom = await this.userRepo.findUsersByRoomId(data.roomId);
    usersInRoom.forEach(async (user: User) => {
      user.changeRoomId(null);
      await this.userRepo.updateUser(user);
    });

    this.webSocketManager.broadcastToRoom(data.roomId, {
      action: RoomWebSocketAction.ROOM_CLOSED,
      userId: data.hostId,
      message: `${host.getUsername()} has closed the room: ${room.getRoomName()}`,
    });

    return await this.roomRepo.deleteRoom(room.getId());
  }
}
