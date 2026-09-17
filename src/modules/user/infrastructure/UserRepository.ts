import type { PostgresDbPool } from "../../../shared/core/postgres.js";
import { User } from "../domain/User.js";

export class UserRepository {
  constructor(private readonly dbPool: PostgresDbPool) {}

  public async findUsersByRoomId(roomId: number): Promise<User[]> {
    const query = `SELECT * FROM users WHERE room_id = $1`;
    const result = await this.dbPool.query(query, [roomId]);

    if (!result || result.rows.length === 0) {
      return [];
    }

    let users: User[] = [];

    result.rows.forEach((user) => {
      users.push(new User(user.id, user.username, user.room_id));
    });

    return users;
  }

  public async findUserById(userId: string): Promise<User | null> {
    const query = `SELECT * FROM users WHERE id = $1`;
    const result = await this.dbPool.query(query, [userId]);

    if (!result || result.rows.length === 0) {
      return null;
    }

    const user = result.rows[0];

    return new User(user.id, user.username, user.room_id);
  }
}
