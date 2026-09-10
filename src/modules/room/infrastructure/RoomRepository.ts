import type { PostgresDbPool } from "../../../shared/core/postgress.js";
import type { Room } from "../models/Room.js";
import { RoomStatusEnum } from "../models/RoomStatus.js";

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

    return result.rows[0];
  }

  public async createRoom(roomName: string, hostId: number): Promise<Room> {
    const query = `
      INSERT INTO rooms(room_name, host_id, status)
      VALUES ($1, $2, $3)
      RETURNING *`;

    const values = [roomName, hostId, RoomStatusEnum.OPEN];
    const result = await this.dbPool.query(query, values);

    return result.rows[0];
  }

  public async deleteRoom(roomId: number, userId: number): Promise<boolean> {
    const room = await this.findById(roomId);

    if (!room) {
      throw new NotFoundError(`Room with ID ${roomId} not found.`);
    }

    if (Number.parseInt(room.host_id) !== userId) {
      throw new UnauthorizedError(
        `User ${userId} is not authorized to delete room ${roomId}.`,
      );
    }

    const query = `DELETE FROM rooms WHERE id = $1`;
    const result = await this.dbPool.query(query, [roomId]);
    return result.rowCount !== null && result.rowCount > 0;
  }
}
