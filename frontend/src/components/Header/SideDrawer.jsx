import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import LogoutBtn from "./LogoutBtn.jsx";

const SideDrawer = ({ isOpen, setIsOpen }) => {
  
   const userData = useSelector((state) => state.auth.userData);
  const username = userData?.username;
  const authStatus = useSelector((state) => state.auth.status);
  const navigate = useNavigate();

  const closeDrawer = () => setIsOpen(false);

  return (
    <div
      className={`fixed top-0 left-0 h-full w-64 bg-black shadow-lg z-50 transform transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex justify-between items-center px-4 py-4 border-b border-gray-700">
        <h2 className="text-white text-xl font-semibold">Menu</h2>
        <button onClick={closeDrawer} className="text-white text-xl">✕</button>
      </div>

    <div className="flex flex-col px-4 py-6 gap-4 text-white">
  {/* Top nav links */}
  <Link to="/" onClick={closeDrawer} className="hover:underline">Home</Link>
  {authStatus && <Link to="/all-videos" onClick={closeDrawer} className="hover:underline">Videos</Link>}
  {authStatus && <Link to="/playlists/my-playlists" onClick={closeDrawer} className="hover:underline">Playlists</Link>}
  {authStatus && <Link to="/likes/liked-videos" onClick={closeDrawer} className="hover:underline">Liked Videos</Link>}
  {authStatus && <Link to="/users/history" onClick={closeDrawer} className="hover:underline">Watch History</Link>}
</div>


 <div className="px-4 py-4 border-t border-gray-700 flex flex-col gap-3 text-white">
  {!authStatus ? (
    <>
      <Link to="/login" onClick={closeDrawer} className="hover:underline">
        Login
      </Link>
      <Link to="/signup" onClick={closeDrawer} className="hover:underline">
        Signup
      </Link>
    </>
  ) : (
    <>
       <Link
      to={`/c/${username}`}
      onClick={closeDrawer}
      className="hover:underline"
    >
      Profile
    </Link>

      <div className="text-left">
        <LogoutBtn />
      </div>
    </>
  )}
</div>

    </div>
  );
};

export default SideDrawer;
