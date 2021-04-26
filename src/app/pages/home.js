import React, { useEffect } from 'react';

import ChatPopover from '../components/ChatPopover';
import DownloadsPopover from '../components/DownloadsPopover';
import UploadsPopover from '../components/UploadsPopover';
import { getUserInfo } from '../slices/user';
import { useDropzone } from 'react-dropzone';
import { useSelector } from 'react-redux';

let HomePage = () => {
    let user = useSelector(getUserInfo);

    let { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: (acceptedFiles) => {
            acceptedFiles.forEach(({ path, name, size, type }) =>
                window.uploadFile({ path, information: { name, size, type } })
            );
        },
    });

    useEffect(() => {
        window.joinChannel(user.channel);
    }, [user.channel]);

    return (
        <div className="flex flex-col w-screen h-screen select-none text-gray-500 dark:bg-black dark:text-white outline-none">
            <div className="flex flex-row justify-between items-center p-2 bg-gray-100 border-b border-gray-200 dark:bg-black dark:border-gray-800">
                <div className="text-gray-500 dark:text-gray-200 text-xl">
                    DropZone
                </div>
                <div className="flex flex-row items-center space-x-6 mr-3">
                    <UploadsPopover />

                    <DownloadsPopover />

                    <ChatPopover />

                    {/* <div className="flex flex-row justify-center items-center rounded-full w-8 h-8 cursor-pointer hover:bg-gray-300 relative dark:hover:bg-gray-800 transition duration-500 ease-in-out">
                        <svg
                            className="flex-none w-4 h-4 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                        </svg>
                    </div> */}
                </div>
            </div>
            <div className="flex flex-col flex-auto p-3">
                {/* <div className="flex-none w-64 lg:w-1/5 border-r border-gray-200 dark:bg-black dark:border-gray-800">
                    Hello
                </div> */}
                <div
                    {...getRootProps()}
                    className="flex flex-auto justify-center items-center rounded-lg border-l-2 border-t-2 border-r-2 border-b-2 border-dashed border-gray-300 dark:border-gray-800 outline-none hover:border-blue-400 focus:border-blue-500 cursor-pointer transition duration-500 ease-in-out"
                >
                    <input {...getInputProps()} />
                    {isDragActive ? (
                        <p>Drop the files here ...</p>
                    ) : (
                        <p>
                            Drag 'n' drop some files here, or click to select
                            files
                        </p>
                    )}
                </div>
            </div>
            <div className="flex flex-row justify-center items-center p-2 bg-gray-100 border-t border-gray-200 dark:bg-black dark:border-gray-800">
                <div className="text-gray-500 text-sm">2021 @ Connor Davis</div>
            </div>
        </div>
    );
};

export default HomePage;
