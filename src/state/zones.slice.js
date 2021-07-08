import { createSlice } from '@reduxjs/toolkit';

const zonesSlice = createSlice({
  name: 'zones',
  initialState: {
    zones: [],
  },
  reducers: {
    addZone: (state, action) => {
      state.zones = [
        ...state.zones.filter((zone) => zone.id !== action.payload.id),
        action.payload,
      ];
    },
    removeZone: (state, action) => {
      state.zones = [
        ...state.zones.filter((zone) => zone.id !== action.payload),
      ];
    },
  },
});

const { addZone, removeZone } = zonesSlice.actions;

const getZones = (state) => state.zonesReducer.zones;

export { zonesSlice, addZone, removeZone, getZones };
