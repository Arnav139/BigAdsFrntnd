import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import { CalendarClock, Key, AlertCircle, Filter, Plus } from 'lucide-react';
import Card from '@/components/shared/Card';
import Button from '@/components/shared/Button';
import { getGames } from '@/lib/api';
import type { Game } from '@/types';
import { useAuthStore } from '@/store/auth';

interface GamesListProps {
  games: Game[];
  setGames: React.Dispatch<React.SetStateAction<Game[]>>;
  showFilters?: boolean;
  showGameSaAddress?: boolean;
}

const GamesList: React.FC<GamesListProps> = ({
  games,
  setGames,
  showFilters = true,
  showGameSaAddress = false,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await getGames();
        console.log(response, "get games response");
        const allGames: Game[] = (response.data as any[]).map(game => ({
          ...game,
          _id: game.id,
          Gamename: game.Gamename,
          Gametype: game.Gametype,
          gameToken: '',
          isApproved: true,
          events: game?.events || [],
        }));
        console.log('All Games:', allGames);
        setGames(allGames);
        setError(null);
      } catch (err) {
        setError('Failed to load games');
        console.error('Error fetching games:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGames();
  }, [setGames]);

  return (
    <div>
      {showFilters && (
        <div className="flex gap-2 mb-4 text-white">
          <Button
            size="sm"
            variant="primary"
            icon={Filter}
            color="white"
            disabled
          >
            All Games
          </Button>
        </div>
      )}

      {isLoading && <div className="text-center text-white">Loading games...</div>}

      {!isLoading && games.length === 0 && (
        <div className="text-center text-white">No games available.</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => (
          <Card key={game.gameId} className="flex flex-col">
            <div className="flex items-start justify-between p-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{game.Gamename}</h3>
                <p className="text-sm text-gray-500 mt-1">{game.Gametype}</p>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-300 text-black">
                {game.gameId}
              </span>
            </div>
            <div className='flex justify-between p-4 flex-direction-row'>
            <div>
              user count
            </div>
            <div>transaction count</div>
            </div>
            <div className="flex-1 p-4 pt-0">
              <p className="text-sm text-gray-600 mb-4">{game.description.slice(0,90)}......</p>
              {showGameSaAddress && (
                <div className="flex items-center text-sm text-gray-500">
                  <Key className="w-4 h-4 mr-1.5" />
                  <span className="font-mono text-xs">
                    {game.gameSaAddress?.slice(0, 8)}...{game.gameSaAddress?.slice(-6)}
                  </span>
                </div>
              )}
            </div>
            <div className="border-t border-gray-200 p-4">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">
                  Created {game.createdAt ? new Date(game.createdAt).toLocaleDateString() : 'Unknown'}
                </span>
                <Link to={`/games/${game.gameId}`}>
                  <Button size="sm" variant="outline2">
                    View Details
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GamesList;