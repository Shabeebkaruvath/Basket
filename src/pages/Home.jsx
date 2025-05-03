import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  ShoppingBag,
  Plus,
  Trash2,
  Check,
  Settings as SettingsIcon,
  Send,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import {
  collection,
  doc,
  setDoc,
  onSnapshot,
  getDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

// Import Firebase configuration
import { db, auth } from "../firebase/firebase";

export default function Home() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  // Add a new item to Firestore
  const handleAdd = async () => {
    if (!newItem.trim()) return;

    const user = auth.currentUser;
    if (!user) {
      console.error("User not authenticated");
      return;
    }

    const userRef = doc(db, "users", user.uid); // User's document reference
    const dataRef = collection(userRef, "data"); // Sub-collection where items will be stored

    const newItemObj = {
      name: newItem.trim(),
      purchased: false,
      createdAt: new Date(), // Timestamp
    };

    try {
      const itemDocRef = doc(dataRef, newItem.trim()); // Unique document for the item
      await setDoc(itemDocRef, newItemObj);
      setNewItem(""); // Clear input field
      // No need to call fetchUserItems here as we're using onSnapshot
    } catch (error) {
      console.error("Error adding item: ", error);
    }
  };

  // Set up real-time listener for items
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const dataRef = collection(userRef, "data");

    const unsubscribe = onSnapshot(dataRef, (snapshot) => {
      const updatedItems = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setItems(updatedItems);
    });

    return () => unsubscribe(); // Clean up on unmount
  }, []);

  // Toggle purchased state for an item
  const handleToggle = async (itemId) => {
    const user = auth.currentUser;
    if (!user) {
      console.error("User not authenticated");
      return;
    }

    const userRef = doc(db, "users", user.uid); // User's document reference
    const dataRef = collection(userRef, "data"); // Sub-collection where items will be stored

    const itemRef = doc(dataRef, itemId);

    try {
      const itemSnapshot = await getDoc(itemRef);
      if (itemSnapshot.exists()) {
        const item = itemSnapshot.data();
        await updateDoc(itemRef, { purchased: !item.purchased });
        // No need to call fetchUserItems as we're using onSnapshot
      }
    } catch (error) {
      console.error("Error toggling item: ", error);
    }
  };

  // Delete an item from Firestore
  const handleDelete = async (itemId) => {
    const user = auth.currentUser;
    if (!user) {
      console.error("User not authenticated");
      return;
    }

    const userRef = doc(db, "users", user.uid); // User's document reference
    const dataRef = collection(userRef, "data"); // Sub-collection where items will be stored

    const itemRef = doc(dataRef, itemId);

    try {
      await deleteDoc(itemRef);
      // No need to call fetchUserItems as we're using onSnapshot
    } catch (error) {
      console.error("Error deleting item: ", error);
    }
  };

  // Memoize filtered items to avoid unnecessary recalculations
  const filteredItems = useMemo(() => {
    return items.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [items, searchTerm]);

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"
      } flex flex-col font-sans max-w-full sm:max-w-md mx-auto relative`}
    >
      {/* iOS-style header */}
      {/* iOS-style header with increased height and font size */}
      <header
        className={`${
          darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
        } px-6 py-6 sticky top-0 z-10 border-b ${
          darkMode ? "border-gray-700" : "border-gray-200"
        } shadow-sm`}
      >
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-4xl font-bold">Basket</h1>
          <div className="flex items-center">
            <div className="flex items-center text-blue-500">
              <ShoppingBag className="w-8 h-8 mr-3" />
              <span className="font-semibold text-2xl">{items.length}</span>
            </div>
            <button
              onClick={() => navigate("/settings")}
              className="ml-6 text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-1"
              aria-label="Settings"
            >
              <SettingsIcon className="w-8 h-8" />
            </button>
          </div>
        </div>
      </header>

      {/* Search bar */}
      <div className={`px-4 py-2 ${darkMode ? "bg-gray-900" : "bg-gray-100"}`}>
        <div
          className={`${
            darkMode ? "bg-gray-800" : "bg-gray-200"
          } rounded-lg flex items-center px-3 py-2`}
        >
          <Search className="w-4 h-4 text-gray-500 mr-2" />
          <input
            type="text"
            className={`bg-transparent w-full focus:outline-none text-sm ${
              darkMode
                ? "text-white placeholder-gray-500"
                : "text-gray-800 placeholder-gray-500"
            }`}
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto pb-20">
        <div
          className={`mx-4 my-2 ${
            darkMode ? "bg-gray-800" : "bg-white"
          } rounded-lg shadow-sm overflow-hidden`}
        >
          {items.length === 0 ? (
            <div className="p-8 text-center">
              <ShoppingBag
                className={`w-12 h-12 ${
                  darkMode ? "text-gray-700" : "text-gray-300"
                } mx-auto mb-4`}
              />
              <p className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                Add items to your shopping list
              </p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="p-8 text-center">
              <Search
                className={`w-12 h-12 ${
                  darkMode ? "text-gray-700" : "text-gray-300"
                } mx-auto mb-4`}
              />
              <p className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                No items match your search
              </p>
            </div>
          ) : (
            filteredItems.map((item, index) => (
              <div
                key={item.id || item.name}
                className={`flex items-center justify-between p-4 ${
                  index !== filteredItems.length - 1
                    ? `border-b ${
                        darkMode ? "border-gray-700" : "border-gray-100"
                      }`
                    : ""
                } ${darkMode ? "active:bg-gray-700" : "active:bg-gray-50"}`}
              >
                <label
                  className="flex items-center space-x-3 flex-1 touch-manipulation"
                  onClick={() => handleToggle(item.id || item.name)}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center border cursor-pointer ${
                      item.purchased
                        ? "bg-blue-500 border-blue-500"
                        : darkMode
                        ? "border-gray-600"
                        : "border-gray-300"
                    }`}
                  >
                    {item.purchased && <Check className="w-4 h-4 text-white" />}
                  </div>
                  <span
                    className={`${
                      item.purchased
                        ? "line-through text-gray-400"
                        : darkMode
                        ? "text-gray-200"
                        : "text-gray-800"
                    } text-base`}
                  >
                    {item.name}
                  </span>
                </label>
                <button
                  onClick={() => handleDelete(item.id || item.name)}
                  className="text-red-500 p-2 focus:outline-none"
                  aria-label="Delete item"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Footer input for new items */}
      <footer
        className={`${
          darkMode ? "bg-gray-900" : "bg-white"
        } sticky bottom-0 p-4 shadow-lg rounded-full`}
      >
        <div className="max-w-md mx-auto">
          <div
            className={`flex items-center ${
              darkMode ? "bg-gray-800" : "bg-gray-50"
            } px-4 py-3 rounded-full overflow-hidden shadow-sm border ${
              darkMode ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <input
              id="newItemInput"
              type="text"
              className={`flex-1 ${
                darkMode
                  ? "bg-gray-800 text-white placeholder-gray-400"
                  : "bg-gray-50 text-gray-800 placeholder-gray-500"
              } focus:outline-none text-base`}
              placeholder="Add item..."
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            />

            <button
              onClick={handleAdd}
              className={`ml-2 ${
                newItem.trim()
                  ? darkMode
                    ? "bg-blue-500 text-white"
                    : "bg-blue-500 text-white"
                  : darkMode
                  ? "bg-gray-700 text-gray-500"
                  : "bg-gray-200 text-gray-400"
              } p-2 rounded-full focus:outline-none transition-colors ${
                newItem.trim() && "hover:bg-blue-600"
              }`}
              disabled={!newItem.trim()}
              aria-label="Add item"
            >
              <Send size={18} className={newItem.trim() ? "" : "opacity-60"} />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
