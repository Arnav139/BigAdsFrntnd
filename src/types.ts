declare global {
  interface Window {
    diam: {
      connect: () => Promise<{
        message: {
          data: [{
            diamPublicKey: string;
          }];
        };
      }>;
    };
  }
}

export interface GameEvent {
  id: number;
  eventId: string;
  gameId: number;
  eventType: string;
  createdAt: string;
}

export interface Game {
  id: number;
  _id: number;
  createrId: number;
  gameId: string;
  gameToken: string;
  gameSaAddress: string;
  name: string;
  type: string;
  description: string;
  isApproved: boolean;
  createdAt: string;
  events: GameEvent[];
  
}

export interface GameResponse {
  id: number;
  createrId: number;
  gameId: string;
  gameSaAddress: string;
  name: string;
  type: string;
  description: string;
  createdAt: string;
} 