// components/common/OwnerMenu.jsx
import React, { useState, useRef, useEffect } from "react";
import { MoreVertical, Pencil, Trash } from "lucide-react";

const OwnerMenu = ({ onEdit, onDelete }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <MoreVertical
        className="cursor-pointer text-gray-400 hover:text-white"
        onClick={() => setOpen(!open)}
        size={18}
      />
      {open && (
        <div className="absolute right-0 top-6 w-32 bg-[#1f1f1f] border border-gray-600 rounded shadow-md z-10">
          <button
            onClick={() => {
              setOpen(false);
              onEdit();
            }}
            className="flex items-center gap-2 px-3 py-2 text-sm text-white hover:bg-gray-700 w-full"
          >
            <Pencil size={14} /> Edit
          </button>
          <button
            onClick={() => {
              setOpen(false);
              onDelete();
            }}
            className="flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-gray-700 w-full"
          >
            <Trash size={14} /> Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default OwnerMenu;
