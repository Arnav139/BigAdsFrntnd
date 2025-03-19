import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


export const isTokenExpired = (token: string | null): boolean => {
  if (!token) return true;
  
  try {
    const tokenData = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return tokenData.exp < currentTime;
  } catch (error) {
    console.error('Error parsing token:', error);
    return true; // Consider token invalid if we can't parse it
  }
};