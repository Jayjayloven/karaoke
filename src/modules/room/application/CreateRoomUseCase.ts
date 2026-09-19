import type { IRoomRepository } from "../models/IRoomRepository.js";
import { Room } from "../domain/Room.js";
import type { CreateRoomReq } from "../models/RoomDTO.js";
import { RoomStatusEnum } from "../models/RoomStatus.js";
import type { IUserRepository } from "../../user/models/IUserRepository.js";
import type { WebSocketConnectionManager } from "../../../shared/core/WebSocketConnectionManager.js";
import { RoomWebSocketAction } from "../models/RoomWebSocketActionEnum.js";

export class CreateRoomUseCase {
  constructor(
    private readonly roomRepo: IRoomRepository,
    private readonly userRepo: IUserRepository,
    private readonly webSocketManager: WebSocketConnectionManager,
  ) {}

  public async execute(data: CreateRoomReq): Promise<Room> {
    const host = await this.userRepo.findUserById(String(data.hostId));

    if (!host) {
      throw new Error(
        `Cannot create room: Host with ID ${data.hostId} does not exist.`,
      );
    }
    const newRoom = Room.createRoom(
      data.roomName,
      data.hostId,
      RoomStatusEnum.OPEN,
    );
    const savedRoom = await this.roomRepo.createRoom(newRoom);
    const roomId = savedRoom.getId();
    await this.roomRepo.joinRoom(String(data.hostId), roomId);

    host.changeRoomId(roomId);
    await this.userRepo.updateUser(host);

    this.webSocketManager.broadcastToRoom(savedRoom.getId(), {
      action: RoomWebSocketAction.ROOM_CREATED,
      userId: data.hostId,
      message: `${host.getUsername()} has created the room: ${newRoom.getRoomName()}`,
    });

    return savedRoom;
  }
}
