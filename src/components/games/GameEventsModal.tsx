import React, { useState } from "react";
import { X, CalendarClock, AlertCircle } from "lucide-react";
import type { Game } from "@/types";
import Button from "../shared/Button";
import { toast } from "react-toastify"; // Import Toast
import { responseGameToken, sendEvents } from "@/lib/api"; // Import the new functions

interface GameEventsModalProps {
  isOpen: boolean;
  onClose: () => void;
  game: Game | null;
}

const GameEventsModal: React.FC<GameEventsModalProps> = ({
  isOpen,
  onClose,
  game,
}) => {
  const [loadingEvents, setLoadingEvents] = useState<{ [key: string]: boolean }>({});
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [deviceId, setDeviceId] = useState("");
  const [appId, setAppId] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [selectedGameId, setSelectedGameId] = useState<number | null>(null);

  // Function to handle the firing of the event
  const handleFireEvent = async (eventId: string, gameId: number) => {
    try {
      // Set loading state for the specific event
      setLoadingEvents((prev) => ({ ...prev, [eventId]: true }));

      const authStorage = localStorage.getItem("auth-storage");
      const wallet_address = authStorage ? JSON.parse(authStorage).state.userData.maAddress : null;
      const token = localStorage.getItem("bigads_token"); // User token

      if (!token) {
        setSelectedEventId(eventId);
        setSelectedGameId(gameId);
        setShowLoginModal(true);
        return;
      }

      const responseGameTokenData = await responseGameToken(gameId);
      const gameAuthorizationToken = responseGameTokenData.data.gameToken;
      if (!gameAuthorizationToken) {
        throw new Error("Game authorization token is missing");
      }
      const response = await sendEvents(eventId, gameId, wallet_address, gameAuthorizationToken, appId, deviceId);
      
      toast.success(response.message || "Event fired successfully!");
      setErrorMessage(null);
      onClose(); // Close modal on success
    } catch (error: any) {
      console.error("Error firing event:", error);
      const errorMessage = error?.response?.data?.message || "An error occurred while firing the event";
      const extractedMessage = errorMessage.match(/Your smart wallet does not have funds to send transaction/);
      toast.error(extractedMessage ? extractedMessage[0] : "An error occurred while firing the event");
      onClose();
    } finally {
      // Reset loading state for the specific event
      setLoadingEvents((prev) => ({ ...prev, [eventId]: false }));
    }
  };

  // Function to handle login and firing event
  const handleLoginAndFireEvent = async (appId: string, deviceId: string) => {
    if (!selectedEventId || !selectedGameId) {
      setErrorMessage("Missing event or game information");
      return;
    }

    try {
      let token = localStorage.getItem("bigads_token"); // User token
      if (!token) {
        token =
          "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjEzNCwicm9sZSI6ImFkbWluIiwidHlwZSI6ImFjY2VzcyIsImV4cCI6MTc0MDMzMjEwMX0.bq2LmNUJqGXL4T11HkkVyDu_hhJ0twDjNnhXVOzAXeM";
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
      setShowLoginModal(false); // Close modal
      setErrorMessage(null);
      setDeviceId(""); // Clear input fields
      setAppId("");
      onClose(); // Close main modal
    } catch (error: any) {
      console.error("Error firing event:", error);
      toast.error(
        error?.response?.data?.message ||
          "An error occurred while firing the event"
      );
    }
  };

  if (!isOpen || !game) return null;

  return (
    <>
      {/* Modal Overlay */}
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-4">
          <div className="flex justify-between items-center border-b pb-2">
            <h2 className="text-lg font-semibold">{game.name} Events</h2>
            <button onClick={onClose}>
              <X className="w-5 h-5 hover:text-red-500" />
            </button>
          </div>

          <div className="mt-4 space-y-4">
            {game.events && game.events.length > 0 ? (
              game.events.map((event) => (
                <div
                  key={event.eventId}
                  className="p-3 border rounded-lg flex items-start gap-3"
                >
                  <CalendarClock className="w-5 h-5 text-indigo-500 mt-1" />
                  <div>
                    <h4 className="font-medium">{event.eventType}</h4>
                    <p className="text-sm text-gray-500">
                      Event ID: {event.eventId}
                    </p>
                    <p className="text-sm text-gray-500">
                      Game ID: {event.gameId}
                    </p>
                    <p className="text-sm text-gray-500">
                      Created: {new Date(event.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleFireEvent(event.eventId, event.gameId)}
                    loading={loadingEvents[event.eventId] || false}
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

      {/* Login Modal */}
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
