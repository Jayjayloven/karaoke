import type { WebSocketConnectionManager } from "../../../shared/core/WebSocketConnectionManager.js";
import type { RequestValidators } from "../../../shared/RequestValidators.js";
import { SongEntryWebSocketAction } from "../models/SongEntryWebSocketActionEnum.js";
import type { RemoveSongFromQueueReq } from "../models/SongQueueDTO.js";
import type { SongQueueRepository } from "../repository/SongQueueRepository.js";

export class RemoveSongFromQueueUseCase {
  constructor(
    private readonly songQueueRepo: SongQueueRepository,
    private readonly webSocketManager: WebSocketConnectionManager,
    private readonly requestValidator: RequestValidators,
  ) {}

  public async execute(data: RemoveSongFromQueueReq): Promise<boolean> {
    const requestingUser = await this.requestValidator.doesUserExist(
      data.userId,
    );
    const room = await this.requestValidator.doesRoomExist(data.roomId);
    const songEntry = await this.requestValidator.doesSongEntryExist(
      data.songId,
    );

    const isValidRequester =
      room.isRoomHost(data.roomId) || songEntry.isRequester(data.userId);

    if (!isValidRequester) {
      throw new Error(
        `Cannot remove song. User with ID ${data.userId} is neither the host or the requester.`,
      );
    }

    this.webSocketManager.broadcastToRoom(data.roomId, {
      type: SongEntryWebSocketAction.REMOVE_SONG,
      userId: data.userId,
      message: `${requestingUser.getUsername()} has removed the song: ${songEntry.getSongEntryInfo().songName}`,
    });

    return await this.songQueueRepo.removeQueuedSong(data.songId);
  }
}
