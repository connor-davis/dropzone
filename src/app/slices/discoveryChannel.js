import { createSlice } from '@reduxjs/toolkit'

const discoveryChannelSlice = createSlice({
    name: 'discoveryChannel',
    initialState: {
        discoveryChannel: undefined,
    },
    reducers: {
        setDiscoveryChannel: (state, action) => {
            state.discoveryChannel = action.payload
        },
    },
})

const { setDiscoveryChannel } = discoveryChannelSlice.actions

const getDiscoveryChannel = (state) =>
    state.discoveryChannelReducer.discoveryChannel

export { discoveryChannelSlice, setDiscoveryChannel, getDiscoveryChannel }
