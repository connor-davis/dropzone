import { Route, useHistory } from 'react-router-dom';

import Navbar from '../components/navbar';
import React from 'react';

let MessagingPage = () => {
  let router = useHistory();

  return (
    <>
      <Navbar title="Messages">
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
          <Route exact path="/messaging" component={() => 'Welcome'} />
          <Route
            path="/messaging/:userName"
            component={() => 'Under Construction'}
          />
        </div>
      </div>
    </>
  );
};

export default MessagingPage;