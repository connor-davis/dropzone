/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getUserInfo } from './state/user.slice';

let App = () => {
  let dispatch = useDispatch();

  let user = useSelector(getUserInfo);

  useEffect(() => {

  }, []);

  return (
    <div className="flex flex-col w-screen h-screen bg-gray-100 dark:bg-black text-gray-600 dark:text-white select-none focus:outline-none">

    </div>
  );
};

export default App;
