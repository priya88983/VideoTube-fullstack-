import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../services/authServices';
import { Settings } from 'lucide-react';
import SettingsModal from './accountUpdate/SettingsModal.jsx'

const SettingsButton = ({ channelId }) => {
  const [openSettingsModal, setOpenSettingsModal] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const current = await getCurrentUser();
        setUser(current);
      } catch (err) {
        console.error('Error fetching current user:', err);
      }
    };

    fetchUser();
  }, []);

  if (!user || user._id !== channelId) return null;

  return (
    <>
      <button
        onClick={() => setOpenSettingsModal(true)}
        className="flex items-center gap-2 bg-[#181818] hover:bg-gray-700 text-white px-3 py-1.5 rounded-md text-sm shadow transition"
      >
        <Settings className="w-5 h-5" />
        <span>Settings</span>
      </button>

      {openSettingsModal && (
        <SettingsModal onClose={() => setOpenSettingsModal(false)} />
      )}
    </>
  );
};

export default SettingsButton;
