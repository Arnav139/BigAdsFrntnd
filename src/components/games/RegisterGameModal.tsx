import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import Button from '@/components/shared/Button';
import { registerGame, type GameEvent, type ApiError, requestCreator, getCreatorRequestStatus } from '@/lib/api';
import { toast } from 'react-toastify';
import { Game } from '@/types';

interface RegisterGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: any) => void;
  handleAddGame: (game: Game) => void;
}

const RegisterGameModal: React.FC<RegisterGameModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  handleAddGame
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRequestPending, setIsRequestPending] = useState(false);
  const [creatorStatus, setCreatorStatus] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    description: '',
  });
  const [events, setEvents] = useState<GameEvent[]>([{ eventType: '' }]);
  const [error, setError] = useState<ApiError | null>(null);
  
  const authData = JSON.parse(localStorage.getItem('auth-storage') || '{}');
  const userData = authData?.state?.userData || {};
  const { role, maAddress, id } = userData;

  useEffect(() => {
    const checkRequestStatus = async () => {
      if (role === 'user' && id) {
        try {
          const response = await getCreatorRequestStatus(id);
          setIsRequestPending(response.data.status === 'pending');
          setCreatorStatus(response.data.status);
        } catch (error) {
          console.error('Error checking creator request status:', error);
        }
      }
    };

    if (isOpen) {
      checkRequestStatus();
    }
  }, [isOpen, role, id]);

  const handleCreatorRequest = async () => {
    try {
      await requestCreator(maAddress, role, id);
      setIsRequestPending(true);
      setCreatorStatus('pending');
      toast.success('Your request to become a creator has been sent successfully!');
    } catch (error) {
      if ((error as ApiError).message) {
        toast.error((error as ApiError).message);
      } else {
        toast.error('Failed to submit creator request');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    const authStorage = localStorage.getItem("auth-storage");
    const wallet_address = authStorage ? JSON.parse(authStorage).state.userData.maAddress : null;
    
    try {
      const response = await registerGame({
        ...formData,
        events: events.filter(event => event.eventType.trim() !== ''),
        wallet_address
      });
  
      onSuccess(response.data);
      handleAddGame({
        ...response.data.game,
        _id: response.data.game.id,
        gameToken: response.data.Gametoken || '',
        isApproved: false,
        events: response.data.events.map((event, index) => ({
          ...event,
          id: index + 1,
          createdAt: new Date().toISOString()
        }))
      });

      toast.success(response.message || "Game registered successfully!");
      
      setFormData({
        name: '',
        type: '',
        description: '',
      });
      setEvents([{ eventType: '' }]);
      
      onClose();
    } catch (err) {
      setError(err as ApiError);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAddEvent = () => {
    if (events.length >= 4) {
      toast.error('You can only add up to 4 events.');
      return;
    }
    setEvents([...events, { eventType: '' }]);
  };

  const handleRemoveEvent = (index: number) => {
    setEvents(events.filter((_, i) => i !== index));
  };

  const handleEventChange = (index: number, value: string) => {
    const newEvents = [...events];
    newEvents[index] = { eventType: value };
    setEvents(newEvents);
  };

  if (!isOpen) return null;

  if (role === 'creator' || creatorStatus === 'fulfilled' || role === 'admin') {
    return (
      <div className="fixed inset-0  bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Register New Game</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Scrollable container for form content */}
            <div className={`space-y-4 p-2 ${events.length > 1 ? 'max-h-[60vh] overflow-y-auto no-scrollbar' : ''}`}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Game Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block p-2 w-full bg-gray-200 h-10 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                  placeholder="Game Name"
                />
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                  Game Type
                </label>
                <input
                  type="text"
                  id="type"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="mt-1 block p-2 w-full bg-gray-200 h-10 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                  placeholder="Game Type"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="mt-1 block p-2 w-full bg-gray-200 h-40 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                  placeholder="Game Description"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Game Events
                  </label>
                  <Button
                    type="button"
                    variant="outline2"
                    size="sm"
                    icon={Plus}
                    onClick={handleAddEvent}
                  >
                    Add Event
                  </Button>
                </div>
                <div className="space-y-2">
                  {events.map((event, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={event.eventType}
                        onChange={(e) => handleEventChange(index, e.target.value)}
                        placeholder="Event Type"
                        className="mt-1 block p-2 w-full h-10 bg-gray-200 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        required
                      />
                      {events.length > 1 && (
                        <Button
                          type="button"
                          variant="outline2"
                          size="sm"
                          onClick={() => handleRemoveEvent(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {error && (
              <div className="text-sm bg-red-50 border border-red-200 rounded-md p-3">
                <h4 className="font-medium text-red-800">{error.error}</h4>
                <p className="mt-1 text-red-600">{error.message}</p>
                {error.details && (
                  <p className="mt-1 text-xs text-red-500">{error.details}</p>
                )}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="outline2"
                loading={isLoading}
              >
                Register Game
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Creator Access Required</h2>
        <p className="text-gray-600 mb-6">
          {isRequestPending 
            ? 'Your creator request is pending approval. Please wait.'
            : 'You need to be an approved creator to register new games.'}
        </p>
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline2"
            onClick={onClose}
          >
            Close
          </Button>
          {!isRequestPending && (
            <Button
              type="button"
              variant="outline2"
              onClick={handleCreatorRequest}
            >
              Apply to Become Creator
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterGameModal;