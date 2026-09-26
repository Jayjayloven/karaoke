export interface CreateRoomReq {
  roomName: string;
  hostId: string;
}

export interface DeleteRoomReq {
  roomId: string;
  hostId: string;
}

export interface JoinRoomReq {
  userId: string;
  roomId: string;
  roomCode: string;
}

export interface LeaveRoomReq {
  userId: string;
  roomId: string;
}
