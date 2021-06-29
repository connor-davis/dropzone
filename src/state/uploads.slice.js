import { createSlice } from '@reduxjs/toolkit';

const uploadsSlice = createSlice({
  name: 'uploads',
  initialState: {
    uploads: [],
  },
  reducers: {
    addUpload: (state, action) => {
      state.uploads = [
        ...state.uploads,
        { ...action.payload, percentage: 0, eta: 0, speed: 0, complete: false },
      ];
    },
    uploadProgress: (state, action) => {
      state.uploads = [
        ...state.uploads.map((upload) => {
          if (upload.fileIdentity === action.payload.fileIdentity)
            return {
              ...upload,
              percentage: action.payload.percentage,
              speed: action.payload.speed,
              eta: action.payload.eta,
            };
          return upload;
        }),
      ];
    },
    completedUpload: (state, action) => {
      state.uploads = [
        ...state.uploads.map((upload) => {
          if (upload.fileIdentity === action.payload.fileIdentity)
            return { ...upload, complete: true };
          else return upload;
        }),
      ];
    },
  },
});

const { addUpload, uploadProgress, completedUpload } = uploadsSlice.actions;

const getUploads = (state) => state.uploadsReducer.uploads;

export { uploadsSlice, addUpload, uploadProgress, completedUpload, getUploads };
