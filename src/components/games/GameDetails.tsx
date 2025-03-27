import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getEvents, getTransactionByEventId } from '@/lib/api';
import Card from '@/components/shared/Card';
import Button from '@/components/shared/Button';
import { GameEvent } from '@/types';

// export interface GameEvent {
//   eventId: string;
//   eventType: string;
//   eventdescription: string;
//   game: {
//     gameId: string;
//     Gamename: string;
//     Gametype: string;
//     description: string;
//   };
// }

interface Transaction {
  transactionHash: string;
  transactionChain: string;
  amount: string;
  createdAt: string;
}

const GameDetails: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const [gameEvents, setGameEvents] = useState<GameEvent[]>([]);
  const [gameInfo, setGameInfo] = useState<GameEvent['game'] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await getEvents();
        const eventsForGame : GameEvent[]  = response.filter(
          (event:GameEvent[]) => event.game.gameId === gameId
        );

        if (eventsForGame.length > 0) {
          setGameInfo(eventsForGame[0].game);
          setGameEvents(eventsForGame);
        } else {
          setGameInfo(null);
        }
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events');
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, [gameId]);

  const handleSeeTransactions = async (eventId: string) => {
    try {
      const response = await getTransactionByEventId(eventId);
      setTransactions(response.transactions[0].transactions);
      setShowModal(true);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError('Failed to fetch transactions');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setTransactions([]);
  };

  if (isLoading) return <div className="text-center text-white">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">
            {gameInfo ? gameInfo.Gamename : 'Game Details'} ({gameId})
          </h1>
          {gameInfo && <p className="text-gray-400 text-md">{gameInfo.Gametype}</p>}
        </div>
        <Link to="/games">
          <Button variant="outline">Back to Games</Button>
        </Link>
      </div>

      {gameInfo ? (
        <div className="mb-8 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-white mb-2">Description</h2>
          <p className="text-gray-300">{gameInfo.description}</p>
        </div>
      ) : (
        <p className="text-white text-lg">No game information available.</p>
      )}

      <h2 className="text-2xl font-semibold text-white mb-4">Events</h2>
      {gameEvents.length === 0 ? (
        <p className="text-white text-lg">No events found for this game.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gameEvents.map((event: GameEvent) => (
            <Card key={event.eventId} className="p-5 bg-gray-200 text-black shadow-lg rounded-lg">
              <h3 className="text-xl font-medium">{event.eventType}</h3>
              <p className="text-black mb-3">{event.eventdescription}</p>
              <div className="border-t border-gray-700 my-3"></div>
              <Button onClick={() => handleSeeTransactions(event.eventId)} variant="secondary">
                See Transactions
              </Button>
            </Card>
          ))}
        </div>
      )}

      {/* Modal for Transactions */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-7xl h-[90vh] p-6 rounded-lg relative overflow-hidden">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-2xl font-bold text-black hover:text-red-500"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold mb-4">Transaction Details</h2>
            <div className="overflow-auto h-[calc(90vh-100px)]">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-gray-100">
                  <tr>
                    <th className="p-3 border-b font-semibold">S.No</th>
                    <th className="p-3 border-b font-semibold">Transaction Hash</th>
                    <th className="p-3 border-b font-semibold">Chain</th>
                    <th className="p-3 border-b font-semibold">Amount</th>
                    <th className="p-3 border-b font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx, index) => (
                    <tr key={tx.transactionHash} className="hover:bg-gray-50">
                      <td className="p-3 border-b">{index + 1}</td>
                      <td className="p-3 border-b font-mono text-sm break-all">
                        {tx.transactionHash}
                      </td>
                      <td className="p-3 border-b">{tx.transactionChain}</td>
                      <td className="p-3 border-b">{tx.amount}</td>
                      <td className="p-3 border-b">
                        {new Date(tx.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameDetails;