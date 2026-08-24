/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  // 1. Create Users Table
  pgm.createTable("users", {
    id: "id", // Automatically creates a serial primary key
    username: { type: "varchar(100)", notNull: true },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });

  // 2. Create Rooms Table
  pgm.createTable("rooms", {
    id: "id",
    room_code: { type: "varchar(10)", notNull: true, unique: true },
    host_id: {
      type: "integer",
      notNull: true,
      references: '"users"',
      onDelete: "cascade", // If the host is deleted, delete the room
    },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });

  pgm.addColumn("users", {
    room_id: {
      type: "integer",
      references: "rooms",
      onDelete: "SET NULL",
    },
  });

  pgm.createTable("song_queue", {
    id: "id",
    room_id: {
      type: "integer",
      notNull: true,
      references: '"rooms"',
      onDelete: "cascade",
    },
    user_id: {
      type: "integer",
      notNull: true,
      references: '"users"',
      onDelete: "cascade",
    },
    song_name: { type: "varchar(255)", notNull: true },
    artist: { type: "varchar(255)" },
    is_played: { type: "boolean", default: false },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable("song_que");
  pgm.dropColumns("users", [session_id]);
  pgm.dropTable("rooms");
  pgm.dropTable("users");
};
