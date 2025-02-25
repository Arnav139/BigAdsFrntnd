import React, { useEffect, useState } from 'react';
import { CalendarClock, Key, AlertCircle, Filter, Plus } from 'lucide-react';
import Card from '@/components/shared/Card';
import Button from '@/components/shared/Button';
import { getGames } from '@/lib/api';
import GameEventsModal from './GameEventsModal';
import type { Game } from '@/types';
import { useAuthStore } from '@/store/auth';
interface GamesListProps {
  games: Game[];
  setGames: React.Dispatch<React.SetStateAction<Game[]>>;
  showFilters?: boolean;
  forceMyGames?: boolean;
  showEvents?: boolean;
}

const GamesList: React.FC<GamesListProps> = ({ 
  games, 
  setGames, 
  showFilters = true,
  forceMyGames = false 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'mine'>(forceMyGames ? 'mine' : 'all');
  const [error, setError] = useState<string | null>(null);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isAuthenticated } = useAuthStore();
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await getGames();
        const allGames: Game[] = (response.data as Game[]).map(game=> ({
          ...game,
          _id: game.id,
          gameToken: '',
          isApproved: true,
          events: game?.events  || []
        }));

        const authData = localStorage.getItem('auth-storage');
        const userId = authData ? JSON.parse(authData)?.state?.userData?.id?.toString() : null;
        const walletAddress = authData ? JSON.parse(authData)?.state?.userData?.maAddress : null;

        const filteredGames = filter === 'all'
          ? allGames
          : allGames.filter(game => game.createrId?.toString() === userId);

        const finalFilteredGames = walletAddress?.startsWith('0x')
          ? filteredGames.filter(game => game.gameSaAddress.startsWith('0x'))
          : filteredGames.filter(game => !game.gameSaAddress.startsWith('0x'));

        setGames(finalFilteredGames);
        setError(null);
      } catch (err) {
        setError('Failed to load games');
        console.error('Error fetching games:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGames();
  }, [isAuthenticated, filter, setGames]);

  const openModal = (game: Game) => {
    setSelectedGame(game);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedGame(null);
    setIsModalOpen(false);
  };

  return (
    <div>
      {showFilters && (
        <div className="flex gap-2 mb-4">
          <Button
            size="sm"
            variant={filter === 'all' ? 'primary' : 'outline'}
            onClick={() => setFilter('all')}
            icon={Filter}
          >
            All Games
          </Button>
          <Button
            size="sm"
            variant={filter === 'mine' ? 'primary' : 'outline'}
            onClick={() => setFilter('mine')}
            icon={Filter}
          >
            My Games
          </Button>
        </div>
      )}

      {filter === 'mine' && games.length === 0 && (
        <div className="text-center text-gray-500">
          You have not created any games.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => (
          <Card key={game._id} className="flex flex-col">
            <div className="flex items-start justify-between p-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{game.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{game.type}</p>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                {game.gameId}
              </span>
            </div>
            <div className="flex-1 p-4 pt-0">
              <p className="text-sm text-gray-600 mb-4">{game.description}</p>
              <div className="flex items-center text-sm text-gray-500">
                <Key className="w-4 h-4 mr-1.5" />
                <span className="font-mono text-xs">
                  {game.gameSaAddress.slice(0, 8)}...{game.gameSaAddress.slice(-6)}
                </span>
              </div>
            </div>
            <div className="border-t border-gray-200 p-4">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">
                  Created {new Date(game.createdAt).toLocaleDateString()}
                </span>
                <Button size="sm" variant="outline" onClick={() => openModal(game)}>
                  View Details
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Game Events Modal */}
      <GameEventsModal isOpen={isModalOpen} onClose={closeModal} game={selectedGame} />
    </div>
  );
};

export default GamesList;
