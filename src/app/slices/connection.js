import { createSlice } from '@reduxjs/toolkit'

const connectionSlice = createSlice({
    name: 'connection',
    initialState: {
        connected: false,
        peers: new Set(),
    },
    reducers: {
        setConnected: (state, action) => {
            state.connected = action.payload
        },
        add: (state, action) => {
            state.peers.add(action.payload)
        },
        remove: (state, action) => {
            state.peers.delete(action.payload)
        },
    },
})

const { setConnected, add, remove } = connectionSlice.actions

const isConnected = (state) => state.connectionReducer.connected

export { connectionSlice, setConnected, add, remove, isConnected }
