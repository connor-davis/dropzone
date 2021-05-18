import { createSlice } from '@reduxjs/toolkit';

let zonesSlice = createSlice({
  name: 'zones',
  initialState: {
    zone: {},
    zones: [],
  },
  reducers: {
    addZone: (state, action) => {
      state.zones = [...state.zones, action.payload];
    },
    removeZone: (state, action) => {
      state.zones = [
        ...state.zones.filter((zone) => zone.zoneId !== action.payload),
      ];
    },
    activateZone: (state, action) => {
      state.zone = {
        ...state.zones.filter((zone) => zone.zoneId === action.payload)[0],
      };
    },
  },
});

let { addZone, removeZone, activateZone } = zonesSlice.actions;

let getZoneInfo = (state) => state.zonesReducer.zone;
let getZones = (state) => state.zonesReducer.zones;

export { zonesSlice, addZone, removeZone, activateZone, getZoneInfo, getZones };
