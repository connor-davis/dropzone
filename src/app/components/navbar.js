import Account from './dropdowns/account';
import React from 'react';

let Navbar = ({ width, className, title, profile }) => {
  return (
    <div
      className={`flex px-2 py-3 justify-between items-center border-b border-gray-300 dark:border-gray-800 w-${width} ${className}`}
    >
      <div className="font-semibold text-lg">{title}</div>
      <div className="flex space-x-2">{profile && <Account />}</div>
    </div>
  );
};

export default Navbar;
