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
        window.uploadFile({
          nickname: user.nickname,
          filePath: path,
          fileName: name,
          fileType: type,
          fileSize: size,
        })
      );
    },
  });

  useEffect(() => {
    window.joinChannel(user.channel);
  }, [user.channel]);

  return (
    <div className="flex flex-col w-screen h-screen select-none text-gray-500 dark:bg-black dark:text-white outline-none">
      {user.connected ? (
        <>
          <div className="flex flex-row justify-between items-center p-2 bg-gray-100 border-b border-gray-200 dark:bg-black dark:border-gray-800">
            <div className="text-gray-500 dark:text-gray-200 text-xl">
              DropZone
            </div>
            <div className="flex flex-row items-center space-x-6 mr-3">
              <UploadsPopover />

              <DownloadsPopover />

              <ChatPopover />
            </div>
          </div>
          <div className="flex flex-row flex-auto">
            <div className="flex-none w-64 lg:w-1/5 border-r border-gray-200 dark:bg-black dark:border-gray-800 p-3">
              Hello
            </div>
            <div className="flex flex-col flex-auto p-3">
              <div
                {...getRootProps()}
                className="flex flex-col flex-auto justify-center items-center rounded-lg border-l-2 border-t-2 border-r-2 border-b-2 border-dashed border-gray-300 dark:border-gray-800 outline-none hover:border-blue-400 focus:border-blue-500 cursor-pointer transition duration-500 ease-in-out"
              >
                <input {...getInputProps()} />
                {isDragActive ? (
                  <p>Drop the files here ...</p>
                ) : (
                  <p>Drag 'n' drop some files here, or click to select files</p>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-row flex-auto">
          <div className="flex flex-col flex-auto justify-center items-center">
            <div className="flex flex-col items-center rounded-xl p-3">
              Waiting for connection...
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-row justify-center items-center p-2 bg-gray-100 border-t border-gray-200 dark:bg-black dark:border-gray-800">
        <div className="text-gray-500 text-sm">2021 @ Connor Davis</div>
      </div>
    </div>
  );
};

export default HomePage;
