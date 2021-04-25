import { createSlice } from '@reduxjs/toolkit'

const downloadsSlice = createSlice({
    name: 'downloads',
    initialState: {
        active: [],
        completed: [],
    },
    reducers: {
        addActiveDownload: (state, action) => {
            state.active = [...state.active, { ...action.payload, progress: 0 }]
        },
        activeDownloadProgress: (state, action) => {
            state.active = [
                ...state.active.map((a) => {
                    if (a.id === action.payload.id)
                        return { ...a, progress: action.payload.progress }
                    return a
                }),
            ]
        },
        addCompletedDownload: (state, action) => {
            state.active = state.active.filter(
                (a) => a.id !== action.payload.id
            )
            state.completed = [...state.completed, action.payload]
        },
    },
})

const {
    addActiveDownload,
    activeDownloadProgress,
    addCompletedDownload,
} = downloadsSlice.actions

const getDownloads = (state) => {
    return {
        active: state.downloadsReducer.active,
        completed: state.downloadsReducer.completed,
    }
}

const getActiveDownloads = (state) => state.downloadsReducer.active
const getCompletedDownloads = (state) => state.downloadsReducer.completed

export {
    downloadsSlice,
    addActiveDownload,
    activeDownloadProgress,
    addCompletedDownload,
    getDownloads,
    getActiveDownloads,
    getCompletedDownloads,
}
