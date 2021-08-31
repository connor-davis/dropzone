/* eslint-disable react-hooks/exhaustive-deps */

import { ContextMenu, ContextMenuTrigger, MenuItem } from 'react-contextmenu';
import React, { useCallback, useEffect, useState } from 'react';

import Navbar from '../navbar';
import { useDropzone } from 'react-dropzone';

let LocalZone = ({ zone, setZone }) => {
  let [renamingItemValue, setRenamingItemValue] = useState('');
  let [timeoutID, setTimeoutID] = useState();
  let [acceptedFiles, setAcceptedFiles] = useState([]);

  let [zoneDownloads, setZoneDownloads] = useState([]);
  let [zoneUploads, setZoneUploads] = useState([]);

  let onDrop = useCallback((acceptedFiles) => {
    setAcceptedFiles(acceptedFiles);
  }, []);
  let { getRootProps, getInputProps } = useDropzone({ onDrop });

  useEffect(() => {
    acceptedFiles.forEach((file) => {
      window.send('createLocal', {
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

  useEffect(() => {
    zone.zoneFileStructure.map((item) => {
      window.on(`${item.id}-downloadProgress`, (progress) => {
        setZoneDownloads((old) => [
          ...old.filter(({ item: o }) => o.id !== item.id),
          { item, progress },
        ]);
      });

      window.on(`${item.id}-uploadProgress`, (progress) => {
        setZoneUploads((old) => [
          ...old.filter(({ item: o }) => o.id !== item.id),
          { item, progress },
        ]);
      });

      return item;
    });

    return () => {};
  }, [zone]);

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
            window.send('createLocal', {
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
        <div
          className="w-full h-full outline-none"
          {...getRootProps()}
          onClick={() => {}}
        >
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
                    item.name &&
                    !item.name.endsWith('.dropzone') && (
                      <div key={item.id}>
                        <ContextMenuTrigger
                          id={`${item.id}-contextMenu`}
                          attributes={{
                            className:
                              'hover:bg-gray-300 dark:hover:bg-gray-800',
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
                                    zoneFileStructure:
                                      old.zoneFileStructure.map((i) => {
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
                                  window.send('unlinkLocal', {
                                    displayName: zone.zoneOwner.displayName,
                                    path:
                                      zone.zonePreviousDirectory +
                                      item.name +
                                      '.droplet',
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
                                      window.send('renameLocal', {
                                        displayName: zone.zoneOwner.displayName,
                                        path: zone.zonePreviousDirectory,
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
                          </div>
                        </ContextMenuTrigger>
                      </div>
                    )
                  );
                })}
          </ContextMenuTrigger>
        </div>
      </div>
      <div className="flex flex-col w-2/5 h-full">
        <div className="flex flex-col w-full h-1/2">
          <Navbar
            title={
              zoneDownloads.filter(({ progress }) => progress.percentage < 100)
                .length > 0
                ? `Downloads (${
                    zoneDownloads.filter(
                      ({ progress }) => progress.percentage < 100
                    ).length
                  })`
                : 'Downloads'
            }
            backButton={false}
          />

          <div className="flex flex-col w-full h-full overflow-y-auto">
            {zoneDownloads &&
              zoneDownloads.length > 0 &&
              zoneDownloads
                .sort((a, b) => {
                  if (a.progress.percentage > b.progress.percentage) return -1;
                  if (a.progress.percentage < b.progress.percentage) return 1;
                  return 0;
                })
                .map(({ item, progress }) => (
                  <div className="flex justify-between items-center border-b border-gray-300 dark:border-gray-800 px-2 py-3">
                    <div className="flex items-center">
                      <div className="text-xss">{item.name}</div>
                    </div>
                    {progress.percentage < 100 ? (
                      <div className="flex justify-center items-center ml-auto">
                        <div className="flex ml-1 text-green-500 text-xss">
                          {`${progress.loaded}/${progress.total}`}
                        </div>
                        <div className="flex ml-1 text-green-500 text-xss">
                          {progress > 0 && `${progress}%`}
                        </div>
                        <div className="flex ml-1 text-green-500 text-xss">
                          {progress.eta}
                        </div>
                        <div className="flex ml-1 text-green-500 text-xss">
                          {progress.speed !== '' && `${progress.speed}/s`}
                        </div>
                      </div>
                    ) : (
                      <div className="flex ml-1 text-green-500 text-xss">
                        Completed
                      </div>
                    )}
                  </div>
                ))}
          </div>
        </div>
        <div className="flex flex-col w-full h-1/2 border-t border-gray-300 dark:border-gray-800">
          <Navbar
            title={
              zoneUploads.filter(({ progress }) => progress.percentage < 100)
                .length > 0
                ? `Uploads (${
                    zoneUploads.filter(
                      ({ progress }) => progress.percentage < 100
                    ).length
                  })`
                : 'Uploads'
            }
            backButton={false}
          />

          <div className="flex flex-col w-full h-full overflow-y-auto">
            {zoneUploads &&
              zoneUploads.length > 0 &&
              zoneUploads
                .sort((a, b) => {
                  if (a.progress.percentage > b.progress.percentage) return -1;
                  if (a.progress.percentage < b.progress.percentage) return 1;
                  return 0;
                })
                .map(({ item, progress }) => (
                  <div className="flex justify-between items-center border-b border-gray-300 dark:border-gray-800 px-2 py-3">
                    <div className="flex items-center">
                      <div className="text-xss">{item.name}</div>
                    </div>
                    {progress.percentage < 100 ? (
                      <div className="flex justify-center items-center ml-auto">
                        <div className="flex ml-1 text-green-500 text-xss">
                          {`${progress.loaded}/${progress.total}`}
                        </div>
                        <div className="flex ml-1 text-green-500 text-xss">
                          {progress > 0 && `${progress}%`}
                        </div>
                        <div className="flex ml-1 text-green-500 text-xss">
                          {progress.eta}
                        </div>
                        <div className="flex ml-1 text-green-500 text-xss">
                          {progress.speed !== '' && `${progress.speed}/s`}
                        </div>
                      </div>
                    ) : (
                      <div className="flex ml-1 text-green-500 text-xss">
                        Completed
                      </div>
                    )}
                  </div>
                ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocalZone;
