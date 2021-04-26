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
                { ...action.payload, progress: 0, complete: false },
            ];
        },
        uploadProgress: (state, action) => {
            state.uploads = [
                ...state.uploads.map((upload) => {
                    if (upload.id === action.payload.id)
                        return {
                            ...upload,
                            progress: action.payload.progress,
                        };
                    return upload;
                }),
            ];
        },
        completedUpload: (state, action) => {
            state.uploads = [
                ...state.uploads.map((upload) => {
                    if (upload.id === action.payload.id)
                        return {
                            ...upload,
                            complete: true,
                        };
                    return upload;
                }),
            ];
        },
    },
});

const { addUpload, uploadProgress, completedUpload } = uploadsSlice.actions;

const getUploads = (state) => state.uploadsReducer.uploads;

export { uploadsSlice, addUpload, uploadProgress, completedUpload, getUploads };
