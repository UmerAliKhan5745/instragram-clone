import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import MainLayout from "./components/MainLayout";
import './App.css';
import ChatPage from "./components/ChatPage";
import EditProfile from "./components/EditProfile";
import Home from "./components/Home";
import Profile from "./components/Profile";
import Login from "./components/Login";
import Register from "./components/Register";
import ErrorPage from "./components/ErrorPage";
const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout/>,
    errorElement: <ErrorPage/>,
    children: [ 
      {
        path: "/",
        element: <Home/>
      }, {
        path: "/profile/:id",
        element: <Profile/>
      }, {
        path: "/account/:id",
        element: <EditProfile/>
      }, {
        path: "/chat",
        element: <ChatPage/>
      }
    ]
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  }
])
function App() {
  return (

    <>
      <RouterProvider router={browserRouter} />
    </>
  );
}

export default App;