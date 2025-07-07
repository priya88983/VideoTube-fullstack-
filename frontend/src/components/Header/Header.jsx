import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import SideDrawer from "./SideDrawer.jsx";
import PlusModal from "./PlusModal.jsx"; // ✅ IMPORT THIS
import { FaPlus, FaUserCircle } from "react-icons/fa";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const authStatus = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);
  // console.log("currentuser:",userData);
  const [openModal, setOpenModal] = useState(false);

  return (
    <header className="bg-[#181818] text-white shadow-md shadow-gray-900">
      <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
        {/* Left: Side Drawer + Logo */}
        <div className="flex items-center gap-4">
          <button
            className="text-white text-2xl focus:outline-none"
            onClick={() => setIsOpen(true)}
          >
            ☰
          </button>

          <Link
            to="/"
            className="flex items-center text-2xl font-bold text-white"
          >
            <span className="text-red-500">Video</span>Tube
          </Link>
        </div>

        {/*  Right: Upload Button + Avatar */}
        <div className="flex items-center gap-6 pr-2">
          <button
            onClick={() => setOpenModal(true)} // ✅ open modal
            className="text-white hover:text-blue-400 p-2 rounded-full hover:bg-gray-800 transition"
          >
            <FaPlus size={20} />
          </button>

          {authStatus && userData?.avatar ? (
            <img
              src={userData.avatar}
              alt="avatar"
              onClick={() => navigate(`/c/${userData.username}`)}
              className="w-9 h-9 rounded-full object-cover cursor-pointer border border-gray-600 hover:ring-2 hover:ring-blue-500 transition"
            />
          ) : (
            <FaUserCircle
              size={28}
              className="cursor-pointer hover:text-gray-300"
              onClick={() => navigate("/login")}
            />
          )}
        </div>
      </div>

      {/* Side Drawer */}
      <SideDrawer isOpen={isOpen} setIsOpen={setIsOpen} />

      {/*  Modal */}
      {openModal && <PlusModal onClose={() => setOpenModal(false)} />}
    </header>
  );
};

export default Header;
