import type { User } from "../domain/User.js";

export interface IUserRepository {
  createUser(username:string): Promise<User>;
  findUsersByRoomId(roomId: number): Promise<User[]>;
  findUserById(userId: string): Promise<User | null>;
  updateUser(user: User): Promise<boolean>;
}
