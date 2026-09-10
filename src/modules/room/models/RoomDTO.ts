export interface CreateRoomReq {
  roomName: string;
  hostId: number;
}

export interface DeleteRoomReq {
  roomId: number;
  userId: number;
}
