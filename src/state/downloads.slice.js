import { createSlice } from '@reduxjs/toolkit';

const downloadsSlice = createSlice({
  name: 'downloads',
  initialState: {
    downloads: [],
  },
  reducers: {
    addDownload: (state, action) => {
      state.downloads = [
        ...state.downloads,
        { ...action.payload, percentage: 0, eta: 0, speed: 0, complete: false },
      ];
    },
    downloadProgress: (state, action) => {
      state.downloads = [
        ...state.downloads.map((download) => {
          if (download.fileIdentity === action.payload.fileIdentity)
            return {
              ...download,
              percentage: action.payload.percentage,
              eta: action.payload.eta,
              speed: action.payload.speed,
            };
          return download;
        }),
      ];
    },
    removeDownload: (state, action) => {
      state.downloads = [
        ...state.downloads.filter(
          (download) => download.fileIdentity !== action.payload
        ),
      ];
    },
    completedDownload: (state, action) => {
      state.downloads = [
        ...state.downloads.map((download) => {
          if (download.fileIdentity === action.payload.fileIdentity)
            return {
              ...download,
              complete: true,
            };
          return download;
        }),
      ];
    },
  },
});

const {
  addDownload,
  downloadProgress,
  removeDownload,
  completedDownload,
} = downloadsSlice.actions;

const getDownloads = (state) => state.downloadsReducer.downloads;

export {
  downloadsSlice,
  addDownload,
  downloadProgress,
  removeDownload,
  completedDownload,
  getDownloads,
};
