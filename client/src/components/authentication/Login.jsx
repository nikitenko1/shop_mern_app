import React, { useState } from 'react';
import Loader from './../global/Loader';
import { useDispatch, useSelector } from 'react-redux';
import { FaRegUser } from 'react-icons/fa';
import { BiLock } from 'react-icons/bi';
import { AiOutlineClose } from 'react-icons/ai';
import { login } from './../../redux/slices/authSlice';
import { validateEmail } from './../../utils/validateEmail';

const Login = ({ setCurrentPage, setOpenAuthenticationModal }) => {
  const [userData, setUserData] = useState({
    email: '',
    password: '',
  });

  const dispatch = useDispatch();
  const { alert } = useSelector((state) => state);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userData.email || !userData.password) {
      return dispatch({
        type: 'alert/alert',
        payload: {
          error: 'Please fill up every field.',
        },
      });
    }

    if (!validateEmail(userData.email)) {
      return dispatch({
        type: 'alert/alert',
        payload: {
          error: 'Please provide valid email address.',
        },
      });
    }

    if (userData.password.length < 8) {
      return dispatch({
        type: 'alert/alert',
        payload: {
          error: 'Password should be at least 8 characters.',
        },
      });
    }

    await dispatch(login({ userData }));
    setOpenAuthenticationModal(false);
    setUserData({
      email: '',
      password: '',
    });
  };
  return (
    <div className="font-opensans">
      <div className="flex items-center justify-between border-b border-gray-300 px-7 py-4">
        <h1 className="font-medium text-xl">Sign In</h1>
        <AiOutlineClose
          onClick={() => setOpenAuthenticationModal(false)}
          className="text-lg cursor-pointer"
        />
      </div>
      <div className="flex items-center justify-between gap-6 p-7">
        <div className="flex-1">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email">Email</label>
              <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 mt-3">
                <FaRegUser className="text-gray-400 text-sm" />
                <input
                  type="text"
                  autoComplete="off"
                  id="email"
                  name="email"
                  value={userData.email}
                  onChange={handleChange}
                  className="pl-3 w-full outline-none text-sm"
                />
              </div>
            </div>
            <div className="mb-5">
              <label htmlFor="password">Password</label>
              <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 mt-3">
                <BiLock className="text-gray-400 text-lg" />
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={userData.password}
                  onChange={handleChange}
                  className="pl-3 w-full outline-none text-sm"
                />
              </div>
              <p
                onClick={() => setCurrentPage('forgot')}
                className="text-sm text-gray-500 hover:text-orange-700 transition mt-2 cursor-pointer"
              >
                Forget password?
              </p>
            </div>
            <div className="flex items-center justify-between">
              <button
                type="submit"
                disabled={alert.loading ? true : false}
                className={`${
                  alert.loading ? 'bg-blue-300' : 'bg-blue-400'
                } text-white rounded-full px-5 py-2 text-sm transition ${
                  alert.loading ? 'hover:bg-blue-300' : 'hover:bg-blue-600'
                } ${alert.loading ? 'cursor-auto' : 'cursor-pointer'}`}
              >
                {alert.loading ? <Loader /> : 'Sign In'}
              </button>
              <button
                onClick={() => setCurrentPage('register')}
                className="text-sm hover:text-orange-700 transition"
              >
                Create Account
              </button>
            </div>
          </form>
        </div>
        <div className="flex-1 hidden md:block">
          <img
            src={`${process.env.PUBLIC_URL}/images/auth.jpg`}
            alt="sneakershub"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
