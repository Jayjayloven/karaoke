export class User {
  constructor(
    private readonly userId: string,
    private username: string,
    private roomId: string | null,
  ) {}

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
}
