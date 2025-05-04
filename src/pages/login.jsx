import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase'; // Adjust the import path as necessary

function Login() {
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Save user data to Firestore (optional)
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      });

      navigate("/"); // Redirect to home or dashboard
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 sm:p-6">
  <div className="w-full max-w-sm sm:max-w-md bg-white shadow-md rounded-lg overflow-hidden">
    <div className="px-4 py-8 sm:px-8 sm:py-10">
      <h1 className="text-center text-xl sm:text-2xl md:text-3xl font-semibold mb-6 sm:mb-8 text-gray-800">
        Welcome
      </h1>
      <button
        onClick={handleGoogleLogin}
        className="w-full flex items-center justify-center py-2 sm:py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-150"
      >
        <span className="mr-2">
          <FcGoogle className="w-5 h-5 sm:w-6 sm:h-6" />
        </span>
        <span className="font-medium text-sm sm:text-base">
          Sign in with Google
        </span>
      </button>
      
      {error && <p className="text-red-500 text-center mt-2 text-sm">{error}</p>}
    </div>
  </div>
  
  <p className="mt-4 sm:mt-6 text-gray-500 text-xs sm:text-sm text-center max-w-md px-2">
    By signing in, you agree to our Terms of Use and Privacy Policy.
  </p>
</div>
  );
}

export default Login;
