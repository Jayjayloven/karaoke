export class User {
  constructor(
    private readonly userId: string,
    private readonly username: string,
    private roomId: number | null,
  ) {}

  public getUserId(): string {
    return this.userId;
  }

  public getUsername(): string {
    return this.username;
  }

  public getRoomId(): number {
    return Number(this.roomId);
  }

  public clearRoomId(): void {
    this.roomId = null;
  }

  public changeRoomId(newRoomId: number): void {
    this.roomId = newRoomId;
  }
}

// todo when a user creates/leaves/joins a room the users id needs to be set
