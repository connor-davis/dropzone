/* eslint-disable react-hooks/exhaustive-deps */

import { ContextMenu, ContextMenuTrigger, MenuItem } from 'react-contextmenu';
import React, { useCallback, useEffect, useState } from 'react';

import { getUserInfo } from '../../state/user.slice';
import { useDropzone } from 'react-dropzone';
import { useSelector } from 'react-redux';

let RemoteZone = ({ zone, setZone }) => {
  let userInfo = useSelector(getUserInfo);

  let [renamingItemValue, setRenamingItemValue] = useState('');
  let [timeoutID, setTimeoutID] = useState();
  let [acceptedFiles, setAcceptedFiles] = useState([]);

  let onDrop = useCallback((acceptedFiles) => {
    setAcceptedFiles(acceptedFiles);

    return () => {};
  }, []);
  let { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  useEffect(() => {
    acceptedFiles.forEach((file) => {
      window.send('createRemote', {
        displayName: zone.zoneOwner.displayName,
        path: zone.zonePreviousDirectory,
        fileName: file.name,
        fileSize: file.size,
        filePath: file.path,
        fileType: file.type,
        type: 'file',
      });
    });

    return () => {};
  }, [acceptedFiles]);

  return (
    <div className="flex w-full h-full">
      <ContextMenu
        id="zoneContextMenu"
        className="flex flex-col bg-gray-100 dark:bg-black border-l border-r border-t border-b border-gray-300 dark:border-gray-800 rounded-md"
      >
        <MenuItem
          data={{ foo: 'bar' }}
          attributes={{
            className:
              'flex items-center border-b border-gray-300 dark:border-gray-800 mb-1 px-2 py-1 hover:text-yellow-500 space-x-2 focus:outline-none cursor-pointer',
          }}
          onClick={() =>
            window.send('createRemote', {
              displayName: zone.zoneOwner.displayName,
              path: zone.zonePreviousDirectory,
              name:
                zone.zoneFileStructure.filter(
                  (item) =>
                    item.name &&
                    item.type === 'directory' &&
                    item.name.includes('New Folder')
                ).length > 0
                  ? `New Folder (${
                      zone.zoneFileStructure.filter(
                        (item) =>
                          item.name &&
                          item.type === 'directory' &&
                          item.name.includes('New Folder')
                      ).length
                    }).droplet`
                  : `New Folder.droplet`,
              type: 'directory',
            })
          }
        >
          <div className="flex justify-center items-center border-l border-t border-r border-b border-gray-300 dark:border-gray-800 rounded-full p-1 cursor-pointer hover:text-yellow-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <div>Create Folder</div>
        </MenuItem>
      </ContextMenu>
      <div className="flex flex-col w-2/3 h-full border-r border-gray-300 dark:border-gray-800">
        <div className="w-full h-full" {...getRootProps()} onClick={() => {}}>
          <input {...getInputProps()} />
          <ContextMenuTrigger
            id="zoneContextMenu"
            attributes={{
              className: 'flex flex-col w-full h-full p-2 pr-20',
            }}
          >
            {zone.zoneFileStructure &&
              zone.zoneFileStructure.length > 0 &&
              zone.zoneFileStructure
                .sort((a, b) => {
                  if (a.type === 'directory' && b.type === 'file') return -1;
                  if (a.type === 'file' && b.type === 'directory') return 1;
                  return 0;
                })
                .map((item) => {
                  return (
                    <Item
                      item={item}
                      zone={zone}
                      setZone={setZone}
                      renamingItemValue={renamingItemValue}
                      setRenamingItemValue={renamingItemValue}
                      timeoutID={timeoutID}
                      setTimeoutID={setTimeoutID}
                    />
                  );
                })}
          </ContextMenuTrigger>
        </div>
      </div>
      <div className="flex flex-col w-1/3 h-full "></div>
    </div>
  );
};

let Item = ({
  zone,
  setZone,
  renamingItemValue,
  setRenamingItemValue,
  timeoutID,
  setTimeoutID,
  item,
}) => {
  let [progress, setProgress] = useState(0);

  useEffect(() => {
    window.on(`${item.id}-downloadProgress`, (progress) =>
      setProgress(Math.ceil((progress.loaded / progress.total) * 100))
    );

    return () => {};
  }, []);

  return (
    item.name &&
    !item.name.endsWith('.dropzone') && (
      <div key={item.id}>
        <ContextMenuTrigger
          id={`${item.id}-contextMenu`}
          attributes={{
            className: 'hover:bg-gray-300 dark:hover:bg-gray-800',
          }}
        >
          <div
            key={item.id}
            className="flex justify-between items-center border-b border-gray-300 dark:border-gray-800 px-2 py-1"
            onMouseDown={() => {
              let t = setTimeout(() => {
                setZone((old) => {
                  return {
                    ...old,
                    zoneFileStructure: old.zoneFileStructure.map((i) => {
                      if (i.id === item.id) {
                        setRenamingItemValue(i.name);
                        return {
                          ...i,
                          renaming: true,
                        };
                      }
                      return i;
                    }),
                  };
                });
              }, 1000);

              setTimeoutID(t);
            }}
            onMouseUp={() => {
              clearTimeout(timeoutID);
            }}
          >
            <ContextMenu
              id={`${item.id}-contextMenu`}
              className="flex flex-col bg-gray-100 dark:bg-black border-l border-r border-t border-b border-gray-300 dark:border-gray-800 rounded-md"
            >
              <MenuItem
                data={{ foo: 'bar' }}
                attributes={{
                  className:
                    'flex items-center px-2 py-1 hover:text-red-500 space-x-2 focus:outline-none cursor-pointer',
                }}
                onClick={() => {
                  window.send('download', {
                    id: item.id,
                    name: item.name,
                    path: item.meta.path,
                  });
                }}
              >
                <div className="flex justify-center items-center border-l border-t border-r border-b border-gray-300 dark:border-gray-800 rounded-full p-1 cursor-pointer hover:text-yellow-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                    />
                  </svg>
                </div>
                <div>Download</div>
              </MenuItem>
              <MenuItem
                data={{ foo: 'bar' }}
                attributes={{
                  className:
                    'flex items-center px-2 py-1 hover:text-red-500 space-x-2 focus:outline-none cursor-pointer',
                }}
                onClick={() => {
                  window.send('unlinkRemote', {
                    displayName: zone.zoneOwner.displayName,
                    root: item.root,
                    name: item.name,
                  });
                }}
              >
                <div className="flex justify-center items-center border-l border-t border-r border-b border-gray-300 dark:border-gray-800 rounded-full p-1 cursor-pointer hover:text-red-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </div>
                <div>Delete</div>
              </MenuItem>
            </ContextMenu>
            <div className="flex items-center space-x-2">
              <div>
                {item.type === 'directory' ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-yellow-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                )}
              </div>
              {item.renaming ? (
                <input
                  id={`${item.id}-nameInput`}
                  type="text"
                  className="bg-transparent focus:outline-none text-sm"
                  value={renamingItemValue}
                  onFocus={({ target }) => {
                    target.select();
                  }}
                  onChange={({ target: { value } }) =>
                    setRenamingItemValue(value)
                  }
                  onKeyUp={({ key }) => {
                    if (key === 'Enter') {
                      window.send('renameRemote', {
                        displayName: zone.zoneOwner.displayName,
                        root: item.root,
                        name: item.name,
                        newName: renamingItemValue,
                      });
                    }
                  }}
                  autoFocus
                />
              ) : (
                <div className="text-sm">{item.name}</div>
              )}
            </div>
            <div className="flex justify-center items-center ml-auto">
              {progress > 0 && (
                <div class="w-24 h-2 relative max-w-xl rounded-full overflow-hidden">
                  <div class="w-full h-full bg-gray-200 absolute"></div>
                  <div
                    id="bar"
                    style={{ width: progress + '%' }}
                    class="h-full bg-green-500 relative w-0"
                  ></div>
                </div>
              )}
            </div>
          </div>
        </ContextMenuTrigger>
      </div>
    )
  );
};

export default RemoteZone;
