import { getTheme, setTheme } from '../state/theme.slice';
import { useDispatch, useSelector } from 'react-redux';

import React from 'react';
import ReactTooltip from 'react-tooltip';

let ThemeSwitcher = () => {
  let dispatch = useDispatch();

  let theme = useSelector(getTheme);

  return (
    <>
      <div
        className={`border-l border-t border-r border-b border-gray-300 dark:border-gray-800 rounded-full p-1 w-12 cursor-pointer hover:text-yellow-500`}
        onClick={() =>
          theme === 'light'
            ? dispatch(setTheme('dark'))
            : dispatch(setTheme('light'))
        }
        data-for="theme-change"
        data-tip="Change Theme"
      >
        {theme === 'light' ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mr-auto h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="ml-auto h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
        )}
      </div>
      <ReactTooltip
        id="theme-change"
        place="left"
        effect="solid"
        className="flex items-center p-1 bg-gray-100 dark:bg-black border-l shadow-md"
      />
    </>
  );
};

export default ThemeSwitcher;
