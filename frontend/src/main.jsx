import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import { Provider } from "react-redux";
import store from "./store/store.js";
import { createBrowserRouter } from "react-router-dom";
import AuthLayout from "./components/AuthLayout.jsx";
import Signup from "./pages/SignUp.jsx";
import LoginUser from "./pages/LoginUser.jsx";
import Change_password from "./pages/Change_password.jsx";
import Update_AccountDetails from "./pages/user/Update_AccountDetails.jsx";
import Update_Avatar from "./pages/user/Update_Avatar.jsx";
import Update_CoverImage from "./pages/user/Update_CoverImage.jsx";
import User_Profile from "./pages/user/User_Profile.jsx";
// import Settings from "./components/accountUpdate/Settings.jsx";
import PublishVideo from "./pages/videos/PublishVideo.jsx";
import Home from "./pages/Home.jsx";
import Update_video from "./pages/videos/Update_video";
import Getcomments from "./pages/comments/Getcomments.jsx";
import Update_Comments from "./pages/comments/Update_Comments.jsx";
import Watch_video from "./pages/videos/Watch_video.jsx";
import Watch_history from "./components/videos/Watch_history.jsx";
import GetlikedVideos from "./components/like/GetlikedVideos.jsx";
import AddTweets from "./components/tweets/Addtweets.jsx";
import CreateNewPlaylist from "./components/playlists/CreateNewPlaylist.jsx";
import GetAllPlaylists from "./components/playlists/GetAllPlaylists.jsx";
import GetSinglePlaylist from "./components/playlists/GetSinglePlaylist.jsx";
import GetAllVideos from "./components/videos/GetallVideos.jsx"

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },

     //user account

      {
        path: "/signup",
        element: (
          <AuthLayout authentication={false}>
            <Signup />
          </AuthLayout>
        ),
      },

      {
        path: "/login",
        element: (
          <AuthLayout authentication={false}>
            <LoginUser />
          </AuthLayout>
        ),
      },

      {
        path: "/change-password",
        element: (
          <AuthLayout authentication={true}>
            <Change_password />
          </AuthLayout>
        ),
      },
      {
        path: "/update-account",
        element: (
          <AuthLayout authentication={true}>
            <Update_AccountDetails />
          </AuthLayout>
        ),
      },
      {
        path: "/avatar",
        element: (
          <AuthLayout authentication={true}>
            <Update_Avatar />
          </AuthLayout>
        ),
      },
      {
        path: "/cover-image",
        element: (
          <AuthLayout authentication={true}>
            <Update_CoverImage />
          </AuthLayout>
        ),
      },

      {
        path: "/c/:username", // ✅ not "/c/username" or anything else
        element: (
          <AuthLayout authentication={true}>
            <User_Profile />
          </AuthLayout>
        ),
      },

      
      // {
      //   path: "/settings",
      //   element: (
      //     <AuthLayout authentication={true}>
      //       <Settings />
      //     </AuthLayout>
      //   ),
      // },

      //videos
      {
        path: "videos/:videoId",
        element:(
          <AuthLayout authentication={true}>
          </AuthLayout>
        )
      },

      {
        path:"/all-videos",
        element:<GetAllVideos/>

      },

      {
        path: "/publish-video",
        element: (
          <AuthLayout authentication={true}>
            <PublishVideo />
          </AuthLayout>
        ),
      },
      {
        path: "playlists/create",
        element:(
          <AuthLayout authentication={true}>
            <CreateNewPlaylist />
          </AuthLayout>
        )
      },

      {
        path:"/playlists/my-playlists",
        element:(
           <AuthLayout authentication={true}>
            <GetAllPlaylists />
          </AuthLayout>
        )
      },
      {
        path:"/playlists/:id",
        element:(
        <AuthLayout authentication={true}>
            <GetSinglePlaylist />
          </AuthLayout>
          )
          ,
        },
      
      {
        path: "videos/:id/update", 
        element: (
          <AuthLayout authentication={true}>
            <Update_video />
          </AuthLayout>
        ),
      },
      {
        path: "videos/:id/watch", 
        element: (
          <AuthLayout>
            <Watch_video />
          </AuthLayout>
        ),
      },

      //comments
      {
        path: "comments/video/:videoId",
        element: (
          <AuthLayout>
            <Getcomments />
          </AuthLayout>
        ),
      },

      {
        path: "comments/:commentId/update",
        element: (
          <AuthLayout>
            <Update_Comments />
          </AuthLayout>
        ),
      },

      {
        path: "users/history",
        element: (
          <AuthLayout authentication={true}>
            <Watch_history />
          </AuthLayout>
        ),
      },

      

      {
        path: "likes/liked-videos",
        element: (
          <AuthLayout authentication={true}>
            <GetlikedVideos />
          </AuthLayout>
        ),
      },

      {
        path:"/tweets/create",
        element:(
          <AuthLayout authentication={true}>
            <AddTweets/>
          </AuthLayout>
        )
      }
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
