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

export interface Game {
  _id?: number;           // Mapped from id
  id?: number;            // From getGames response
  creatorId?: number;     // From getGames
  gameId: string;
  gameSaAddress?: string; // From getGames
  walletAddress?: string; // From getGames
  Gamename: string;       // From getGames/getEvents
  Gametype: string;       // From getGames/getEvents
  description: string;
  createdAt?: string;     // From getGames
  gameToken?: string;     // Optional, hardcoded in frontend
  isApproved?: boolean;   // Optional, hardcoded in frontend
  events?: GameEvent[];   // Populated from getEvents
  usersPlayed : number;
  transactionCount: number
}

export interface GameEvent {
  eventId: string;
  eventType: string;
  eventdescription: string;
  game: {
    gameId: string;
    Gamename: string;
    Gametype: string;
    description: string;
  };
}

export interface Event {
  eventId: string;
  eventType: string;
  eventdescription: string;
  game: {
    gameId: string;
    Gamename: string;
    Gametype: string;
    description: string;
  };
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