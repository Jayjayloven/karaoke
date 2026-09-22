import type { User } from "../domain/User.js";
import type { IUserRepository } from "../models/IUserRepository.js";
import type { CreateUserReq } from "../models/UserDTO.js";

export class CreateUserUseCase {
  constructor(private readonly userRepo: IUserRepository) {}

  public async execute(data: CreateUserReq): Promise<User> {
    const savedUser = await this.userRepo.createUser(data.username);
    return savedUser;
  }
}
