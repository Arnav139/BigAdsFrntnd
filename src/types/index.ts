export interface User {
  userId: string;
  appId: string;
  deviceId: string;
  saAddress: string;
}

export interface Game {
  id: number;
  createrId: number;
  gameId: string;
  gameSaAddress: string;
  name: string;
  type: string;
  description: string;
  createdAt: string;
}

export interface Event {
  gameId: number;
  eventId: string;
  eventType: string;
}

export interface Transaction {
  transactionHash: string;
  event: {
    eventType: string;
    eventId: string;
  };
  toUser: {
    userId: string;
  };
  game: {
    name: string;
    type: string;
    gameId: string;
  };
}

export interface ApiResponse<T> {
  status: boolean;
  message: string;
  data?: T;
  error?: string;
}