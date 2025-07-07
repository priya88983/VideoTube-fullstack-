import React, { useRef } from "react";
import { X, Video, MessageSquarePlus, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PlusModal = ({ onClose }) => {
  const navigate = useNavigate();
  const modalRef = useRef();

  const handleBackdropClick = (e) => {
    if (modalRef.current === e.target) {
      onClose();
    }
  };

  return (
    <div
      ref={modalRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
    >
      <div className="absolute top-14 right-6 bg-[#212121] text-white rounded-lg w-64 shadow-lg py-2">
        {/* Menu Items */}
        <button
          onClick={() => {
            onClose();
            navigate("/publish-video");
          }}
          className="flex items-center w-full px-4 py-3 hover:bg-[#383838] transition text-sm"
        >
          <Video size={18} className="mr-3" />
          Upload video
        </button>

         <button
      onClick={onClose}
      className="absolute top-2 right-2 text-gray-300 hover:text-white transition"
    >
      <X size={18} />
    </button>

        <button
          onClick={() => {
            onClose();
            navigate("/tweets/create");
          }}
          className="flex items-center w-full px-4 py-3 hover:bg-[#383838] transition text-sm"
        >
          <Pencil size={18} className="mr-3" />
          Create Tweet
        </button>
      </div>
    </div>
  );
};

export default PlusModal;
