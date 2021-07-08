import { Popover, Transition } from '@headlessui/react';
import React, { useState } from 'react';

import ReactTooltip from 'react-tooltip';
import { getUserInfo } from '../state/user.slice';
import { useSelector } from 'react-redux';

let AddZone = () => {
  let userInfo = useSelector(getUserInfo);

  let [zonePublicKey, setZonePublicKey] = useState('');

  return (
    <Popover className="relative">
      {({ open }) => (
        <>
          <Popover.Button
            onClick={() => {}}
            className="focus:outline-none flex justify-center items-center border-l border-t border-r border-b border-gray-300 dark:border-gray-800 rounded-full p-1 cursor-pointer hover:text-green-500"
            data-for="zone-add"
            data-tip="Add Zone"
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
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </Popover.Button>
          <ReactTooltip
            id="zone-add"
            place="bottom"
            effect="solid"
            className="p-1 bg-gray-100 dark:bg-black border-l shadow-md"
          />
          <Transition
            as={React.Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
            show={open}
          >
            <Popover.Panel className="absolute z-10 w-auto">
              <div className="overflow-hidden rounded-lg shadow-md ring-1 ring-black ring-opacity-5 bg-gray-100 dark:bg-black p-2">
                <div className="flex w-auto h-auto space-x-2 rounded-md">
                  <input
                    type="text"
                    placeholder="Zone Public Key"
                    value={
                      zonePublicKey !== ''
                        ? zonePublicKey.substring(0, 6) +
                          '...' +
                          zonePublicKey.substring(
                            zonePublicKey.length - 12,
                            zonePublicKey.length
                          )
                        : zonePublicKey
                    }
                    onChange={({ target: { value } }) =>
                      setZonePublicKey(value)
                    }
                    className="outline-none border-l border-t border-r border-b border-gray-300 dark:border-gray-800 p-2 rounded-md bg-gray-200 dark:bg-gray-800"
                  />

                  <div
                    className="flex justify-center items-center bg-yellow-500 text-white px-3 py-2 rounded-md cursor-pointer"
                    onClick={() => {
                      if (zonePublicKey !== '') {
                        window.send('connectZone', {
                          key: zonePublicKey,
                          userInformation: userInfo,
                        });
                      }
                    }}
                  >
                    Add
                  </div>
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
};

export default AddZone;
