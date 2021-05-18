import React, { useState } from 'react';

let CreateProfilePage = () => {
  let [userUsername, setUsername] = useState('');
  let [userFirstName, setFirstName] = useState('');
  let [userLastName, setLastName] = useState('');

  let createProfile = () => {
    window.send('createProfile', {
      userFirstName,
      userLastName,
      userUsername,
    });
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div className="border-l border-t border-r border-b border-gray-300 dark:border-gray-800 rounded-md p-4">
        <div className="flex flex-col items-center">
          <div className="text-xl">Create A Profile.</div>

          <div className="flex flex-col items-center w-72 mt-5 mb-3">
            <input
              className="flex flex-row flex-auto w-full justify-center items-center px-3 py-2 bg-gray-300 dark:bg-gray-800 my-1 outline-none rounded-md "
              type="text"
              placeholder="Your username, e.g. bob"
              onChange={({ target: { value } }) => setUsername(value)}
              value={userUsername}
            />
            <input
              className="flex flex-row flex-auto w-full justify-center items-center px-3 py-2 bg-gray-300 dark:bg-gray-800 my-1 outline-none rounded-md "
              type="text"
              placeholder="Your first name"
              onChange={({ target: { value } }) => setFirstName(value)}
              value={userFirstName}
            />
            <input
              className="flex flex-row flex-auto w-full justify-center items-center px-3 py-2 bg-gray-300 dark:bg-gray-800 my-1 outline-none rounded-md "
              type="text"
              placeholder="Your last name"
              onChange={({ target: { value } }) => {
                setLastName(value);
              }}
              value={userLastName}
            />
          </div>

          <div
            className="flex flex-row flex-auto border-l border-t border-r border-b border-blue-900 px-3 py-2 text-blue-900 hover:text-white hover:border-0 hover:bg-blue-900 rounded-md cursor-pointer mb-3"
            onClick={() =>
              userUsername !== '' &&
              userFirstName !== '' &&
              userLastName !== '' &&
              createProfile()
            }
          >
            Continue
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProfilePage;
