import { Dialog, Transition } from '@headlessui/react';
import React, { useEffect, useState } from 'react';
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
import { getUserInfo, setUserConnected } from './app/slices/user';
import { useDispatch, useSelector } from 'react-redux';

import HomePage from './app/pages/home';
import JoinPage from './app/pages/join';
import { addMessage } from './app/slices/messages';
import store from './app/store';

let App = () => {
    let dispatch = useDispatch();
    let user = useSelector(getUserInfo);
    let [alerts, setAlerts] = useState([]);
    let [transferRequests, setTransferRequests] = useState([]);

    useEffect(() => {
        window.disconnect();

        window.on('packet', (packet) => {
            let uploads = getUploads(store.getState());
            let downloads = getDownloads(store.getState());

            console.log(packet);

            if (packet && packet.type) {
                switch (packet.type) {
                    /**
                     * Information Sent By DropZone
                     */
                    case 'info':
                        setAlerts((old) => [...(old || []), packet]);

                        setTimeout(() => {
                            setAlerts(alerts.shift());
                        }, 5000);

                        break;

                    /**
                     * Transfer Request
                     */
                    case 'transferRequest':
                        setTransferRequests((old) => [
                            ...old,
                            {
                                ...packet,
                                show: old.length === 0,
                            },
                        ]);
                        break;

                    /**
                     * Joined Channel
                     */
                    case 'peer':
                        dispatch(setUserConnected(true));
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
                                    (upload) =>
                                        upload.fileIdentity ===
                                        packet.fileIdentity
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
                                    (download) =>
                                        download.fileIdentity ===
                                        packet.fileIdentity
                                )[0],
                            })
                        );
                        break;

                    default:
                        break;
                }
            }
        });

        window.on('disconnected', dispatch(setUserConnected(false)));

        window.on('deleted', (id) => {
            dispatch(removeDownload(id));
        });
    }, []);

    return (
        <>
            <div className="flex flex-col w-96 p-2 absolute top-12 right-0">
                {alerts &&
                    alerts.map((alert) => (
                        <Transition
                            show={true}
                            as={React.Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="flex-auto bg-green-200 text-green-500 border-green-300 p-2 rounded-md mb-1">
                                {alert.message}
                            </div>
                        </Transition>
                    ))}
            </div>
            {transferRequests.map((request) => (
                <Transition show={request.show} as={React.Fragment}>
                    <Dialog
                        as="div"
                        className="fixed inset-0 z-10 overflow-y-auto"
                        static
                        open={request.show}
                        onClose={() => {}}
                    >
                        <div className="min-h-screen px-4 text-center">
                            <Transition.Child
                                as={React.Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <Dialog.Overlay className="fixed inset-0 bg-black opacity-70" />
                            </Transition.Child>

                            <span
                                className="inline-block h-screen align-middle"
                                aria-hidden="true"
                            >
                                &#8203;
                            </span>
                            <Transition.Child
                                as={React.Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <div className="inline-block w-full max-w-md p-3 my-8 overflow-hidden text-left align-middle transition-all transform bg-gray-100 dark:bg-black shadow-xl rounded-2xl border-l border-t border-r border-b border-gray-300 dark:border-gray-800">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-gray-900 dark:text-white"
                                    >
                                        Transfer Request
                                    </Dialog.Title>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {request.message}
                                        </p>
                                    </div>

                                    <div className="mt-4">
                                        <button
                                            type="button"
                                            className="inline-flex justify-center px-4 py-2 text-sm font-medium text-green-900 bg-green-100 border border-transparent rounded-md hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500 mr-2"
                                            onClick={() => {
                                                setTransferRequests((old) => [
                                                    ...old
                                                        .filter(
                                                            (o) =>
                                                                o.fileIdentity !==
                                                                request.fileIdentity
                                                        )
                                                        .map((o) => {
                                                            if (
                                                                old.indexOf(
                                                                    o
                                                                ) === 0
                                                            )
                                                                return {
                                                                    ...o,
                                                                    show: true,
                                                                };
                                                            else return o;
                                                        }),
                                                ]);

                                                window.acceptTransfer(request);
                                            }}
                                        >
                                            Accept
                                        </button>

                                        <button
                                            type="button"
                                            className="inline-flex justify-center px-4 py-2 text-sm font-medium text-red-900 bg-red-100 border border-transparent rounded-md hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500"
                                            onClick={() => {
                                                setTransferRequests((old) => [
                                                    ...old
                                                        .filter(
                                                            (o) =>
                                                                o.fileIdentity !==
                                                                request.fileIdentity
                                                        )
                                                        .map((o) => {
                                                            if (
                                                                old.indexOf(
                                                                    o
                                                                ) === 0
                                                            )
                                                                return {
                                                                    ...o,
                                                                    show: true,
                                                                };
                                                            else return o;
                                                        }),
                                                ]);

                                                window.rejectTransfer(request);
                                            }}
                                        >
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            </Transition.Child>
                        </div>
                    </Dialog>
                </Transition>
            ))}
            {user.nickname ? <HomePage /> : <JoinPage />}
        </>
    );
};

export default App;
