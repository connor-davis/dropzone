import { createSlice } from '@reduxjs/toolkit';

let friendsSlice = createSlice({
  name: 'friends',
  initialState: {
    friends: [],
    friendRequests: [],
    blockedFriends: [],
  },
  reducers: {
    addFriend: (state, action) => {
      state.friends = [...state.friends, action.payload];
    },
    removeFriend: (state, action) => {
      state.friends = [
        ...state.friends.filter((friend) => friend.id !== action.payload),
      ];
    },
    addFriendRequest: (state, action) => {
      console.log(action);
      if (state.friendRequests !== [])
        state.friendRequests = [
          ...state.friendRequests.filter(
            (friendRequest) => friendRequest.id !== action.payload.id
          ),
          action.payload,
        ];
      else {
        state.friendRequests = [...state.friendRequests, action.payload];
      }
    },
    removeFriendRequest: (state, action) => {
      state.friendRequests = [
        ...state.friendRequests.filter(
          (friendRequest) => friendRequest.id !== action.payload
        ),
      ];
    },
  },
});

let { addFriend, removeFriend, addFriendRequest, removeFriendRequest } =
  friendsSlice.actions;

let getFriends = (state) => state.friendsReducer.friends;
let getFriendRequests = (state) => state.friendsReducer.friendRequests;
let getBlockedFriends = (state) => state.friendsReducer.blockedFriends;

export {
  friendsSlice,
  addFriend,
  removeFriend,
  addFriendRequest,
  removeFriendRequest,
  getFriends,
  getFriendRequests,
  getBlockedFriends,
};

