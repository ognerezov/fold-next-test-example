import { LoginResponse } from '@/types';

const API_BASE_URL = 'http://localhost:3333';

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Access-Control-Allow-Origin': '*',
      "Access-Control-Allow-Headers": "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers",
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username: email, password }),
  });
  if (!response.ok) {
    throw new Error('Login failed');
  }
  const res = await response.json();
  return {
    token : res.token,
    user: {id: email, email: email}
  };
};

export const getMessages = async (userId: string, token: string): Promise<[]> => {
  const response = await fetch(`${API_BASE_URL}/user/${userId}/messages`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch messages');
  }

  return response.json();
}; 