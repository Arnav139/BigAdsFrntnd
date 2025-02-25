import axios from 'axios';

const API_BASE_URL = 'https://data-center-7yhai.ondigitalocean.app';
// const API_BASE_URL = 'http://localhost:8008';
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('bigads_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface RegisterUserResponse {
  message: string;
  data: {
    userId: string;
    appId: string;
    deviceId: string;
    saAddress: string;
    role: string;
  };
  token: string;
}

export interface GameEvent {
  eventType: string;
}

export interface RegisterGameRequest {
  name: string;
  type: string;
  description: string;
  events: GameEvent[];
  wallet_address: string;
}

export interface CreatorRequest {
  id: number;
  userId: string;
  maAddress: string;
  role: string;
  status: string;
}

export interface RegisterGameResponse {
  message: string;
  data: {
    game: {
      id: number;
      createrId: number;
      gameId: string;
      gameSaAddress: string;
      name: string;
      type: string;
      description: string;
      createdAt: string;
    };
    events: {
      gameId: number;
      eventId: string;
      eventType: string;
    }[];
    Gametoken: string;
  };
}

export interface ApiError {
  error: string;
  message?: string;
  details?: string;
}

export interface RequestCreatorResponse {
  message: string;
  data: {
    id: number;
    userId: string;
    maAddress: string;
    role: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface ResponseGameTokenResponse {
  data: {
    gameToken: string;
  };
}

export const responseGameToken = async (gameId: number): Promise<ResponseGameTokenResponse> => {
  const response = await api.post<ResponseGameTokenResponse>('/creator/gameToken', { gameId });
  return response.data;
};

export const sendEvents = async (eventId: string, gameId: number, wallet_address: string, gameAuthorizationToken: string, appId: string, deviceId: string) => {

   const token = localStorage.getItem('bigads_token');
  const response = await api.post('/creator/sendEvents', {
    eventId,
    gameId,
    wallet_address,
    appId,
    deviceId,
  },{
    headers:{
      Authorization: `Bearer ${token}`,
      game_authorization_token: gameAuthorizationToken
    }
  });
  return response.data;
};

export const requestCreator = async (maAddress: string, userRole: string, id: number) => {
  try {
    const response = await api.post<RequestCreatorResponse>('/user/requestCreator', {
      maAddress,
      userRole,
      id,
    });
    // console.log(response.data, "request creator response")
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data as ApiError;
    }
    throw error;
  }
};

export const registerUser = async (appId: string, deviceId: string, maAddress: string) => {
  try {
    const response = await api.post<RegisterUserResponse>('/user/registerUser', {
      appId,
      deviceId,
      maAddress,
    });
    // Store the token
    if (response.data.token) {
      localStorage.setItem('bigads_token', response.data.token);
    }
    // console.log(response.data, "register user response")
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data as ApiError;
    }
    throw error;
  }
};

export const registerGame = async (data: RegisterGameRequest) => {
  try {
    const token = localStorage.getItem('bigads_token');
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response = await api.post<RegisterGameResponse>('/user/registerGame', data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const apiError = error.response.data as ApiError;
      throw {
        error: apiError.error || 'Failed to register game',
        message: apiError.message || error.response.statusText,
        details: apiError.details || `Status: ${error.response.status}`
      };
    }
    if (error instanceof Error) {
      throw {
        error: 'Registration Error',
        message: error.message,
        details: 'Please check your connection and try again'
      };
    }
    throw error;
  }
};

export const getGames = async (filter: 'all' | 'mine' = 'all') => {
  try {
    const endpoint = filter === 'all' ? '/user/games' : '/user/my-games';
    const response = await api.get<{ data: RegisterGameResponse['data']['game'][] }>(endpoint);
    // console.log(response.data, "get games response")  
    return response.data;

  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data as ApiError;
    }
    throw error;
  }
};

export const getCreatorRequestStatus = async (userId: number) => {
  try {
    const response = await api.get(`/user/creator-request-status/${userId}`);
    // console.log(response.data, "get creator request status response")
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data as ApiError;
    }
    throw error;
  }
};

export const approveCreatorRequest = async (maAddress: string, responseType: 'Approve' | 'Reject') => {
  try {
    const response = await api.patch(`/user/creator-requests/${maAddress}/approve`, { responseType });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data as ApiError;
    }
    throw error;
  }
};

export const getPendingRequests = async () => {
  try {
    const response = await api.get<{ data: CreatorRequest[] }>('/user/getPendingRequests');
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data as ApiError;
    }
    throw error;
  }
};

export default api;