import type { SongEntry } from "../domain/SongEntry.js";

export interface ISongQueueRepository {
  queueSong(
    userId: string,
    roomId: string,
    songName: string,
    mediaUrl: string,
  ): Promise<SongEntry>;
  removeQueuedSong(songId: string): Promise<boolean>;
  findQueuedSongById(songId: string): Promise<SongEntry | null>;
  updateQueuedSong(
    songId: string,
    songName: string,
    mediaUrl: string,
  ): Promise<boolean>;
}
