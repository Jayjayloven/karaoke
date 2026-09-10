import type { IRoomRepository } from "../models/IRoomRepository.js";
import type { DeleteRoomReq } from "../models/RoomDTO.js";

export class DeleteRoomUseCase {
  constructor(private readonly roomRepo: IRoomRepository) {}

  public async execute(data: DeleteRoomReq): Promise<boolean> {
    try {
      const result = await this.roomRepo.deleteRoom(data.roomId, data.userId);
      return result;
    } catch (err) {
      console.error("Failed to execute DeleteRoom use case:", err);
      throw err;
    }
  }
}
