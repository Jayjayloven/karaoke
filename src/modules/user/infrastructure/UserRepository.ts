import type { PostgresDbPool } from "../../../shared/core/postgres.js";
import { User } from "../domain/User.js";

export class UserRepository {
  constructor(private readonly dbPool: PostgresDbPool) {}

  public async createUser(username: string): Promise<User> {
    const query = `
      INSERT INTO users(username)
      VALUES ($1)
      RETURNING *`;

    // Extract data from the domain entity
    const values = [username];
    const result = await this.dbPool.query(query, values);
    const row = result.rows[0];

    // Reconstruct and return a fully populated Domain Entity from the database
    return new User(row.id, row.username, row.room_id);
  }

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

  public async updateUser(user: User) {
    const query = `UPDATE users SET username = $1, room_id = $2 WHERE id = $3`;
    const values = [user.getUsername(), user.getRoomId(), user.getUserId()];

    const result = await this.dbPool.query(query, values);

    return result.rowCount !== null && result.rowCount > 0;
  }
}
