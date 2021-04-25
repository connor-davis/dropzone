import { createSlice } from '@reduxjs/toolkit'

const uploadsSlice = createSlice({
    name: 'uploads',
    initialState: {
        active: [],
        completed: [],
    },
    reducers: {
        addActiveUpload: (state, action) => {
            state.active = [...state.active, { ...action.payload, progress: 0 }]
        },
        activeUploadProgress: (state, action) => {
            state.active = state.active.map((a) => {
                if (a.id === action.payload.id)
                    return { ...a, progress: action.payload.progress }
                return a
            })
        },
        addCompletedUpload: (state, action) => {
            state.active = state.active.filter(
                (a) => a.id !== action.payload.id
            )
            state.completed = [...state.completed, action.payload]
        },
    },
})

const {
    addActiveUpload,
    activeUploadProgress,
    addCompletedUpload,
} = uploadsSlice.actions

const getUploads = (state) => {
    return {
        active: state.uploadsReducer.active,
        completed: state.uploadsReducer.completed,
    }
}

const getActiveUploads = (state) => state.uploadsReducer.active
const getCompletedUploads = (state) => state.uploadsReducer.completed

export {
    uploadsSlice,
    addActiveUpload,
    activeUploadProgress,
    addCompletedUpload,
    getUploads,
    getActiveUploads,
    getCompletedUploads,
}
