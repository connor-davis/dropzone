import React from 'react';

let Header = ({ title, textSize, children }) => {
  return (
    <div
      className={`flex px-2 py-2 justify-between items-center border-b border-gray-300 dark:border-gray-800 w-full`}
    >
      <div className={`font-semibold ${textSize || 'text-lg'}`}>{title}</div>

      {children}
    </div>
  );
};

export default Header;
