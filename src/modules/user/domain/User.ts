export class User {
  constructor(
    private readonly userId: string,
    private username: string,
    private roomId: string | null,
  ) {}

  public getUserInfo(): {
    userId: string;
    username: string;
    roomId: string | null;
  } {
    return {
      userId: this.userId,
      username: this.username,
      roomId: this.roomId,
    };
  }

  public getUserId(): string {
    return this.userId;
  }

  public getUsername(): string {
    return this.username;
  }

  public changeUsername(newUsername: string): void {
    this.username = newUsername;
  }

  public getRoomId(): string | null {
    return this.roomId;
  }

  public clearRoomId(): void {
    this.roomId = null;
  }

  public changeRoomId(newRoomId: string | null): void {
    this.roomId = newRoomId;
  }

  public isUserInRoom(roomId: string) {
    if (this.roomId != roomId) {
      throw new Error(`User ${this.getUserId} is not in Room ${roomId}`);
    }
  }
}
