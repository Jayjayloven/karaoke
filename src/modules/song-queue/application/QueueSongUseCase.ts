import type { WebSocketConnectionManager } from "../../../shared/core/WebSocketConnectionManager.js";
import type { RoomRepository } from "../../room/infrastructure/RoomRepository.js";
import type { UserRepository } from "../../user/infrastructure/UserRepository.js";
import type { SongEntry } from "../domain/SongEntry.js";
import { SongEntryWebSocketAction } from "../models/SongEntryWebSocketActionEnum.js";
import type { QueueSongReq } from "../models/SongQueueDTO.js";
import type { SongQueueRepository } from "../repository/SongQueueRepository.js";

export class QueueSongUseCase {
  constructor(
    private readonly songQueueRepo: SongQueueRepository,
    private readonly userRepo: UserRepository,
    private readonly roomRepo: RoomRepository,
    private readonly webSocketManager: WebSocketConnectionManager,
  ) {}

  public async execute(data: QueueSongReq): Promise<SongEntry> {
    const { userId, roomId, songName, mediaUrl } = data;

    const user = await this.userRepo.findUserById(String(userId));
    if (!user) {
      throw new Error(
        `Cannot add song entry. Requesting user with ID ${userId} does not exist`,
      );
    }

    const room = await this.roomRepo.findRoomById(roomId);
    if (!room) {
      throw new Error(`Cannot add song entry. Room ${roomId} does not exist.`);
    }

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
    });

    return savedSongEntry;
  }
}
