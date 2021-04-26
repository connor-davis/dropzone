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
                { ...action.payload, progress: 0, complete: false },
            ];
        },
        downloadProgress: (state, action) => {
            state.downloads = [
                ...state.downloads.map((download) => {
                    if (download.id === action.payload.id)
                        return {
                            ...download,
                            progress: action.payload.progress,
                        };
                    return download;
                }),
            ];
        },
        completedDownload: (state, action) => {
            state.downloads = [
                ...state.downloads.map((download) => {
                    if (download.id === action.payload.id)
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
    completedDownload,
} = downloadsSlice.actions;

const getDownloads = (state) => state.downloadsReducer.downloads;

export {
    downloadsSlice,
    addDownload,
    downloadProgress,
    completedDownload,
    getDownloads,
};
