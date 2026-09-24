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
  pgm.sql(`
    CREATE OR REPLACE FUNCTION generate_unique_room_code()
    RETURNS text AS $$
    DECLARE
      chars text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      new_code text;
      is_unique boolean;
    BEGIN
      LOOP
        new_code := '';
        FOR i IN 1..4 LOOP
          new_code := new_code || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
        END LOOP;
        SELECT NOT EXISTS(SELECT 1 FROM rooms WHERE room_code = new_code) INTO is_unique;
        EXIT WHEN is_unique;
      END LOOP;
      RETURN new_code;
    END;
    $$ LANGUAGE plpgsql VOLATILE;
  `);

  pgm.createTable("users", {
    id: "id",
    username: { type: "varchar(100)", notNull: true },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });

  // 3. Create Rooms Table
  pgm.createTable("rooms", {
    id: "id",
    room_name: { type: "varchar(100)", notNull: true },
    room_code: {
      type: "varchar(10)",
      notNull: true,
      unique: true,
      default: pgm.func("generate_unique_room_code()"),
    },
    host_id: {
      type: "integer",
      notNull: true,
      references: '"users"',
      onDelete: "cascade",
    },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
    status: {
      type: "varchar(20)",
      notNull: true,
      default: "open",
      check: "status IN ('open', 'closed')",
    },
  });

  pgm.addColumn("users", {
    room_id: {
      type: "integer",
      references: '"rooms"',
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
    media_url: {type: "varchar(255)"},
    has_played: { type: "boolean", default: false },
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
  pgm.dropTable("song_queue");
  pgm.dropColumns("users", ["room_id"]);

  pgm.dropTable("rooms");
  pgm.dropTable("users");

  pgm.sql(`DROP FUNCTION IF EXISTS generate_unique_room_code();`);
};
