// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getCurrentUser } from "../services/authServices";

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        console.log("User fetched:", currentUser);
      } catch (err) {
        console.log("No user logged in");
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  const handleExploreClick = () => {
    if (user?._id) {
      navigate("/all-videos");
    } else {
      navigate("/signup");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-6 text-center">
      <motion.h1
        className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Welcome to <br />
        <span className="bg-gradient-to-r from-red-600 via-white to-white text-transparent bg-clip-text">
          VideoTube
        </span>
      </motion.h1>

      <motion.p
        className="text-gray-400 text-sm md:text-base mb-10 max-w-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        Discover, upload and share your moments with the world — all at one place.
      </motion.p>

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.2 }}
      >
        <button
          onClick={handleExploreClick}
          className="bg-red-600 hover:bg-red-700 transition px-6 py-3 rounded-full text-sm font-semibold shadow-md"
        >
          Explore Videos
        </button>
      </motion.div>
    </div>
  );
};

export default Home;
