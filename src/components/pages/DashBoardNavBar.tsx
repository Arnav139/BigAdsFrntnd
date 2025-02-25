import React, { useEffect, useState } from "react";
// import Image from "next/image";
// import LoginRegister from "../LoginRegister";

const DashBoardNavBar = () => {
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      const storedRole = localStorage.getItem("role");
      setToken(storedToken);
      setRole(storedRole);
    }
  }, []);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
    }
    setToken(null);
    setRole(null);
    setShowProfileMenu(false);
  };

  return (
    <div className="">
      {/* Navbar */}
      <div className="w-full bg-[#14191F] border-b border-[#31373F] shadow-lg rounded-md">
        <div className="w-full max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Left Side */}
          <div className="flex items-center gap-4">
            <p className="text-2xl font-bold text-white">Dashboard</p>
          </div>

          {/* Right Side */}
          <div className="hidden flex items-center gap-4 relative">
            {role && <p className="text-sm text-gray-400 hidden md:block">{role}</p>}

            {/* Profile Icon */}
            <div className="relative">
              {/* <Image
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="w-8 h-8 p-1 rounded-full border-2 border-purple-600 hover:border-purple-400 transition-all duration-300"
                width={25}
                height={25}
                src="/Icons/profile.svg"
                alt="Profile"
              /> */}

              {/* Profile Dropdown */}
              {showProfileMenu && (
                <div className="absolute top-10 right-0 bg-[#1F2937] border border-[#31373F] rounded-md shadow-lg w-40">
                  {!token ? (
                    <p
                      onClick={() => {
                        setShowLoginPopup(true);
                        setShowProfileMenu(false);
                      }}
                      className="cursor-pointer py-2 px-4 text-white hover:bg-[#374151] transition-all duration-300"
                    >
                      Login/Register
                    </p>
                  ) : (
                    <p
                      onClick={handleLogout}
                      className="cursor-pointer py-2 px-4 text-white hover:bg-[#374151] transition-all duration-300"
                    >
                      Logout
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Login Popup */}
      {showLoginPopup && (
        <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-[#14191F99] z-50">
          <div className="w-[90%] md:w-[30%] bg-[#14191F] border border-[#1F1F1F99] rounded-md p-6 relative">
            <p
              className="absolute top-4 right-4 text-white text-xl cursor-pointer hover:text-purple-400"
              onClick={() => setShowLoginPopup(false)}
            >
              ×
            </p>
            {/* <LoginRegister setShowLoginPopup={setShowLoginPopup} /> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashBoardNavBar;
