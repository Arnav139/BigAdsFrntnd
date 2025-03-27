import React, { useState } from "react";
import { X, CalendarClock, AlertCircle } from "lucide-react";
import type { Game } from "@/types";
import Button from "../shared/Button";
import { toast } from "react-toastify";
import { responseGameToken, sendEvents } from "@/lib/api";

interface GameEventsModalProps {
  isOpen: boolean;
  onClose: () => void;
  game: Game | null;
  events: any[]; // Add events prop to receive fetched events
}

const GameEventsModal: React.FC<GameEventsModalProps> = ({
  isOpen,
  onClose,
  game,
  events,
}) => {
  const [loadingEvents, setLoadingEvents] = useState<{ [key: string]: boolean }>({});
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [deviceId, setDeviceId] = useState("");
  const [appId, setAppId] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [selectedGameId, setSelectedGameId] = useState<number | null>(null);
  const [activeEventId, setActiveEventId] = useState<string | null>(null);

  const handleFireEvent = async (eventId: string, gameId: string) => {
    try {
      setActiveEventId(eventId);
      setLoadingEvents((prev) => ({ ...prev, [eventId]: true }));

      const authStorage = localStorage.getItem("auth-storage");
      const wallet_address = authStorage ? JSON.parse(authStorage).state.userData.maAddress : null;
      const token = localStorage.getItem("bigads_token");

      if (!token) {
        setSelectedEventId(eventId);
        setSelectedGameId(game?._id || null); // Use game._id if available
        setShowLoginModal(true);
        return;
      }

      const responseGameTokenData = await responseGameToken(game?._id || 0); // Adjust to use game ID
      const gameAuthorizationToken = responseGameTokenData.data.gameToken;
      if (!gameAuthorizationToken) {
        throw new Error("Game authorization token is missing");
      }
      const response = await sendEvents(eventId, game?._id || 0, wallet_address, gameAuthorizationToken, appId, deviceId);

      toast.success(response.message || "Event fired successfully!");
      setErrorMessage(null);
      onClose();
    } catch (error: any) {
      console.error("Error firing event:", error);
      const errorMessage = error?.response?.data?.message || "An error occurred while firing the event";
      const extractedMessage = errorMessage.match(/Your smart wallet does not have funds to send transaction/);
      toast.error(extractedMessage ? extractedMessage[0] : "An error occurred while firing the event");
      onClose();
    } finally {
      setLoadingEvents((prev) => ({ ...prev, [eventId]: false }));
      setActiveEventId(null);
    }
  };

  const handleLoginAndFireEvent = async (appId: string, deviceId: string) => {
    if (!selectedEventId || !selectedGameId) {
      setErrorMessage("Missing event or game information");
      return;
    }

    try {
      let token = localStorage.getItem("bigads_token");
      if (!token) {
        token = "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjEzNCwicm9sZSI6ImFkbWluIiwidHlwZSI6ImFjY2VzcyIsImV4cCI6MTc0MDMzMjEwMX0.bq2LmNUJqGXL4T11HkkVyDu_hhJ0twDjNnhXVOzAXeM";
      }

      const responseGameTokenData = await responseGameToken(selectedGameId);
      const gameAuthorizationToken = responseGameTokenData.data.gameToken;
      if (!gameAuthorizationToken) {
        throw new Error("Game authorization token is missing");
      }

      const authStorage = localStorage.getItem("auth-storage");
      const wallet_address = authStorage ? JSON.parse(authStorage).state.userData.maAddress : null;

      const response = await sendEvents(selectedEventId, selectedGameId, wallet_address, gameAuthorizationToken, appId, deviceId);

      toast.success(response.data.message || "Event fired successfully!");
      setShowLoginModal(false);
      setErrorMessage(null);
      setDeviceId("");
      setAppId("");
      onClose();
    } catch (error: any) {
      console.error("Error firing event:", error);
      toast.error(error?.response?.data?.message || "An error occurred while firing the event");
    }
  };

  if (!isOpen || !game) return null;

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-4">
          <div className="flex justify-between items-center border-b pb-2">
            <h2 className="text-lg font-semibold">{game.Gamename} Events</h2>
            <button onClick={onClose}>
              <X className="w-5 h-5 hover:text-red-500" />
            </button>
          </div>

          <div className="mt-4 space-y-4">
            {events && events.length > 0 ? (
              events.map((event) => (
                <div
                  key={event.eventId}
                  className="p-3 border rounded-lg flex items-start gap-3"
                >
                  <CalendarClock className="w-5 h-5 text-indigo-500 mt-1" />
                  <div>
                    <h4 className="font-medium">{event.eventType}</h4>
                    <p className="text-sm text-gray-500">Event ID: {event.eventId}</p>
                    <p className="text-sm text-gray-500">Description: {event.eventdescription}</p>
                    {/* No createdAt in getEvents response, remove or adjust if added later */}
                  </div>
                  <Button
                    variant="outline2"
                    size="sm"
                    onClick={() => handleFireEvent(event.eventId, event.game.gameId)}
                    loading={loadingEvents[event.eventId] || false}
                    disabled={activeEventId !== null && activeEventId !== event.eventId}
                  >
                    Fire Event
                  </Button>
                </div>
              ))
            ) : (
              <div className="flex items-center gap-2 text-gray-500">
                <AlertCircle className="w-5 h-5" />
                <p className="text-sm">No events available for this game.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showLoginModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Enter Details</h2>
              <button onClick={() => setShowLoginModal(false)}>
                <X className="w-5 h-5 hover:text-red-500" />
              </button>
            </div>
            <div className="mt-4 space-y-4">
              <input
                type="text"
                placeholder="Enter Device ID"
                value={deviceId}
                onChange={(e) => setDeviceId(e.target.value)}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Enter App ID"
                value={appId}
                onChange={(e) => setAppId(e.target.value)}
                className="w-full p-2 border rounded"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleLoginAndFireEvent(appId, deviceId)}
              >
                Fire Event
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GameEventsModal;