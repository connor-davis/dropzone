import { createSlice } from '@reduxjs/toolkit';

const zoneRequestsSlice = createSlice({
  name: 'zoneRequests',
  initialState: {
    zoneRequests: [],
  },
  reducers: {
    addZoneRequest: (state, action) => {
      state.zoneRequests = [
        ...state.zoneRequests.filter(
          (zoneRequest) => zoneRequest.id !== action.payload.id
        ),
        action.payload,
      ];
    },
    removeZoneRequest: (state, action) => {
      console.log(action);
      state.zoneRequests = [
        ...state.zoneRequests.filter(
          (zoneRequest) => zoneRequest.id !== action.payload
        ),
      ];
    },
  },
});

const { addZoneRequest, removeZoneRequest } = zoneRequestsSlice.actions;

const getZoneRequests = (state) => state.zoneRequestsReducer.zoneRequests;

export {
  zoneRequestsSlice,
  addZoneRequest,
  removeZoneRequest,
  getZoneRequests,
};
