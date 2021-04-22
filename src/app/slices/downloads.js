import { createSlice } from '@reduxjs/toolkit'

const downloadsSlice = createSlice({
    name: 'downloads',
    initialState: {
        downloads: [],
    },
    reducers: {
        addDownloadChunk: (state, action) => {
            state.downloads = [...state.downloads, action.payload]
        },
        addDownloadProgress: (state, action) => {
            state.downloads = state.downloads.map((download) => {
                if (download.id === action.payload.uploadID)
                    return {
                        ...download,
                        progress: action.payload.fileProgress,
                    }
            })
        },
    },
})

const { addDownloadChunk, addDownloadProgress } = downloadsSlice.actions

const getDownloads = (state) => state.downloadsReducer.downloads

export { downloadsSlice, addDownloadChunk, addDownloadProgress, getDownloads }
