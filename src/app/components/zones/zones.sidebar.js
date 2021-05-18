import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import AddZoneDialog from '../dialogs/addZone';
import Footer from '../footer';
import Header from '../header';
import { getUserInfo } from '../../slices/user';

let ZonesSidebar = ({}) => {
  let dispatch = useDispatch();

  let user = useSelector(getUserInfo);

  let [addZone, setAddZone] = useState(false);

  let logout = () => {
    window.send('removeProfile');
  };

  let AddIcon = () => {
    return (
      <svg
        className="flex-none w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
        />
      </svg>
    );
  };

  let LogoutIcon = () => {
    return (
      <svg
        className="flex-none w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
        />
      </svg>
    );
  };

  return (
    <div className="relative flex-none h-full w-64 lg:w-1/5 border-r border-gray-200 dark:bg-black dark:border-gray-800">
      <AddZoneDialog
        show={addZone}
        onAdd={(zoneName) => {
          console.log(zoneName);
          if (zoneName !== '') {
            setAddZone(false) && console.log(zoneName);
          } else {
            setAddZone(true);
          }
        }}
        onCancel={() => setAddZone(false)}
      />

      <Header title="Zones">
        <div
          className="flex flex-row justify-center items-center rounded-full hover:text-green-500 w-8 h-8 cursor-pointer hover:bg-gray-300 relative dark:hover:bg-gray-800 transition duration-500 ease-in-out dark:border dark:border-gray-800 focus:outline-none"
          onClick={() => setAddZone(true)}
        >
          <AddIcon />
        </div>
      </Header>

      <Footer>
        <div className="flex flex-auto justify-between items-center px-3 py-2">
          <div>{`${user.userFirstName} ${user.userLastName}`}</div>

          <div
            className="rounded-full px-2 py-2 cursor-pointer hover:bg-gray-300 hover:text-red-500 relative dark:hover:bg-gray-800 transition duration-500 ease-in-out focus:outline-none"
            onClick={() => logout()}
          >
            <LogoutIcon />
          </div>
        </div>
      </Footer>
    </div>
  );
};

export default ZonesSidebar;
