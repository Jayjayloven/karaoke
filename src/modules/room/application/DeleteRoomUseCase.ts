import type { IRoomRepository } from "../models/IRoomRepository.js";
import type { DeleteRoomReq } from "../models/RoomDTO.js";

// TODO: change to a soft delete
export class DeleteRoomUseCase {
  constructor(private readonly roomRepo: IRoomRepository) {}

  public async execute(data: DeleteRoomReq): Promise<boolean> {
    const room = await this.roomRepo.findById(data.roomId);

    if (!room) {
      throw new Error(`Room with ID ${data.roomId} not found.`); // Or your NotFoundError
    }

    room.verifyOwnership(data.userId);

    return await this.roomRepo.deleteRoom(room.getId());
  }
  //TODO: when a host leaves a room they need to close the room if no one else is in the room or make whoever joined second the room host
}
