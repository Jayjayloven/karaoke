import type { PostgresDbPool } from "../../../shared/core/postgres.js";
import { SongEntry } from "../domain/SongEntry.js";

export class SongQueueRepository {
  constructor(private readonly dbPool: PostgresDbPool) {}

  public async queueSong(
    userId: string,
    roomId: string,
    songName: string,
    mediaUrl: string,
  ): Promise<SongEntry> {
    const query = `
    INSERT INTO song_queue (user_id, room_id, song_name, media_url)
    VALUES ($1, $2, $3, $4)
    RETURNING *`;

    const values = [userId, roomId, songName, mediaUrl];
    const result = await this.dbPool.query(query, values);
    const row = result.rows[0];

    return new SongEntry(
      row.id,
      row.room_id,
      row.user_id,
      row.song_name,
      row.media_url,
      row.has_played,
    );
  }

  public async getUnplayedSongsByRoom(roomId: string): Promise<SongEntry[]> {
    const query = `SELECT * FROM song_queue WHERE room_id = $1 AND has_played = false`;
    const values = [roomId];

    const result = await this.dbPool.query(query, values);

    return result.rows.map(
      (row) =>
        new SongEntry(
          row.id,
          row.room_id,
          row.user_id,
          row.song_name,
          row.media_url,
          row.has_played,
        ),
    );
  }

  public async removeQueuedSong(songId: string): Promise<boolean> {
    const query = `DELETE FROM song_queue WHERE id = $1`;
    const result = await this.dbPool.query(query, [songId]);
    return result.rowCount !== null && result.rowCount > 0;
  }

  public async findQueuedSongById(songId: string): Promise<SongEntry | null> {
    const query = `SELECT * FROM song_queue WHERE id = $1`;
    const result = await this.dbPool.query(query, [songId]);

    if (!result || result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return new SongEntry(
      row.id,
      row.room_id,
      row.user_id,
      row.song_name,
      row.media_url,
      row.has_played,
    );
  }

  public async updateQueuedSong(
    songId: string,
    songName: string,
    mediaUrl: string,
  ): Promise<boolean> {
    const query = `
    UPDATE song_queue SET song_name = $1, media_url = $2 
    WHERE id = $3`;
    const values = [songName, mediaUrl, songId];

    const result = await this.dbPool.query(query, values);

    return result.rowCount !== null && result.rowCount > 0;
  }
}
