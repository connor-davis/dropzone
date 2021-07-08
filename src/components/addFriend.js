import React, { useState } from 'react';

import { getFriends } from '../state/friends.slice';
import { getUserInfo } from '../state/user.slice';
import { useHistory } from 'react-router';
import { useSelector } from 'react-redux';

let AddFriend = () => {
  let router = useHistory();

  let userInfo = useSelector(getUserInfo);
  let friends = useSelector(getFriends);

  let [username, setUsername] = useState('');

  return (
    <div className="flex w-full h-full justify-center items-center">
      <div className="flex flex-col w-full h-full justify-center items-center">
        <div className="flex justify-center items-center text-lg my-3">
          Add A Friend
        </div>

        <div className="flex w-auto h-auto p-2 border-l border-t border-r border-b border-gray-300 dark:border-gray-800 space-x-2 rounded-md">
          <input
            type="text"
            placeholder="Username"
            onChange={({ target: { value } }) => setUsername(value)}
            className="outline-none border-l border-t border-r border-b border-gray-300 dark:border-gray-800 p-2 rounded-md bg-gray-200 dark:bg-gray-800"
          />

          <div
            className="flex justify-center items-center bg-yellow-500 text-white px-3 py-2 rounded-md cursor-pointer"
            onClick={() => {
              if (username !== '') {
                let friendExists = friends.map((friend) => {
                  if (friend.username === username) return friend;
                })[0];

                if (!friendExists) {
                  router.push('/friendList');
                  return window.send('performFriendRequest', {
                    target: { username },
                    self: userInfo,
                  });
                } else
                  return alert(
                    `You have already added ${username} as a friend.`
                  );
              }
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
