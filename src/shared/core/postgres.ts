import { Pool, type PoolClient } from "pg";

export class PostgresDbPool {
  private readonly dbPool: Pool;

  constructor() {
    this.dbPool = new Pool({
      user: process.env.POSTGRES_USER,
      host: process.env.DB_HOST,
      database: process.env.POSTGRES_DB,
      password: process.env.POSTGRES_PASSWORD,
      port: Number(process.env.DB_PORT),
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });
  }

  public async query(text: string, params?: any[]) {
    return this.dbPool.query(text, params);
  }

  public async getClient(): Promise<PoolClient> {
    return await this.dbPool.connect();
  }

  public releaseClient(client: PoolClient) {
    client.release();
  }
}

//TODO instantiate in app.tsx
export const dbPool = new PostgresDbPool();
