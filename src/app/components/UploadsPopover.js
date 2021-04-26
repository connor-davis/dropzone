import { Popover } from '@headlessui/react';
import React from 'react';
import { getUploads } from '../slices/uploads';
import { useSelector } from 'react-redux';

let UploadsPopover = () => {
    let uploads = useSelector(getUploads);

    return (
        <Popover className="relative">
            <Popover.Button className="flex flex-row justify-center items-center rounded-full w-8 h-8 cursor-pointer hover:bg-gray-300 relative dark:hover:bg-gray-800 transition duration-500 ease-in-out dark:border dark:border-gray-800">
                <div className="flex flex-row justify-center items-center px-1 rounded-xl bg-blue-500 text-xs text-white absolute -bottom-1 right-6">
                    {uploads.filter((upload) => !upload.complete).length > 0
                        ? uploads.filter((upload) => !upload.complete).length
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
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                    ></path>
                </svg>
            </Popover.Button>

            <Popover.Panel className="absolute z-10 top-10 -right-0 rounded-xl text-gray-500 dark:text-white cursor-default flex flex-row border-r border-b border-l border-t border-gray-200 dark:border-gray-800">
                <div className="flex flex-col w-72 rounded-xl bg-gray-100 dark:bg-black">
                    {uploads.map((upload) => (
                        <div className="flex flex-row">
                            <div className="relative pt-1 w-72 p-2">
                                <div className="flex mb-2 items-center justify-between">
                                    <p className="w-4/5 text-xs font-semibold m-0 py-1 px-2 rounded-full uppercase text-blue-600 bg-blue-200 truncate overflow-hidden">
                                        {upload.fileName}
                                    </p>
                                    <p className="w-1/5 text-xs font-semibold m-0 py-1 px-2 uppercase text-blue-600">
                                        {upload.complete
                                            ? '100%'
                                            : upload.progress + '%'}
                                    </p>
                                </div>
                                <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                                    <div
                                        style={{
                                            width: upload.complete
                                                ? '100%'
                                                : upload.progress + '%',
                                        }}
                                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                                    ></div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {!uploads.length > 0 && (
                        <div className="flex flex-row justify-center items-center py-3">
                            There are no uploads.
                        </div>
                    )}
                </div>
            </Popover.Panel>
        </Popover>
    );
};

export default UploadsPopover;
