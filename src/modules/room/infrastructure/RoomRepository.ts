import type { PostgresDbPool } from "../../../shared/core/postgress.js";
import type { Room } from "../models/Room.js";
import { RoomStatusEnum } from "../models/RoomStatus.js";

export class RoomRepository {
  private dbPool: PostgresDbPool;

  constructor(dbPool: PostgresDbPool) {
    this.dbPool = dbPool;
  }

  public async findById(id: number) {
    const query = `SELECT * FROM rooms WHERE id = $1`;
    const values = [id];

    try {
      const result = await this.dbPool.query(query, values);
      return result.rows[0] || null;
    } catch (error) {
      console.error("Error executing findById:", error);
      throw error;
    }
  }

  public async createRoom(roomName: string, hostId: string): Promise<Room> {
    const query = `
      INSERT INTO rooms(room_name, host_id, status)
      VALUES ($1, $2, $3)
      RETURNING *`;

    const values = [roomName, hostId, RoomStatusEnum.OPEN];

    try {
      console.log("in create Room Repository")
      const result = await this.dbPool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error("Error creating room:", error);
      throw error;
    }
  }
}
