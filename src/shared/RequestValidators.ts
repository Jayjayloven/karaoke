import type { Room } from "../modules/room/domain/Room.js";
import type { RoomRepository } from "../modules/room/infrastructure/RoomRepository.js";
import type { SongEntry } from "../modules/song-queue/domain/SongEntry.js";
import type { SongQueueRepository } from "../modules/song-queue/repository/SongQueueRepository.js";
import type { User } from "../modules/user/domain/User.js";
import type { UserRepository } from "../modules/user/infrastructure/UserRepository.js";

export class RequestValidators {
  constructor(
    private readonly songQueueRepo: SongQueueRepository,
    private readonly userRepo: UserRepository,
    private readonly roomRepo: RoomRepository,
  ) {}

  public async doesUserExist(userId: string): Promise<User> {
    const user = await this.userRepo.findUserById(String(userId));
    if (!user) {
      throw new Error(`User with ID ${userId} not found.`);
    }
    return user;
  }

  public async doesRoomExist(roomId: string): Promise<Room> {
    const room = await this.roomRepo.findRoomById(roomId);
    if (!room) {
      throw new Error(`Room with ID ${roomId} not found.`);
    }
    return room;
  }

  public async doesSongEntryExist(songId: string): Promise<SongEntry> {
    const songEntry = await this.songQueueRepo.findQueuedSongById(songId);
    if (!songEntry) {
      throw new Error(`Song entry with ID ${songId} not found.`);
    }
    return songEntry;
  }
}
