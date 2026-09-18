import type { User } from "../../user/domain/User.js";
import type { IUserRepository } from "../../user/models/IUserRepository.js";
import type { IRoomRepository } from "../models/IRoomRepository.js";
import type { DeleteRoomReq } from "../models/RoomDTO.js";

// TODO: change to a soft delete
export class DeleteRoomUseCase {
  constructor(
    private readonly roomRepo: IRoomRepository,
    private readonly userRepo: IUserRepository,
  ) {}

  public async execute(data: DeleteRoomReq): Promise<boolean> {
    const room = await this.roomRepo.findById(data.roomId);

    if (!room) {
      throw new Error(`Room with ID ${data.roomId} not found.`); // Or your NotFoundError
    }

    room.verifyOwnership(data.userId);

    const usersInRoom = await this.userRepo.findUsersByRoomId(data.roomId);
    usersInRoom.forEach(async (user: User) => {
      user.changeRoomId(null);
      await this.userRepo.updateUser(user);
    });

    return await this.roomRepo.deleteRoom(room.getId());
  }
}
