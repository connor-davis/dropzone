import { createSlice } from '@reduxjs/toolkit';

let messagesSlice = createSlice({
  name: 'messages',
  initialState: {
    messages: [],
  },
  reducers: {
    addMessage: (state, action) => {
      state.messages = [...state.messages, action.payload];
    },
    readMessage: (state, action) => {
      state.messages = [
        ...state.messages.map((message) => {
          if (message.messageId === action.payload)
            return { ...message, messageRead: true };
          else return message;
        }),
      ];
    },
  },
});

let { addMessage, readMessage } = messagesSlice.actions;

let getMessages = (state) => state.messagesReducer.messages;

export { messagesSlice, addMessage, readMessage, getMessages };
