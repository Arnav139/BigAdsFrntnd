import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import DashboardLayout from "./components/layout/DashboardLayout";
import Card from "./components/shared/Card";
import Button from "./components/shared/Button";
import AuthOverlay from "./components/auth/AuthOverlay";
import GamesList from "./components/games/GamesList";
import RegisterGameModal from "./components/games/RegisterGameModal";
import { useAuthStore } from "./store/auth";
import { Plus, ArrowRight, Key } from "lucide-react";
import { requestCreator, getCreatorRequestStatus } from "./lib/api";
import { Game } from "./types";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PendingRequests from "./components/pages/PendingRequests";
import Analytics from "./components/pages/Analytics";
import Games from './components/pages/Games';
import { ToastContainer } from "react-toastify";
import { isTokenExpired } from "./lib/utils";

function App() {
  const [games, setGames] = useState<Game[]>([]);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [isRequestPending, setIsRequestPending] = useState(false);
  const [creatorStatus, setCreatorStatus] = useState<string | null>(null);
  const { isAuthenticated, disconnect } = useAuthStore();

  // Get user role from localStorage
  const authData = JSON.parse(localStorage.getItem("auth-storage") || "{}");
  const userData = authData?.state?.userData || {};
  const { role: userRole, maAddress, id, status } = userData;

  useEffect(() => {
    if (!isAuthenticated) return;

    const checkToken = () => {
      const token = localStorage.getItem('bigads_token');
      if (token && isTokenExpired(token)) {
        disconnect();
        localStorage.removeItem('bigads_token');
        toast.error('Your session has expired. Please log in again.');
      }
    };

    checkToken();
    const interval = setInterval(checkToken, 60000);
    return () => clearInterval(interval);
  }, [isAuthenticated, disconnect]);
 
  // Check creator request status on component mount
  useEffect(() => {
    const checkCreatorStatus = async () => {
      if (isAuthenticated && userRole === "user") {
        try {
          const response = await getCreatorRequestStatus(id);
          setCreatorStatus(response.data.status);
          setIsRequestPending(response.data.status === "pending");
        } catch (error) {
          console.error("Failed to fetch creator request status:", error);
        }
      }
    };

    checkCreatorStatus();
  }, [isAuthenticated, userRole, id]);

  const handleAddGame = (game: Game) => {
    setGames([...games, game]);
  };

  const handleGameRegistered = (data: any) => {
    // console.log("Game registered:", data);
    // TODO: Update games list
  };

  const handleCreatorRequest = async () => {
    try {
      // Send the creator request
      await requestCreator(maAddress, userRole, id);
      setIsRequestPending(true);
      setCreatorStatus("pending");
      toast.success(
        "Your request to become a creator has been sent successfully!"
      );

      // Refetch the creator request status after sending the request
      const response = await getCreatorRequestStatus(id);
      setCreatorStatus(response.data.status);
      setIsRequestPending(response.data.status === "pending");
    } catch (error) {
      toast.error("Failed to submit creator request. Please try again.");
    }
  };

  const ActionButton = () => {
    if (!isAuthenticated) return null;

    if (userRole === "user") {
      if (isRequestPending || creatorStatus === "pending") {
        return (
          <Button icon={Key} disabled variant="outline3" className="border-white border-2">
            Creator Request Pending
          </Button>
        );
      }
      if (creatorStatus === "rejected") {
        return (
          <Button icon={Key} disabled variant="outline3">
            Creator Request Rejected
          </Button>
        );
      }
      return (
        <Button icon={Key} onClick={handleCreatorRequest} variant="outline3">
          Apply to Become Creator
        </Button>
      );
    }

    // Only show Register New Game button if userRole is creator and creatorStatus is fulfilled
    if (userRole === "creator" || userRole === "admin") {
      return (
        <Button icon={Plus} onClick={() => setShowRegisterModal(true)} variant="outline2">
          Register New Game
        </Button>
      );
    }

    return null;
  };

  return (
    <>
    <ToastContainer />
    <BrowserRouter>
      <DashboardLayout>
        {!isAuthenticated && <AuthOverlay />}
        <Routes>
          <Route
            path="/"
            element={
              <div className="space-y-6">
                <div className="flex justify-between items-center sm:flex-row flex-col gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-white ">
                      Welcome to Bigads
                    </h1>
                    <p className="mt-1 text-sm text-white">
                      Manage your games, events, and API integrations all in one
                      place.
                    </p>
                  </div>
                  <ActionButton />
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  <Card title="Quick Start">
                    <div className="space-y-4">
                      <p className="text-sm text-gray-600">
                        New to Bigads? Follow our quick start guide to get your
                        first game integrated.
                      </p>
                      <Button
                        variant="outline2"
                        icon={ArrowRight}
                        className="w-full"
                        onClick={() =>
                          window.open(
                            "https://bigads-efwrc.ondigitalocean.app/api-docs",
                            "_blank"
                          )
                        }
                      >
                        View Guide
                      </Button>
                    </div>
                  </Card>

                  <Card title="Recent Events">
                    <div className="space-y-4">
                      <p className="text-sm text-gray-600">
                        No events recorded yet. Create your first game to start
                        tracking events.
                      </p>
                    </div>
                  </Card>

                  <Card title="API Status">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <div className="h-2.5 w-2.5 rounded-full bg-green-500"></div>
                        <span className="text-sm font-medium text-gray-900">
                          {(isAuthenticated && maAddress.startsWith("0x"))
                            ? "Connected to MetaMask"
                            : "Connected to Diamente"}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {isAuthenticated
                          ? "Your wallet is connected and ready to interact with the platform."
                          : "Please connect your wallet to access the platform features."}
                      </p>
                    </div>
                  </Card>
                </div>
                <div className="mt-8">
                  <h2 className="text-lg font-bold text-white mb-4">
                    Games
                  </h2>
                  <GamesList games={games} setGames={setGames} />
                </div>
               
              </div>
            }
          />

          {/* Add Analytics route */}
          <Route path="/dashboard/analytics" element={<Analytics />} />

          {/* Add conditional route for admin */}
          {userRole === "admin" && (
            <>
            <Route
              path="/dashboard/pending-requests"
              element={<PendingRequests />}
            />
            <Route path="/dashboard/analytics" element={<Analytics />} />
            </>
          )}

          <Route path="/dashboard/games" element={<Games />} />

          {/* Catch-all route to redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <RegisterGameModal
          isOpen={showRegisterModal}
          onClose={() => setShowRegisterModal(false)}
          onSuccess={handleGameRegistered}
          handleAddGame={handleAddGame}
        />
      </DashboardLayout>
    </BrowserRouter>
    </>
  );
}

export default App;