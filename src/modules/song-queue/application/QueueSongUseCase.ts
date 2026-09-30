import type { WebSocketConnectionManager } from "../../../shared/core/WebSocketConnectionManager.js";
import type { RoomRepository } from "../../room/infrastructure/RoomRepository.js";
import type { UserRepository } from "../../user/infrastructure/UserRepository.js";
import { SongEntry } from "../domain/SongEntry.js";
import { SongEntryWebSocketAction } from "../models/SongEntryWebSocketActionEnum.js";
import type { QueueSongReq } from "../models/SongQueueDTO.js";
import type { ISongQueueRepository } from "../models/ISongQueueRepository.js";
import type { RequestValidators } from "../../../shared/RequestValidators.js";

export class QueueSongUseCase {
  constructor(
    private readonly songQueueRepo: ISongQueueRepository,
    private readonly webSocketManager: WebSocketConnectionManager,
    private readonly requestValidator: RequestValidators,
  ) {}

  public async execute(data: QueueSongReq): Promise<{
    songEntryId: string;
    roomId: string;
    userId: string;
    songName: string;
    mediaUrl: string;
    hasPlayed: boolean;
  }> {
    const { userId, roomId, songName, mediaUrl } = data;

    const user = await this.requestValidator.doesUserExist(data.userId);

    await this.requestValidator.doesRoomExist(data.roomId);

    const savedSongEntry = await this.songQueueRepo.queueSong(
      userId,
      roomId,
      songName,
      mediaUrl,
    );

    this.webSocketManager.broadcastToRoom(roomId, {
      action: SongEntryWebSocketAction.QUEUED_SONG,
      userId: userId,
      message: `${user.getUsername()} has queued the song: ${songName}`,
      data: { newSong: savedSongEntry.getSongEntryInfo() },
    });

    return savedSongEntry.getSongEntryInfo();
  }
}
