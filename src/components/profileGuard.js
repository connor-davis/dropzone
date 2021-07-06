import React, { useEffect, useState } from 'react';
import { Route, useHistory } from 'react-router-dom';
import { getUserInfo, setUser } from '../state/user.slice';
import { useDispatch, useSelector } from 'react-redux';

import FriendListPage from '../pages/friendList';
import MessagingPage from '../pages/messaging';
import Navbar from './navbar';
import ThemeSwitcher from './themeSwitcher';

let ProfileGuard = ({ location }) => {
  let dispatch = useDispatch();

  let router = useHistory();

  let userInfo = useSelector(getUserInfo);

  let [username, setUsername] = useState('');
  let [firstName, setFirstName] = useState('');
  let [lastName, setLastName] = useState('');

  useEffect(() => {
    router.push('/');

    if (userInfo !== {}) return window.send('initiateNode', userInfo);
  }, []);

  return userInfo.username ? (
    <div className="flex flex-col w-screen h-screen">
      <Navbar>
        <div className="text-sm">Welcome, {userInfo.firstName}</div>

        <div
          className="flex justify-center items-center border-l border-t border-r border-b border-gray-300 dark:border-gray-800 rounded-full p-1 cursor-pointer hover:text-yellow-600"
          onClick={() => {
            router.goBack();
            setTimeout(() => {
              router.push('/messaging');
            }, 100);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
            />
          </svg>
        </div>

        <div
          className="flex justify-center items-center border-l border-t border-r border-b border-gray-300 dark:border-gray-800 rounded-full p-1 cursor-pointer hover:text-yellow-600"
          onClick={() => {
            router.goBack();
            setTimeout(() => {
              router.push('/friendList');
            }, 100);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        </div>

        <ThemeSwitcher />

        <div
          className="flex justify-center items-center border-l border-t border-r border-b border-gray-300 dark:border-gray-800 rounded-full p-1 cursor-pointer hover:text-red-500"
          onClick={() => dispatch(setUser({}))}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
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

      <div className="flex w-screen h-full">
        <div className="flex flex-col w-64 h-full border-r border-gray-300 dark:border-gray-800">
          <Navbar title="Zones"></Navbar>
        </div>

        <div className="flex flex-col w-full h-full">
          <Route exact path="/messaging" component={() => <MessagingPage />} />
          <Route
            exact
            path="/friendList"
            component={() => <FriendListPage />}
          />
        </div>
      </div>
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
            className="outline-none border-l border-t border-r border-b border-gray-300 dark:border-gray-800 p-2 rounded-md bg-gray-800 bg-gray-100 dark:bg-black"
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
  );
};

export default ProfileGuard;
