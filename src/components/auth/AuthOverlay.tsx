import React, { useState } from 'react';
import { Wallet } from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import Button from '@/components/shared/Button';

const AuthOverlay: React.FC = () => {
  const { connectMetaMask, connectDiamante } = useAuthStore();
  const [isMetaMaskConnecting, setMetaMaskConnecting] = useState(false);
  const [isDiamanteConnecting, setDiamanteConnecting] = useState(false);

  const handleConnectMetaMask = async () => {
    setMetaMaskConnecting(true);
    try {
      await connectMetaMask();
    } catch (error) {
      console.error('MetaMask connection error:', error);
    } finally {
      setMetaMaskConnecting(false);
    }
  };

  const handleConnectDiamante = async () => {
    setDiamanteConnecting(true);
    try {
      await connectDiamante();
    } catch (error) {
      console.error('Diamante wallet connection error:', error);
    } finally {
      setDiamanteConnecting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Wallet className="w-8 h-8 text-indigo-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Connect Your Wallet</h2>
          <p className="text-gray-600 mb-6">
            Please connect your wallet to access the dashboard and manage your games.
          </p>
          <Button
            onClick={handleConnectMetaMask}
            loading={isMetaMaskConnecting}
            disabled={isDiamanteConnecting}
            className="w-full justify-center mb-2"
          >
            Connect MetaMask
          </Button>
          <Button
            onClick={handleConnectDiamante}
            loading={isDiamanteConnecting}
            disabled={isMetaMaskConnecting}
            className="w-full justify-center"
          >
            Connect Diamante Wallet
          </Button>
          {typeof window.ethereum === 'undefined' && (
            <p className="mt-4 text-sm text-red-600">
              MetaMask is not installed.{' '}
              <a
                href="https://metamask.io/download/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium underline"
              >
                Install MetaMask
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthOverlay;
