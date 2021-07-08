/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState } from 'react';
import { addZone, getZones, removeZone } from '../state/zones.slice';
import { getUserInfo, setUser } from '../state/user.slice';
import { useDispatch, useSelector } from 'react-redux';

import AddZone from './addZone';
import Navbar from './navbar';
import ReactTooltip from 'react-tooltip';
import ThemeSwitcher from './themeSwitcher';
import ZoneRequests from './zoneRequests';
import { addZoneRequest } from '../state/zoneRequests.slice';
import { persistor } from '../state/store';
import { useHistory } from 'react-router-dom';
import { v4 } from 'uuid';

let ProfileGuard = () => {
  let dispatch = useDispatch();

  let router = useHistory();

  let userInfo = useSelector(getUserInfo);
  let zones = useSelector(getZones);

  let [username, setUsername] = useState('');
  let [firstName, setFirstName] = useState('');
  let [lastName, setLastName] = useState('');
  let [publicKey, setPublicKey] = useState('');

  useEffect(() => {
    router.push('/');

    if (userInfo !== {}) {
      window.send('initiateNode', userInfo);

      window.on('publicKey', (publicKey) => setPublicKey(publicKey));
      window.on('zoneRequest', (packet) => dispatch(addZoneRequest(packet)));
      window.on('addZone', (packet) => dispatch(addZone(packet)));
      window.on('removeZone', (packet) => dispatch(removeZone(packet)));
    }
  }, [userInfo]);

  return userInfo.username ? (
    <div className="flex flex-col w-screen h-screen">
      <Navbar>
        <div className="text-sm">Welcome, {userInfo.firstName}</div>

        <ThemeSwitcher />

        <div
          className="flex justify-center items-center border-l border-t border-r border-b border-gray-300 dark:border-gray-800 rounded-full p-1 cursor-pointer hover:text-red-500"
          onClick={() => persistor.purge().then(() => window.location.reload())}
          data-for="logout"
          data-tip="Logout"
        >
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
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
        </div>
        <ReactTooltip
          id="logout"
          place="left"
          effect="solid"
          className="p-1 bg-gray-100 dark:bg-black border-l shadow-md"
        />
      </Navbar>

      <div className="flex w-screen h-full">
        <div className="flex flex-col w-1/4 h-full border-r border-gray-300 dark:border-gray-800 z-1">
          <Navbar title="Zones">
            <AddZone />
            <ZoneRequests />
          </Navbar>

          <div className="flex flex-col w-full h-full overflow-y-auto">
            <div className="flex justify-between items-center m-1 px-1 py-2 border-b border-gray-300 dark:border-gray-800 cursor-pointer">
              <div className="flex flex-col">
                <div className="text-sm">
                  {userInfo.firstName} {userInfo.lastName}
                </div>
                <div className="text-xs text-gray-400">
                  @{userInfo.username}
                </div>
              </div>

              <div
                className="flex justify-center items-center border-l border-t border-r border-b border-gray-300 dark:border-gray-800 rounded-full p-1 cursor-pointer hover:text-yellow-600"
                onClick={() => {
                  window.send('copyPublicKey', userInfo);

                  window.on('copiedPublicKey', () => {
                    navigator.clipboard.writeText(publicKey).then(
                      function () {
                        alert(
                          'Your public key has been copied to your clipboard. Share it with friends so they can connect.'
                        );
                      },
                      function (err) {
                        console.error('Async: Could not copy text: ', err);
                      }
                    );
                  });
                }}
                data-for="zone-share"
                data-tip="Share Zone"
              >
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
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
              </div>
              <ReactTooltip
                id="zone-share"
                place="bottom"
                effect="solid"
                className="p-1 bg-gray-100 dark:bg-black border-l shadow-md"
              />
            </div>

            {zones.map((zone) => {
              return (
                <div
                  className={`flex justify-between items-center m-1 px-1 py-2 border-b border-gray-300 dark:border-gray-800 ${
                    zone.type === 'temporary'
                      ? 'text-gray-300 cursor-pointer'
                      : 'cursor-pointer'
                  }`}
                  data-for="unconnected-zone"
                  data-tip="Zone Not Connected"
                >
                  <div className="flex flex-col">
                    <div className="text-sm">
                      {zone.firstName || 'Not'} {zone.lastName || 'Connected'}
                    </div>
                    <div
                      className={`text-xs  ${
                        zone.type === 'temporary'
                          ? 'text-gray-300'
                          : 'text-gray-400'
                      }`}
                    >
                      @{zone.username}
                    </div>
                  </div>

                  {zone.type === 'temporary' && (
                    <ReactTooltip
                      id="unconnected-zone"
                      place="right"
                      effect="solid"
                      className="p-1 bg-gray-100 dark:bg-black border-l shadow-md"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col w-3/4 h-full"></div>
      </div>
    </div>
  ) : (
    <div className="flex flex-col justify-center w-screen h-screen">
      <div className="flex justify-center items-center w-screen h-auto">
        <div className="flex flex-col border-l border-t border-r border-b border-gray-300 dark:border-gray-800 p-2 rounded-md space-y-2">
          <div className="flex justify-center items-center text-lg my-3">
            Profile Setup
          </div>

          <input
            type="text"
            placeholder="Username"
            onChange={({ target: { value } }) => setUsername(value)}
            className="outline-none border-l border-t border-r border-b border-gray-300 dark:border-gray-800 p-2 rounded-md bg-gray-200 dark:bg-gray-800"
          />
          <input
            type="text"
            placeholder="First Name"
            onChange={({ target: { value } }) => setFirstName(value)}
            className="outline-none border-l border-t border-r border-b border-gray-300 dark:border-gray-800 p-2 rounded-md bg-gray-200 dark:bg-gray-800"
          />
          <input
            type="text"
            placeholder="Last Name"
            onChange={({ target: { value } }) => setLastName(value)}
            className="outline-none border-l border-t border-r border-b border-gray-300 dark:border-gray-800 p-2 rounded-md bg-gray-200 dark:bg-gray-800"
          />

          <div
            className="flex justify-center items-center bg-yellow-500 text-white px-3 py-2 rounded-md cursor-pointer"
            onClick={() => {
              if (username !== '' && firstName !== '' && lastName !== '')
                dispatch(setUser({ id: v4(), username, firstName, lastName }));
            }}
          >
            Continue
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileGuard;
