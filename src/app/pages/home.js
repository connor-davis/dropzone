import React from 'react';
import Zone from '../components/zones/zone/zone';
import ZonesSidebar from '../components/zones/zones.sidebar';
import { getUserInfo } from '../slices/user';
import { useSelector } from 'react-redux';

let HomePage = () => {
  let user = useSelector(getUserInfo);

  return (
    <div className="flex flex-col w-screen h-full select-none text-gray-500 dark:bg-black dark:text-white outline-none">
      <div className="flex flex-row flex-auto">
        <ZonesSidebar />

        <Zone />
      </div>
    </div>
  );
};

export default HomePage;
