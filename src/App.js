import React, { useCallback, useEffect } from 'react';
import {
    addDownload,
    completedDownload,
    downloadProgress,
    getDownloads,
    removeDownload,
} from './app/slices/downloads';
import {
    addUpload,
    completedUpload,
    getUploads,
    uploadProgress,
} from './app/slices/uploads';
import { useDispatch, useSelector } from 'react-redux';

import HomePage from './app/pages/home';
import JoinPage from './app/pages/join';
import { addMessage } from './app/slices/messages';
import { getUserInfo } from './app/slices/user';
import store from './app/store';

let App = () => {
    let dispatch = useDispatch();
    let user = useSelector(getUserInfo);

    let listenPackets = useCallback(() => {
        /**
         * Packets Sent By DropZone
         */
        window.on('packet', (packet) => {
            let uploads = getUploads(store.getState());
            let downloads = getDownloads(store.getState());

            switch (packet.type) {
                /**
                 * Information Sent By DropZone
                 */
                case 'info':
                    console.log(packet.message);
                    break;

                /**
                 * Joined Channel
                 */
                case 'peer':
                    alert('Peer: ' + packet.identity + '.');
                    break;

                /**
                 * Message Packets
                 */
                case 'message':
                    dispatch(addMessage(packet));
                    break;

                /**
                 * Uploads Logic
                 */
                case 'start-upload':
                    dispatch(addUpload(packet));
                    break;

                case 'progress-upload':
                    dispatch(uploadProgress(packet));
                    break;

                case 'finish-upload':
                    dispatch(
                        completedUpload({
                            ...uploads.filter(
                                (upload) => upload.id === packet.id
                            )[0],
                        })
                    );
                    break;

                /**
                 * Downloads Logic
                 */
                case 'start-download':
                    dispatch(addDownload(packet));
                    break;

                case 'progress-download':
                    dispatch(downloadProgress(packet));
                    break;

                case 'finish-download':
                    dispatch(
                        completedDownload({
                            ...downloads.filter(
                                (download) => download.id === packet.id
                            )[0],
                        })
                    );
                    break;

                default:
                    break;
            }
        });
    }, [dispatch]);

    useEffect(() => {
        window.disconnect();
        listenPackets();

        window.on('deleted', (id) => {
            dispatch(removeDownload(id));
        });
    }, [listenPackets]);

    return user.nickname ? <HomePage /> : <JoinPage />;
};

export default App;
