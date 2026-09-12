import type { PostgresDbPool } from "../../../shared/core/postgress.js";
import { Room } from "../domain/Room.js";

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

export class UnauthorizedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export class RoomRepository {
  private readonly dbPool: PostgresDbPool;

  constructor(dbPool: PostgresDbPool) {
    this.dbPool = dbPool;
  }

  public async findById(id: number): Promise<Room | null> {
    const query = `SELECT * FROM rooms WHERE id = $1`;
    const result = await this.dbPool.query(query, [id]);

    if (!result || result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return new Room(
      row.id,
      row.room_name,
      row.room_code,
      row.host_id,
      row.created_at,
      row.status,
    );
  }

  public async createRoom(room: Room): Promise<Room> {
    const query = `
    INSERT INTO rooms(room_name, host_id, status)
    VALUES ($1, $2, $3)
    RETURNING *`;

    // Extract data from the domain entity
    const values = [room.getRoomName(), room.getHostId(), room.getStatus()];
    const result = await this.dbPool.query(query, values);
    const row = result.rows[0];

    // Reconstruct and return a fully populated Domain Entity from the database
    return new Room(
      row.id,
      row.room_name,
      row.room_code,
      row.host_id,
      row.created_at,
      row.status,
    );
  }

  // The delete method becomes dead simple:
  public async deleteRoom(roomId: number): Promise<boolean> {
    const query = `DELETE FROM rooms WHERE id = $1`;
    const result = await this.dbPool.query(query, [roomId]);
    return result.rowCount !== null && result.rowCount > 0;
  }

  public async joinRoom(userId: string, roomId: number): Promise<boolean> {
    const query = `UPDATE users SET room_id = $1 WHERE id = $2`;

    const values = [roomId, userId];

    const result = await this.dbPool.query(query, values);

    return result.rowCount !== null && result.rowCount > 0;
  }

  public async updateRoom(room: Room): Promise<boolean> {
    const query = `UPDATE rooms SET status = $1, host_id = $2, room_name = $3 WHERE id = $4`;
    const values = [
      room.getStatus(),
      room.getHostId(),
      room.getRoomName(),
      room.getId(),
    ];

    const result = await this.dbPool.query(query, values);

    return result.rowCount !== null && result.rowCount > 0;
  }
}
