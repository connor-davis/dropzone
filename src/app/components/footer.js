import React from 'react';

let Footer = ({ children }) => {
  return (
    <div
      className={`absolute bottom-0 flex w-full justify-between items-center border-t border-gray-300 dark:border-gray-800`}
    >
      {children}
    </div>
  );
};

export default Footer;
