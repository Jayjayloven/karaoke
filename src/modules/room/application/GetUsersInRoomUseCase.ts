import type { RequestValidators } from "../../../shared/RequestValidators.js";
import type { User } from "../../user/domain/User.js";
import type { IUserRepository } from "../../user/models/IUserRepository.js";
import type { IRoomRepository } from "../models/IRoomRepository.js";
import type { GetUsersInRoomReq } from "../models/RoomDTO.js";

export class GetUsersInRoomUseCase {
  constructor(
    private readonly roomRepo: IRoomRepository,
    private readonly userRepo: IUserRepository,
    private readonly requestValidator: RequestValidators,
  ) {}
  public async execute(data: GetUsersInRoomReq): Promise<User[]> {
    const user = await this.requestValidator.doesUserExist(data.userId);
    user.isUserInRoom(data.roomId);
    await this.requestValidator.doesRoomExist(data.roomId);

    const usersInRoom = this.userRepo.findUsersByRoomId(data.roomId);

    return usersInRoom;
  }
}
