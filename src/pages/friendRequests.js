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
      {friendRequests &&
        friendRequests.map((friendRequest) => (
          <div key={friendRequest.id}>
            {friendRequest.firstName + ' ' + friendRequest.lastName} @{' '}
            {friendRequest.username} wants to be your friend.{' '}
            <div className="flex items-center space-x-2">
              <div
                onClick={() => {
                  window.send('friendRequestAccepted', {
                    self: userInfo,
                    target: friendRequest,
                  });

                  dispatch(removeFriendRequest(friendRequest.id));
                }}
              >
                Accept
              </div>
              <div
                onClick={() => {
                  window.send('friendRequestRejected', {
                    target: { id: friendRequest.id },
                  });

                  dispatch(removeFriendRequest(friendRequest.id));
                }}
              >
                Reject
              </div>
            </div>
          </div>
        ))}
    </>
  );
};

export default FriendRequests;
