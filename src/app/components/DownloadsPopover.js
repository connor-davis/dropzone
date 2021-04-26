import { Popover } from '@headlessui/react';
import React from 'react';
import { getDownloads } from '../slices/downloads';
import { saveAs } from 'file-saver';
import { useSelector } from 'react-redux';

let DownloadsPopover = () => {
    let downloads = useSelector(getDownloads);

    return (
        <Popover className="relative">
            <Popover.Button className="flex flex-row justify-center items-center rounded-full w-8 h-8 cursor-pointer hover:bg-gray-300 relative dark:hover:bg-gray-800 transition duration-500 ease-in-out dark:border dark:border-gray-800">
                <div className="flex flex-row justify-center items-center px-1 rounded-xl bg-blue-500 text-xs text-white absolute -bottom-1 right-6">
                    {downloads.filter((download) => !download.complete).length >
                    0
                        ? downloads.filter((download) => !download.complete)
                              .length
                        : null}
                </div>
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
                        strokeWidth="2"
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    ></path>
                </svg>
            </Popover.Button>

            <Popover.Panel className="absolute z-10 top-10 -right-0 rounded-xl text-gray-500 dark:text-white cursor-default flex flex-row border-r border-b border-l border-t border-gray-200 dark:border-gray-800">
                <div className="flex flex-col w-72 rounded-xl bg-gray-100 dark:bg-black">
                    {downloads.map((download) => (
                        <div className="flex flex-row w-72 py-2 px-2 justify-center items-center">
                            <div className="relative w-4/5 max-w-4/5 mr-2">
                                <div className="flex mb-2 items-center justify-between">
                                    <p className="w-4/5 max-w-4/5 text-xs font-semibold m-0 py-1 px-2 rounded-full uppercase text-blue-600 bg-blue-200 truncate overflow-hidden">
                                        {download.name}
                                    </p>
                                    <p className="w-1/5 max-w-1/5 text-xs font-semibold m-0 py-1 px-2 uppercase text-blue-600">
                                        {download.complete
                                            ? '100%'
                                            : download.progress < 100
                                            ? download.progress + 1
                                            : download.progress + '%'}
                                    </p>
                                </div>
                                <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                                    <div
                                        style={{
                                            width: download.complete
                                                ? '100%'
                                                : download.progress < 100
                                                ? download.progress + 1
                                                : download.progress + '%',
                                        }}
                                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                                    ></div>
                                </div>
                            </div>
                            <div
                                className="border-l border-t border-r border-b border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white px-2 py-1 rounded-sm cursor-pointer transition duration-500 ease-in-out mr-2"
                                onClick={() =>
                                    download.complete &&
                                    saveAs(download.path, download.name) &&
                                    window.removeFile(download.path)
                                }
                            >
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                                    />
                                </svg>
                            </div>
                        </div>
                    ))}
                    {!downloads.length > 0 && (
                        <div className="flex flex-row justify-center items-center py-3">
                            There are no downloads.
                        </div>
                    )}
                </div>
            </Popover.Panel>
        </Popover>
    );
};

export default DownloadsPopover;
