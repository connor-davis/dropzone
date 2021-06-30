import React from 'react';

let Navbar = ({ title, children }) => {
  return (
    <div className="flex justify-between items-center border-b border-gray-300 dark:border-gray-800 px-2 py-3">
      <div className="text-lg">{title || 'DropZone'}</div>
      <div className="flex items-center space-x-3">{children}</div>
    </div>
  );
};

export default Navbar;
