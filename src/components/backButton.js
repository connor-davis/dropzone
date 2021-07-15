import React from 'react';
import ReactTooltip from 'react-tooltip';
import { getUserInfo } from '../state/user.slice';
import { useHistory } from 'react-router';
import { useSelector } from 'react-redux';

let BackButton = ({ onClick }) => {
  let router = useHistory();

  let userInfo = useSelector(getUserInfo);

  return (
    <>
      <div
        className="flex justify-center items-center border-l border-t border-r border-b border-gray-300 dark:border-gray-800 rounded-full p-1 cursor-pointer hover:text-yellow-500"
        data-for="back-button"
        data-tip="Exit"
        onClick={onClick}
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
            d="M11 17l-5-5m0 0l5-5m-5 5h12"
          />
        </svg>
      </div>
      <ReactTooltip
        id="back-button"
        place="bottom"
        effect="solid"
        className="p-1 bg-gray-100 dark:bg-black border-l shadow-md"
      />
    </>
  );
};

export default BackButton;
