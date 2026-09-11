export interface CreateRoomReq {
  roomName: string;
  hostId: number;
}

export interface DeleteRoomReq {
  roomId: number;
  userId: number;
}

export interface JoinRoomReq {
  userId: string;
  roomId: number;
  roomCode: string;
}
