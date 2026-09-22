import type { IUserRepository } from "../models/IUserRepository.js";
import type { UpdateUsernameReq } from "../models/UserDTO.js";

export class UpdateUsernameUseCase {
  constructor(private readonly userRepo: IUserRepository) {}

  public async execute(data: UpdateUsernameReq): Promise<boolean> {
    const user = await this.userRepo.findUserById(data.userId);

    if (!user) {
      throw new Error(`User with ID ${data.userId} not found.`);
    }

    user.changeUsername(data.username);
    const savedUser = await this.userRepo.updateUser(user);
    return savedUser;
  }
}
