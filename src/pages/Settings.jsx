import React, { useEffect, useState } from "react";
import { Moon, Sun, LogOut, ChevronRight, ArrowLeft, User,X } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";

export default function Settings() {
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // Firebase Auth
  const auth = getAuth();

  // State to control modal visibility
  const [showModal, setShowModal] = useState(false);

  // User state
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get the current logged-in user's info from Firebase Auth
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser(currentUser); // Set user details if logged in
    }
  }, []);

  // Logout function
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        alert("Logged out successfully!");
        setShowModal(false);
        navigate("/login"); // Redirect to login page after logging out
      })
      .catch((error) => {
        alert(`Logout failed: ${error.message}`);
      });
  };

  // Cancel Logout
  const cancelLogout = () => {
    setShowModal(false); // Just close the modal
  };

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"
      } flex flex-col font-sans max-w-md mx-auto relative`}
    >
      {/* iOS-style status bar */}
      <div
        className={`${darkMode ? "bg-gray-900" : "bg-gray-100"} h-6 w-full`}
      ></div>

      {/* iOS-style header */}
      <header
        className={`${
          darkMode ? "bg-gray-900" : "bg-gray-100"
        } px-4 pt-2 pb-2 sticky top-0 z-10`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <ArrowLeft
              className="w-5 h-5 text-blue-500 mr-2"
              onClick={() => navigate("/")}
              role="button"
              tabIndex={0}
            />
            <h1 className="text-xl font-semibold">Settings</h1>
          </div>
          <div className="w-5"></div> {/* Empty div for spacing */}
        </div>
      </header>

      {/* Profile section */}
      <div
        className={`mt-4 mx-4 ${
          darkMode ? "bg-gray-800" : "bg-white"
        } rounded-lg overflow-hidden shadow-sm`}
      >
        <div className="p-4 flex items-center">
          <div
            className={`w-12 h-12 rounded-full ${
              darkMode ? "bg-gray-700" : "bg-gray-200"
            } flex items-center justify-center`}
          >
            <User className="w-6 h-6  " />
          </div>
          <div className="ml-4">
            <h2 className="font-semibold text-lg">
              {user ? user.displayName || "User" : "Loading..."}
            </h2>
            <p
              className={`text-sm ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              {user ? user.email : "Loading..."}
            </p>
          </div>
        </div>
      </div>

      {/* Settings list */}
      <div
        className={`mt-6 mx-4 ${
          darkMode ? "bg-gray-800" : "bg-white"
        } rounded-lg overflow-hidden shadow-sm`}
      >
        {/* Theme toggle */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center">
            {darkMode ? (
              <Moon className="w-5 h-5 text-blue-400 mr-3" />
            ) : (
              <Sun className="w-5 h-5 text-yellow-500 mr-3" />
            )}
            <span>Dark Mode</span>
          </div>
          <div
            className={`w-12 h-6 rounded-full relative ${
              darkMode ? "bg-blue-500" : "bg-gray-300"
            } transition-colors duration-200`}
            onClick={toggleTheme}
            role="switch"
            aria-checked={darkMode}
            tabIndex={0}
          >
            <span
              className={`absolute w-5 h-5 rounded-full ${
                darkMode ? "bg-white right-1" : "bg-white left-1"
              } top-0.5 transition-transform duration-200 shadow-sm`}
            ></span>
          </div>
        </div>

        {/* Logout button */}
        <div
          className="flex items-center justify-between p-4 "
          onClick={() => setShowModal(true)} // Show the modal when logout is clicked
          role="button"
          tabIndex={0}
        >
          <div className="flex items-center">
            <LogOut className="w-5 h-5 text-red-500 mr-3" />
            <span className="text-red-500">Logout</span>
          </div>
          <ChevronRight
            className={`w-5 h-5 ${
              darkMode ? "text-gray-600" : "text-gray-400"
            }`}
          />
        </div>
      </div>

      {/* App info */}
      <div className="mt-6 px-4">
        <p
          className={`text-center text-sm ${
            darkMode ? "text-gray-500" : "text-gray-400"
          }`}
        >
          Basket v1.0
        </p>
      </div>

      {showModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50" 
          role="dialog" 
          aria-modal="true" 
          aria-labelledby="logout-modal-title"
        >
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-xs mx-4 overflow-hidden">
            <div className="p-5 pb-0 flex justify-end">
              <button 
                onClick={cancelLogout}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="px-6 pt-2 pb-8 flex flex-col items-center">
              <div className="w-16 h-16 bg-red-50 flex items-center justify-center rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
              
              <h2
                id="logout-modal-title"
                className="text-xl font-medium mb-4 text-center text-amber-900"
              >
                Are you sure you want to log out?
              </h2>
              
              <div className="w-full space-y-3">
                <button
                  className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-medium transition-colors"
                  onClick={handleLogout}
                >
                  Logout
                </button>
                
                <button
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-xl font-medium transition-colors"
                  onClick={cancelLogout}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
