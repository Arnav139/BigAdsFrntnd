import React from 'react';
import GamesList from '../games/GamesList';
import { useState } from 'react';
import type { Game } from '@/types';
// import Button from '@/components/shared/Button';
// import { Plus } from 'lucide-react';
// import RegisterGameModal from '../games/RegisterGameModal';

const Games = () => {
  const [games, setGames] = useState<Game[]>([]);
  // const [showRegisterModal, setShowRegisterModal] = useState(false);

  // const handleAddGame = (game: Game) => {
  //   setGames([...games, game]);
  // };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">My Games</h1>
        {/* <Button icon={Plus} onClick={() => setShowRegisterModal(true)}>
          Register New Game
        </Button> */}
      </div>
      <GamesList 
        games={games} 
        setGames={setGames} 
        showFilters={false} 
        forceMyGames={true} 
        showEvents={true} 
      />
      
      {/* <RegisterGameModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSuccess={() => {}}
        handleAddGame={handleAddGame}
      /> */}
    </div>
  );
};

export default Games; 