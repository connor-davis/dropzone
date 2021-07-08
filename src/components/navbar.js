import React from 'react';

let Navbar = ({ title, BackButton, children }) => {
  return (
    <div className="flex justify-between items-center border-b border-gray-300 dark:border-gray-800 px-2 py-1">
      <div className="text-lg flex">
        {BackButton !== undefined && (
          <div className="mr-2">
            <BackButton />
          </div>
        )}
        {title || 'DropZone'}
      </div>
      <div className="flex items-center space-x-3">{children}</div>
    </div>
  );
};

export default Navbar;
