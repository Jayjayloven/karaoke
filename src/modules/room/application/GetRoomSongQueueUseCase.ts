import type { RequestValidators } from "../../../shared/RequestValidators.js";
import type { SongQueueRepository } from "../../song-queue/infrastructure/SongQueueRepository.js";
import type { GetRoomSongQueueReq } from "../models/RoomDTO.js";

export class GetRoomSongQueueUseCase {
  constructor(
    private readonly songRepo: SongQueueRepository,
    private readonly requestValidator: RequestValidators,
  ) {}

  public async execute(data: GetRoomSongQueueReq) {
    const { userId, roomId } = data;

    const user = await this.requestValidator.doesUserExist(userId);
    await this.requestValidator.doesRoomExist(roomId);
    user.isUserInRoom(roomId);

    const songs = await this.songRepo.getUnplayedSongsByRoom(roomId);

    return songs.map((songEntry) => songEntry.getSongEntryInfo());
  }
}
