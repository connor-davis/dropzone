import { createSlice } from '@reduxjs/toolkit'

let friendsSlice = createSlice({
    name: 'friends',
    initialState: {
        friends: [],
    },
    reducers: {
        addFriend: (state, action) => {
            state.friends = [...state.friends, action.payload]
        },
        removeFriend: (state, action) => {
            state.friends = [
                ...state.friends.filter(
                    (friend) => friend.id !== action.payload
                ),
            ]
        },
    },
})

let { addFriend, removeFriend } = friendsSlice.actions

let getFriends = (state) => state.friendsReducer.friends

export { friendsSlice, addFriend, removeFriend, getFriends }
