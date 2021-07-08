import { Route, useHistory } from 'react-router-dom';

import AddFriend from '../components/addFriend';
import FriendRequests from './friendRequests';
import Navbar from '../components/navbar';
import React from 'react';
import { getFriends } from '../state/friends.slice';
import { useSelector } from 'react-redux';

let FriendListPage = () => {
  let router = useHistory();

  let friends = useSelector(getFriends);

  return (
    <>
      <Navbar
        title="Friends"
        BackButton={() => (
          <>
            {window.location.pathname.length > '/friendList'.length && (
              <div
                className="flex justify-center items-center border-l border-t border-r border-b border-gray-300 dark:border-gray-800 rounded-full p-1 cursor-pointer hover:text-yellow-600"
                onClick={() => router.push('/friendList')}
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
                    d="M7 16l-4-4m0 0l4-4m-4 4h18"
                  />
                </svg>
              </div>
            )}
          </>
        )}
      >
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
          className="flex justify-center items-center border-l border-t border-r border-b border-gray-300 dark:border-gray-800 rounded-full p-1 cursor-pointer hover:text-yellow-600"
          onClick={() => router.push('/friendList/friendRequests')}
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
              d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l3-3m-3 3L9 8m-5 5h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293h3.172a1 1 0 00.707-.293l2.414-2.414a1 1 0 01.707-.293H20"
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
        <div className="flex flex-col w-full h-full">
          <Route
            exact
            path="/friendList"
            component={() => (
              <>
                {friends &&
                  friends.map((friend) => (
                    <div className="flex items-center m-1 px-1 py-2 border-b border-gray-300 dark:border-gray-800">
                      <div className="flex flex-col items-start">
                        <div className="text-sm">{`${friend.firstName} ${friend.lastName}`}</div>
                        <div className="text-xs text-gray-400 dark:text-gray-600">
                          @{friend.username}
                        </div>
                      </div>
                    </div>
                  ))}
              </>
            )}
          />
          <Route
            path="/friendList/addFriend"
            component={(props) => <AddFriend {...props} />}
          />
          <Route
            path="/friendList/friendRequests"
            component={(props) => <FriendRequests {...props} />}
          />
        </div>
      </div>
    </>
  );
};

export default FriendListPage;
