import React, { useEffect } from 'react';
import { getFriendRequests, removeFriendRequest } from '../state/friends.slice';
import { useDispatch, useSelector } from 'react-redux';

import { getUserInfo } from '../state/user.slice';

let FriendRequests = () => {
  let dispatch = useDispatch();

  let userInfo = useSelector(getUserInfo);
  let friendRequests = useSelector(getFriendRequests);

  useEffect(() => {
    console.log(friendRequests);
  }, [friendRequests]);

  return (
    <>
      {friendRequests && friendRequests.length > 0 ? (
        friendRequests.map((friendRequest) => (
          <div
            key={friendRequest.id}
            className="flex justify-between items-center m-1 px-1 py-2 border-b border-gray-300 dark:border-gray-800"
          >
            <div className="flex flex-col items-start">
              <div className="text-sm">{`${friendRequest.firstName} ${friendRequest.lastName}`}</div>
              <div className="text-xs text-gray-400 dark:text-gray-600">
                @{friendRequest.username}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div
                className="flex justify-center items-center border-l border-t border-r border-b border-gray-300 dark:border-gray-800 rounded-full p-1 cursor-pointer hover:text-green-500"
                onClick={() => {
                  window.send('friendRequestAccepted', {
                    self: userInfo,
                    target: friendRequest,
                  });

                  return dispatch(removeFriendRequest(friendRequest.id));
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
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div
                className="flex justify-center items-center border-l border-t border-r border-b border-gray-300 dark:border-gray-800 rounded-full p-1 cursor-pointer hover:text-red-500"
                onClick={() => {
                  window.send('friendRequestRejected', {
                    target: { id: friendRequest.id },
                  });

                  return dispatch(removeFriendRequest(friendRequest.id));
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="flex w-full h-full justify-center items-center">
          <div className="flex flex-col w-full h-full justify-center items-center">
            <div className="flex justify-center items-center text-lg my-3">
              You have no friend requests.
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FriendRequests;
