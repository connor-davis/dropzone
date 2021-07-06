import { Route, useHistory } from 'react-router-dom';

import AddFriend from '../components/addFriend';
import Navbar from '../components/navbar';
import React from 'react';

let FriendListPage = () => {
  let router = useHistory();

  return (
    <>
      <Navbar title="Friends">
        <div
          className="flex justify-center items-center border-l border-t border-r border-b border-gray-300 dark:border-gray-800 rounded-full p-1 cursor-pointer hover:text-green-500"
          onClick={() => router.push('/friendList/addFriend')}
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
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </div>
        <div
          className="flex justify-center items-center border-l border-t border-r border-b border-gray-300 dark:border-gray-800 rounded-full p-1 cursor-pointer hover:text-red-500"
          onClick={() => router.push('/')}
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
      </Navbar>

      <div className="flex w-full h-full">
        <div className="flex flex-col w-64 h-full border-r border-gray-300 dark:border-gray-800"></div>

        <div className="flex flex-col w-full h-full">
          <Route
            path="/friendList/addFriend"
            component={(props) => <AddFriend {...props} />}
          />
        </div>
      </div>
    </>
  );
};

export default FriendListPage;
