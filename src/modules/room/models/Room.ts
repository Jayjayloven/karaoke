import type { RoomStatusEnum } from "./RoomStatus.js";

export interface Room {
  id: number;
  room_name: string;
  room_code: string;
  host_id: string;
  created_at: string;
  status: RoomStatusEnum;
}
