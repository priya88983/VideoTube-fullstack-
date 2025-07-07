import React from "react";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../services/authServices.js";
import { logout } from "../../store/authSlice";
import { useNavigate } from "react-router-dom";

const LogoutBtn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = () => {
    logoutUser().then(() => {
      dispatch(logout());
      navigate("/"); // ✅ navigate to home after logout
    });
  };

  return (
    <button
      onClick={logoutHandler}
      className="w-full text-left hover:underline rounded"
    >
      Logout
    </button>
  );
};

export default LogoutBtn;
