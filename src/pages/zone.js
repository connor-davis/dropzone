/* eslint-disable react-hooks/exhaustive-deps */

import { ContextMenu, ContextMenuTrigger, MenuItem } from 'react-contextmenu';
import React, { useEffect, useState } from 'react';

import Navbar from '../components/navbar';
import { getUserInfo } from '../state/user.slice';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { v4 } from 'uuid';

let ZonePage = ({ navbar = true }) => {
  let router = useHistory();

  let userInfo = useSelector(getUserInfo);

  let [zone, setZone] = useState({});
  let [renamingItemValue, setRenamingItemValue] = useState('');

  useEffect(() => {
    let publicKey =
      router.location.pathname.split('/')[1] ||
      router.location.pathname.split('/')[2];

    window.send('getUserZone', { publicKey });

    window.on('userZone', (zone) => {
      setZone(zone);
    });
  }, []);

  let renameItem = (id) => {
    setZone((old) => {
      return {
        ...old,
        zoneFileStructure: old.zoneFileStructure.map((item) => {
          if (item.id === id) {
            setRenamingItemValue(item.name);
            return { ...item, renaming: true };
          }
          return item;
        }),
      };
    });
  };

  return zone.zoneOwner ? (
    <div className="flex flex-col w-full h-full">
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
          onClick={() => {
            window.send('setUserZone', {
              ...zone,
              zoneFileStructure: [
                ...zone.zoneFileStructure,
                {
                  id: v4(),
                  type: 'folder',
                  name: 'New Folder',
                },
              ],
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
                d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <div>Create Folder</div>
        </MenuItem>
        <MenuItem
          data={{ foo: 'bar' }}
          attributes={{
            className:
              'flex items-center px-2 py-1 hover:text-yellow-500 space-x-2 focus:outline-none cursor-pointer',
          }}
          onClick={() => {
            window.send('setUserZone', {
              ...zone,
              zoneFileStructure: [
                ...zone.zoneFileStructure,
                {
                  id: v4(),
                  type: 'file',
                  name: 'New File',
                },
              ],
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
                d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <div>Create File</div>
        </MenuItem>
        {/* <MenuItem
          data={{ foo: 'bar' }}
          attributes={{
            className:
              'flex items-center border-b border-gray-300 dark:border-gray-800 mb-1 px-2 py-1 hover:text-yellow-500 space-x-2 focus:outline-none cursor-pointer',
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
                d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <div>Import Folder</div>
        </MenuItem>
        <MenuItem
          data={{ foo: 'bar' }}
          attributes={{
            className:
              'flex items-center px-2 py-1 hover:text-yellow-500 space-x-2 focus:outline-none cursor-pointer',
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
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <div>Import File</div>
        </MenuItem> */}
      </ContextMenu>

      {navbar && (
        <Navbar
          title={
            zone.zoneOwner.username === userInfo.username
              ? 'Your Zone'
              : `${zone.zoneOwner.firstName} ${zone.zoneOwner.lastName}'s Zone`
          }
          backButton={true}
        ></Navbar>
      )}

      <div className="flex w-full h-full">
        <div className="flex flex-col w-2/3 h-full border-r border-gray-300 dark:border-gray-800">
          <ContextMenuTrigger
            id="zoneContextMenu"
            attributes={{
              className: 'flex flex-col w-full h-full',
            }}
          >
            {zone.zoneFileStructure &&
              zone.zoneFileStructure.length > 0 &&
              zone.zoneFileStructure
                .sort((a, b) => {
                  if (a.type === 'folder' && b.type === 'file') return -1;
                  if (a.type === 'file' && b.type === 'folder') return 1;
                  return 0;
                })
                .map((item) => (
                  <ContextMenuTrigger
                    id={`${item.id}-contextMenu`}
                    attributes={{
                      className: 'hover:bg-gray-300 dark:hover:bg-gray-800',
                    }}
                  >
                    <div
                      key={item.id}
                      className="flex justify-between items-center border-b border-gray-300 dark:border-gray-800 px-2 py-1"
                      onDoubleClick={() => {
                        renameItem(item.id);
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
                            window.send('setUserZone', {
                              ...zone,
                              zoneFileStructure: zone.zoneFileStructure.filter(
                                (i) => i.id !== item.id
                              ),
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
                          {item.type === 'folder' ? (
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
                                window.send('setUserZone', {
                                  ...zone,
                                  zoneFileStructure: zone.zoneFileStructure.map(
                                    (i) => {
                                      if (i.id === item.id)
                                        return {
                                          ...i,
                                          renaming: false,
                                          name: renamingItemValue,
                                        };
                                      return i;
                                    }
                                  ),
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
                ))}
          </ContextMenuTrigger>
        </div>
        <div className="flex flex-col w-1/3 h-full "></div>
      </div>
    </div>
  ) : (
    <div className="flex justify-center items-center w-full h-full">
      <div className="flex flex-col justify-center items-center w-full h-full">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          version="1.0"
          width="64px"
          height="64px"
          viewBox="0 0 128 128"
        >
          <path
            fill="#10b981"
            id="ball1"
            className="cls-1"
            d="M67.712,108.82a10.121,10.121,0,1,1-1.26,14.258A10.121,10.121,0,0,1,67.712,108.82Z"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="0 64 64;4 64 64;0 64 64;0 64 64;0 64 64;0 64 64;0 64 64;0 64 64;0 64 64;0 64 64;0 64 64;0 64 64;0 64 64;"
              dur="1800ms"
              repeatCount="indefinite"
            ></animateTransform>
          </path>
          <path
            fill="#10b981"
            id="ball2"
            className="cls-1"
            d="M51.864,106.715a10.125,10.125,0,1,1-8.031,11.855A10.125,10.125,0,0,1,51.864,106.715Z"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="0 64 64;10 64 64;0 64 64;0 64 64;0 64 64;0 64 64;0 64 64;0 64 64;0 64 64;0 64 64;0 64 64;0 64 64;0 64 64;"
              dur="1800ms"
              repeatCount="indefinite"
            ></animateTransform>
          </path>
          <path
            fill="#10b981"
            id="ball3"
            className="cls-1"
            d="M33.649,97.646a10.121,10.121,0,1,1-11.872,8A10.121,10.121,0,0,1,33.649,97.646Z"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="0 64 64;20 64 64;40 64 64;65 64 64;85 64 64;100 64 64;120 64 64;140 64 64;160 64 64;185 64 64;215 64 64;255 64 64;300 64 64;"
              dur="1800ms"
              repeatCount="indefinite"
            ></animateTransform>
          </path>
        </svg>
        <div>{zone.message}</div>
      </div>
    </div>
  );
};

export default ZonePage;
