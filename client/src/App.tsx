import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import MainLayout from "./components/MainLayout";
import ChatPage from "./components/ChatPage";
import EditProfile from "./components/EditProfile";
import Home from "./components/Home";
import Profile from "./components/Profile";
import Login from "./components/Login";
import Register from "./components/Register";
import ErrorPage from "./components/ErrorPage";
import ProtectedRoutes from "./components/ProtectedRoutes";
const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoutes><MainLayout /></ProtectedRoutes>,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <ProtectedRoutes> <Home /></ProtectedRoutes>,
      }, {
        path: "/profile/:id",
        element: <ProtectedRoutes><Profile /></ProtectedRoutes>,
      }, {
        path: '/account/edit',
        element: <ProtectedRoutes> <EditProfile /></ProtectedRoutes>,
      }, {
        path: "/chat",
        element: <ProtectedRoutes><ChatPage /></ProtectedRoutes>,
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