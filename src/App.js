/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect } from 'react';
import { getUserInfo, setUser } from './app/slices/user';
import { useDispatch, useSelector } from 'react-redux';

import CreateProfilePage from './app/pages/profile/create';
import HomePage from './app/pages/home';
import Navbar from './app/components/navbar';

let App = () => {
  let dispatch = useDispatch();

  let user = useSelector(getUserInfo);

  useEffect(() => {
    window.send('getProfile');
    window.on('profileData', (profile) => dispatch(setUser(profile)));
  }, []);

  return (
    <div className="flex flex-col w-screen h-screen bg-gray-100 dark:bg-black text-gray-600 dark:text-white select-none focus:outline-none">
      <Navbar title="DropZone" width="full" />

      {user.userUsername ? <HomePage /> : <CreateProfilePage />}
    </div>
  );
};

export default App;
