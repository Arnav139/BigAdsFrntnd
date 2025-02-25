import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { registerUser, type RegisterUserResponse } from '@/lib/api';
import { toast } from 'react-toastify';
interface AuthState {
  address: string | null;
  isAuthenticated: boolean;
  isConnecting: boolean;
  userData: RegisterUserResponse['data'] | null;
  user: {
    role: string;
    id: number;
    // ... other user properties
  } | null;
  connectMetaMask: () => Promise<void>;
  connectDiamante: () => Promise<void>;
  disconnect: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      address: null,
      isAuthenticated: false,
      isConnecting: false,
      userData: null,
      user: null,

      connectMetaMask: async () => {
        if (typeof window.ethereum === 'undefined') {
          throw new Error('MetaMask is not installed');
        }

        try {
          set({ isConnecting: true });
          const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts',
          });
          // console.log(window.ethereum, "metamask window")
          // console.log(accounts[0], "metamask accounts address");
          if (accounts[0]) {
            // Register user with the API
            const appId = `app_${uuidv4().slice(0, 8)}`;
            const deviceId = `device_${uuidv4().slice(0, 8)}`;
            const maAddress = accounts[0].toLowerCase(); // Convert to lowercase for consistency
            
            const userData = await registerUser(appId, deviceId, maAddress);
            
            set({
              address: maAddress,
              isAuthenticated: true,
              userData: userData.data,
              isConnecting: false,
            });
            toast.success("Connected to MetaMask wallet");
          }
        } catch (error) {
          console.error('Failed to connect wallet:', error);
          set({ isConnecting: false });
          throw error;
        }
      },

      connectDiamante: async () => {
        if (typeof window.diam === 'undefined') {
          throw new Error('Diamante Wallet is not installed');
        }

        try {
          set({ isConnecting: true });
          const accounts = await window.diam.connect();
          // console.log(accounts.message.data[0].diamPublicKey, "diamante wallet address");
          if (accounts.message.data[0].diamPublicKey) {
            // Register user with the API
            const appId = `app_${uuidv4().slice(0, 8)}`;
            const deviceId = `device_${uuidv4().slice(0, 8)}`;
            const maAddress = accounts.message.data[0].diamPublicKey.toLowerCase(); // Convert to lowercase for consistency
            
            const userData = await registerUser(appId, deviceId, maAddress);
            
            set({
              address: maAddress,
              isAuthenticated: true,
              userData: userData.data,
              isConnecting: false,
            });
            toast.success("Connected to Diamante wallet");
          }
        } catch (error) {
          console.error('Failed to connect Diamante wallet:', error);
          set({ isConnecting: false });
          throw error;
        }
      },

      disconnect: () => {
        set({
          address: null,
          userData: null,
          isAuthenticated: false,
        });
        toast.warn("Disconnected from wallet");
        localStorage.removeItem('bigads_token');
        localStorage.removeItem('ma_address'); // Also remove ma_address on disconnect
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
