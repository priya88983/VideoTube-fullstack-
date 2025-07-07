import { useState,useEffect } from 'react'
import {useDispatch} from 'react-redux';
import {login,logout} from "./store/authSlice";
import Header from "./components/Header/Header.jsx";
import {getCurrentUser} from "./services/authServices.js"
import { Outlet } from "react-router-dom";

function App() {
  const [loading,setLoading] =useState(true)

  const dispatch= useDispatch()


useEffect(() => {
  getCurrentUser()
    .then((userData) => {
      if (userData) {
        dispatch(login({ userData }));
      } else {
        dispatch(logout());
      }
    })
    .finally(() => setLoading(false));
}, []);

  // console.log(import.meta.env.VITE_APPWRITE_URL);

  return !loading ? (
      <div className='min-h-screen  flex flex-wrap content-between bg-[#0f0f0f]'>
      
      <div className ='w-full block'>

        <Header />

        <main>

          <Outlet />
    </main>
       
      </div>
      </div>
    ):null


   
  
}

export default App