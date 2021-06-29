/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect } from 'react';
import { getTheme, setTheme } from './state/theme.slice';
import { useDispatch, useSelector } from 'react-redux';

import Navbar from './components/navbar';
import { BrowserRouter as Router } from 'react-router-dom';
import { getUserInfo } from './state/user.slice';

let App = () => {
  let dispatch = useDispatch();

  let theme = useSelector(getTheme);
  let user = useSelector(getUserInfo);

  useEffect(() => {}, []);

  return (
    <div className={theme}>
      <div className="flex flex-col w-screen h-screen bg-gray-100 dark:bg-black text-gray-600 dark:text-white select-none focus:outline-none">
        <Navbar />
        
        <div
          onClick={() => dispatch(setTheme('dark'))}
          className="cursor-pointer"
        >
          Theme {theme}
        </div>
        <Router></Router>
      </div>
    </div>
  );
};

export default App;
