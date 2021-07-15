/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState } from 'react';
import { Route, useHistory } from 'react-router-dom';
import { getUserInfo, setUser } from '../state/user.slice';
import { useDispatch, useSelector } from 'react-redux';

import AddZone from './addZone';
import Navbar from './navbar';
import ReactTooltip from 'react-tooltip';
import ThemeSwitcher from './themeSwitcher';
import ZonePage from '../pages/zone';
import ZoneRequests from './zoneRequests';
import { addZoneRequest } from '../state/zoneRequests.slice';
import { persistor } from '../state/store';
import { v4 } from 'uuid';

let ProfileGuard = () => {
  let dispatch = useDispatch();

  let router = useHistory();

  let userInfo = useSelector(getUserInfo);

  let [displayName, setDisplayName] = useState('');

  useEffect(() => {
    window.on('nodeInitialized', (userInfo) => {
      dispatch(setUser(userInfo));
    });
    window.on('zoneRequest', (packet) => dispatch(addZoneRequest(packet)));
    window.on('navigate', (packet) => router.push(packet.path));

    if (userInfo.displayName) {
      window.send('initiateNode', {
        id: v4(),
        displayName: userInfo.displayName,
      });
    }

    return () => {};
  }, []);

  return userInfo.publicKey ? (
    <div className="flex flex-col w-screen h-screen">
      <Navbar>
        <AddZone />
        <ZoneRequests />

        <div
          className="flex justify-center items-center border-l border-t border-r border-b border-gray-300 dark:border-gray-800 rounded-full p-1 cursor-pointer hover:text-yellow-600"
          onClick={() => {
            navigator.clipboard.writeText(userInfo.publicKey).then(() => {
              alert(
                'Your public key has been copied to your clipboard. Share it with friends so they can connect.'
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

        <ThemeSwitcher />

        <div
          className="flex justify-center items-center border-l border-t border-r border-b border-gray-300 dark:border-gray-800 rounded-full p-1 cursor-pointer hover:text-red-500"
          onClick={() =>
            persistor.purge().then(() => {
              window.location.reload();
              window.send('purge', userInfo.publicKey);
            })
          }
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
        <Route
          exact
          path={`/${userInfo.displayName}`}
          component={(props) => <ZonePage {...props} />}
        />
        <Route
          path="/zone/:displayName"
          component={(props) => <ZonePage {...props} />}
        />
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
            placeholder="Display Name"
            value={displayName}
            onChange={({ target: { value } }) => setDisplayName(value)}
            className="outline-none border-l border-t border-r border-b border-gray-300 dark:border-gray-800 p-2 rounded-md bg-gray-200 dark:bg-gray-800"
          />

          <div
            className="flex justify-center items-center bg-yellow-500 text-white px-3 py-2 rounded-md cursor-pointer"
            onClick={() => {
              if (displayName)
                window.send('initiateNode', { id: v4(), displayName });
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
