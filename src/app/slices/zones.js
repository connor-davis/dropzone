import { createSlice } from '@reduxjs/toolkit'

let zonesSlice = createSlice({
    name: 'zones',
    initialState: {
        zones: [],
    },
    reducers: {
        addZone: (state, action) => {
            state.zones = [...state.zones, action.payload]
        },
        removeZone: (state, action) => {
            state.zones = [
                ...state.zones.filter((zone) => zone.zoneId !== action.payload),
            ]
        },
    },
})

let { addZone, removeZone } = zonesSlice.actions

let getZones = (state) => state.zonesReducer.zones

export { zonesSlice, addZone, removeZone, getZones }
