import React, { useState } from 'react';
import { getUserInfo, setUser } from '../state/user.slice';
import { useDispatch, useSelector } from 'react-redux';

import Navbar from './navbar';
import { BrowserRouter as Router } from 'react-router-dom';
import ThemeSwitcher from './themeSwitcher';

let ProfileGuard = () => {
  let dispatch = useDispatch();

  let userInfo = useSelector(getUserInfo);

  let [username, setUsername] = useState('');
  let [firstName, setFirstName] = useState('');
  let [lastName, setLastName] = useState('');

  return (
    <div>
      {userInfo.username ? (
        <div className="flex flex-col w-screen h-screen">
          <Navbar>
            <div className="text-sm">Welcome, {userInfo.firstName}</div>
            <ThemeSwitcher />
            <div
              className="flex justify-center items-center border-l border-t border-r border-b border-gray-300 dark:border-gray-800 rounded-full p-1 cursor-pointer"
              onClick={() => dispatch(setUser({}))}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 hover:text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </div>
          </Navbar>
          <Router>
            <div className="flex w-screen h-full">
              <div className="flex flex-col w-64 h-full border-r border-gray-300 dark:border-gray-800">
                <Navbar title="Zones"></Navbar>
              </div>
              <div className="flex flex-col w-full h-full"></div>
            </div>
          </Router>
        </div>
      ) : (
        <div className="flex flex-col justify-center w-screen h-screen">
          <div className="flex justify-center items-center w-screen h-auto">
            <div className="flex flex-col border-l border-t border-r border-b border-gray-300 dark:border-gray-800 p-2 rounded-md space-y-2">
              <div className="flex justify-center items-center text-lg my-3">
                Profile Setup
              </div>

              <input
                type="text"
                placeholder="Username"
                onChange={({ target: { value } }) => setUsername(value)}
                className="outline-none border-l border-t border-r border-b border-gray-300 dark:border-gray-800 p-2 rounded-md bg-gray-800"
              />
              <input
                type="text"
                placeholder="First Name"
                onChange={({ target: { value } }) => setFirstName(value)}
                className="outline-none border-l border-t border-r border-b border-gray-300 dark:border-gray-800 p-2 rounded-md bg-gray-800"
              />
              <input
                type="text"
                placeholder="Last Name"
                onChange={({ target: { value } }) => setLastName(value)}
                className="outline-none border-l border-t border-r border-b border-gray-300 dark:border-gray-800 p-2 rounded-md bg-gray-800"
              />

              <div
                className="flex justify-center items-center bg-yellow-500 text-white px-3 py-2 rounded-md cursor-pointer"
                onClick={() => {
                  if (username !== '' && firstName !== '' && lastName !== '')
                    dispatch(setUser({ username, firstName, lastName }));
                }}
              >
                Continue
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileGuard;
