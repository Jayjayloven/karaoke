import type { Room } from "../domain/Room.js";

export interface RenameRoomDTO {
  roomId: string;
  newName: string;
}

export class RenameRoomUseCase {
  constructor(private roomRepo: IRoomRepository) {}

  public async execute(data: RenameRoomDTO): Promise<Room> {
    const room = await this.roomRepo.findById(data.roomId);

    if (!room) {
      throw new Error(`Room ${data.newName} not found`);
    }

    room.rename(data.newName);

    await this.roomRepo.save(room);

    return room;
  }
}
