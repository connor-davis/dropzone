import React from 'react';
import ReactTooltip from 'react-tooltip';

let List = ({ items, disabledText }) => {
  return (
    items &&
    items.length > 0 &&
    items.map((item) => {
      return (
        <div
          className={`flex justify-between items-center m-1 px-1 py-2 border-b border-gray-300 dark:border-gray-800 ${
            item.enabled ? 'text-gray-400 cursor-pointer' : 'cursor-pointer'
          }`}
          data-for="item-disabled"
          data-tip={disabledText}
        >
          <div className="flex flex-col">
            <div className="text-sm">{item.title}</div>
            <div className="text-xs">@{item.subtitle}</div>
          </div>

          {item.enabled && (
            <ReactTooltip
              id="item-disabled"
              place="right"
              effect="solid"
              className="p-1 bg-gray-100 dark:bg-black border-l shadow-md"
            />
          )}
        </div>
      );
    })
  );
};

export default List;
