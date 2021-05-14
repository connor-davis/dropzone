import { Dialog, Transition } from '@headlessui/react';
import React, { useState } from 'react';

let AddZoneDialog = ({ show, onAdd, onCancel }) => {
  let [zoneName, setZoneName] = useState('');

  return (
    <Transition show={show} as={React.Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        static
        open={show}
        onClose={() => {}}
      >
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-50 bg-transparent"
            leave="ease-in duration-200"
            leaveFrom="opacity-50"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black opacity-70" />
          </Transition.Child>

          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block w-auto p-3 my-8 overflow-hidden text-left align-middle transition-all transform bg-gray-100 dark:bg-black shadow-xl rounded-2xl border-l border-t border-r border-b border-gray-300 dark:border-gray-800">
              <Dialog.Title
                as="h3"
                className="text-lg font-medium leading-6 text-gray-900 dark:text-white text-center mb-5"
              >
                Add Zone
              </Dialog.Title>
              <div className="mt-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  <input
                    className="flex flex-row flex-auto w-full justify-center items-center px-3 py-2 bg-gray-300 dark:bg-gray-800 my-1 outline-none rounded-md "
                    type="text"
                    placeholder="Zone Name"
                    onChange={({ target: { value } }) => {
                      setZoneName(value);
                    }}
                    value={zoneName}
                  />
                </p>
              </div>

              <div className="flex justify-center items-center mt-4 w-full space-x-2">
                <button
                  type="button"
                  className="w-full inline-flex justify-center px-4 py-2 text-sm font-medium text-green-900 bg-green-100 border border-transparent rounded-md hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500"
                  onClick={() => onAdd()}
                >
                  Add
                </button>

                <button
                  type="button"
                  className="w-full inline-flex justify-center px-4 py-2 text-sm font-medium text-red-900 bg-red-100 border border-transparent rounded-md hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500"
                  onClick={() => onCancel()}
                >
                  Cancel
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default AddZoneDialog;
