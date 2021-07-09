import { Route, BrowserRouter as Router } from 'react-router-dom';

import ProfileGuard from './components/profileGuard';
/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { getTheme } from './state/theme.slice';
import { useSelector } from 'react-redux';

let App = () => {
  let theme = useSelector(getTheme);

  return (
    <Router>
      <div className={theme}>
        <div className="flex flex-col w-screen h-screen bg-gray-100 dark:bg-black text-gray-600 dark:text-white select-none focus:outline-none">
          <Route path="/" component={() => <ProfileGuard />} />
        </div>
      </div>
    </Router>
  );
};

export default App;
