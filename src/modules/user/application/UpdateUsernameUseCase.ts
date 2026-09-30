import type { RequestValidators } from "../../../shared/RequestValidators.js";
import type { IUserRepository } from "../models/IUserRepository.js";
import type { UpdateUsernameReq } from "../models/UserDTO.js";

export class UpdateUsernameUseCase {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly requestValidator: RequestValidators,
  ) {}

  // TODO: How would this update the room that the user is in (if they're in one)
  public async execute(data: UpdateUsernameReq): Promise<boolean> {
    const user = await this.requestValidator.doesUserExist(data.userId);
    user.changeUsername(data.username);
    const savedUser = await this.userRepo.updateUser(user);
    return savedUser;
  }
}
