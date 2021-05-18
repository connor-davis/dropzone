import { useDispatch, useSelector } from 'react-redux';

import ChatPopover from '../../ChatPopover';
import Footer from '../../footer';
import Header from '../../header';
import React from 'react';
import ZoneDownloads from './zoneDownloads';
import ZoneUploads from './zoneUploads';
import { getZoneInfo } from '../../../slices/zones';

let Zone = () => {
  let dispatch = useDispatch();

  let zone = useSelector(getZoneInfo);

  return (
    <>
      {zone.length > 0 ? (
        <div className="relative flex flex-col flex-auto dark:bg-black">
          <Header>
            <ChatPopover />
          </Header>

          <Footer>
            <div className="flex h-48 w-full">
              <ZoneDownloads />
              <div className="flex flex-col border-r border-gray-300 dark:border-gray-800" />
              <ZoneUploads />
            </div>
          </Footer>
        </div>
      ) : (
        <div className="relative flex flex-col flex-auto justify-center items-center dark:bg-black">
          <div className="relative flex flex-auto justify-center items-center">
            Hello World
          </div>
        </div>
      )}
    </>
  );
};

export default Zone;
