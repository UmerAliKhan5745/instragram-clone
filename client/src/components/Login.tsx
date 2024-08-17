import axios from "axios";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { setAuthUser } from "../redux/authSlice";
import { Link } from 'react-router-dom';

const LoginPage = () => {
  const nagviate = useNavigate()
  const dispatch = useDispatch();
  const [loding, setLoding] = useState(false)
  const [input, setInput] = useState({
    email: "", password: ""
  });
  const authState = useSelector((state: any) => {
    return state.auth || {};
  });
  const { user } = authState;

  const changeEventHandler = (e: any) => {
    setInput({ ...input, [e.target.name]: e.target.value })
  }



  const handleLogin = async (e: any) => {

    e.preventDefault();
    try {
      setLoding(true)
      const response = await axios({
        method: 'post',
        url: 'http://localhost:4000/api/v1/user/login',
        data: input,  // Use `data` instead of `input` to send the payload
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true,
        timeout: 5000  // 1 second timeout
      });

      if (response.data.success) {
        dispatch(setAuthUser(response.data.userinfo));

        toast.success(response.data.message);
        setInput({
          email: "",
          password: ""
        })
        nagviate('/')
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.message)
    } finally {
      setLoding(false)
    }
  };
  useEffect(() => {
    if (user) {
      nagviate('/')
    }
  }, [])
  return (
    <div className="bg-gray-100 h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={input.email}
              onChange={changeEventHandler}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={input.password}
              onChange={changeEventHandler}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            {loding ? (<button
            >
              <Loader2 className=' ml-6  h-6 w-4  animate-spin' />
              Please wait
            </button>) : (<button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type='submit'>Signup</button>
            )}

            <Link
              to="/register"
              className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
            >
              Don't have an account? Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
