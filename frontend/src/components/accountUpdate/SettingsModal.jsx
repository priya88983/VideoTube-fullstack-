import React from "react";
import { Link } from "react-router-dom";

const SettingLink = ({ to, text, onClose }) => (
  <Link
    to={to}
    onClick={onClose}
    className="flex items-center gap-3 px-5 py-4 rounded-xl bg-[#1f1f1f] hover:bg-[#2c2c2c] transition-all shadow-sm hover:shadow-lg border border-[#2a2a2a]"
  >
    <span className="text-base font-medium">{text}</span>
  </Link>
);

const SettingsModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-[#181818] text-white rounded-2xl shadow-2xl p-8 w-[90%] max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-400 hover:text-white text-2xl"
        >
          &times;
        </button>

        <h1 className="text-2xl font-semibold mb-6 border-b border-gray-700 pb-3">
          Settings
        </h1>

        <div className="space-y-4">
          <SettingLink to="/update-account" text="Update Account Details" onClose={onClose} />
          <SettingLink to="/avatar" text="Update Avatar" onClose={onClose} />
          <SettingLink to="/cover-image" text="Update Cover Image" onClose={onClose} />
          <SettingLink to="/change-password" text="Change Password" onClose={onClose} />
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
