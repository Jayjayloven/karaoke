import type { WebSocketConnectionManager } from "../../../shared/core/WebSocketConnectionManager.js";
import type { RequestValidators } from "../../../shared/RequestValidators.js";
import { SongEntryWebSocketAction } from "../models/SongEntryWebSocketActionEnum.js";
import type { EditSongEntryReq } from "../models/SongQueueDTO.js";
import type { ISongQueueRepository } from "../models/ISongQueueRepository.js";

export class EditQueuedSongUseCase {
  constructor(
    private readonly songQueueRepo: ISongQueueRepository,
    private readonly webSocketManager: WebSocketConnectionManager,
    private readonly requestValidator: RequestValidators,
  ) {}

  public async execute(data: EditSongEntryReq): Promise<boolean> {
    const { userId, roomId, songId, songName, mediaUrl } = data;

    const user = await this.requestValidator.doesUserExist(userId);
    const room = await this.requestValidator.doesRoomExist(roomId);
    const songEntry = await this.requestValidator.doesSongEntryExist(songId);

    const hasSongBeenPlayed = songEntry.getSongEntryInfo().hasPlayed;

    if (hasSongBeenPlayed) {
      throw new Error(
        `Cannot edit song. Song entry : ${songId} is no longer in queue.`,
      );
    }

    const isValidRequester =
      room.isRoomHost(data.userId) || songEntry.isRequester(data.userId);

    if (!isValidRequester) {
      throw new Error(
        `Cannot remove song. User with ID ${data.userId} is neither the host or the requester.`,
      );
    }

    songEntry.changeSong(songName, mediaUrl);

    const result = await this.songQueueRepo.updateQueuedSong(
      songId,
      songName,
      mediaUrl,
    );

    this.webSocketManager.broadcastToRoom(data.roomId, {
      type: SongEntryWebSocketAction.EDIT_SONG,
      userId: data.userId,
      message: `${user.getUsername()} has updated a song with ID: ${songId}`,
      data: songEntry.getSongEntryInfo(),
    });

    return result;
  }
}
