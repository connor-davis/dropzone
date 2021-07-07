import React, { useState } from 'react';

import { getUserInfo } from '../state/user.slice';
import { useSelector } from 'react-redux';

let AddFriend = () => {
  let userInfo = useSelector(getUserInfo);
  let [username, setUsername] = useState('');
  
  return (
    <div className="flex w-full h-full justify-center items-center">
      <div className="flex flex-col w-full h-full justify-center items-center">
        <div className="flex w-auto h-auto p-2 border-l border-t border-r border-b border-gray-300 dark:border-gray-800 space-x-2 rounded-md">
          <input
            type="text"
            placeholder="Username"
            onChange={({ target: { value } }) => setUsername(value)}
            className="outline-none border-l border-t border-r border-b border-gray-300 dark:border-gray-800 p-2 rounded-md bg-gray-800"
          />

          <div
            className="flex justify-center items-center bg-yellow-500 text-white px-3 py-2 rounded-md cursor-pointer"
            onClick={() => {
              if (username !== '')
                window.send('performFriendRequest', {
                  target: { username },
                  self: userInfo,
                });
            }}
          >
            Add
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddFriend;
