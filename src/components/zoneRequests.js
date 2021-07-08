import { Popover, Transition } from '@headlessui/react';
import {
  getZoneRequests,
  removeZoneRequest,
} from '../state/zoneRequests.slice';
import { useDispatch, useSelector } from 'react-redux';

import React from 'react';
import ReactTooltip from 'react-tooltip';
import { getUserInfo } from '../state/user.slice';

let ZoneRequests = () => {
  let dispatch = useDispatch();
  let userInfo = useSelector(getUserInfo);
  let zoneRequests = useSelector(getZoneRequests);

  return (
    <Popover className="relative">
      {({ open }) => (
        <>
          <Popover.Button
            onClick={() => {}}
            className="focus:outline-none flex justify-center items-center border-l border-t border-r border-b border-gray-300 dark:border-gray-800 rounded-full p-1 cursor-pointer hover:text-yellow-500"
            data-for="zone-requests"
            data-tip="Zone Requests"
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
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
              />
            </svg>
          </Popover.Button>
          <ReactTooltip
            id="zone-requests"
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
            <Popover.Panel className="absolute z-10 w-64">
              <div className="w-full overflow-hidden rounded-lg shadow-md ring-1 ring-black ring-opacity-5 bg-gray-100 dark:bg-black p-2">
                <div className="flex flex-col w-full">
                  <div className="flex flex-col overflow-y-auto max-h-76">
                    {zoneRequests && zoneRequests.length > 0 ? (
                      zoneRequests.map((request) => {
                        return (
                          <div
                            key={request.id}
                            className="flex justify-between items-center border-b border-gray-300 dark:border-gray-800 px-1 py-2"
                          >
                            <div className="flex flex-col">
                              <div className="text-sm">
                                {request.firstName} {request.lastName}
                              </div>
                              <div className="text-xs text-gray-400">
                                @{request.username}
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">
                              <div
                                onClick={() => {
                                  dispatch(removeZoneRequest(request.id));
                                  window.send('zoneRequestAccepted', userInfo);
                                }}
                                className="focus:outline-none flex justify-center items-center border-l border-t border-r border-b border-gray-300 dark:border-gray-800 rounded-full p-1 cursor-pointer hover:text-green-500"
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
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              </div>

                              <div
                                onClick={() => {
                                  dispatch(removeZoneRequest(request.id));
                                  window.send('zoneRequestRejected', userInfo);
                                }}
                                className="focus:outline-none flex justify-center items-center border-l border-t border-r border-b border-gray-300 dark:border-gray-800 rounded-full p-1 cursor-pointer hover:text-red-500"
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
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-sm text-center w-full">
                        You have no Zone Requests.
                      </div>
                    )}
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

export default ZoneRequests;
