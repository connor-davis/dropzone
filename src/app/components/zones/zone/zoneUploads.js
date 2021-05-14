import { useDispatch, useSelector } from 'react-redux';

import Header from '../../header';
import React from 'react';
import { getZoneInfo } from '../../../slices/zones';

let ZoneUploads = ({}) => {
  let dispatch = useDispatch();

  let zone = useSelector(getZoneInfo);

  return (
    <div className="relative flex flex-col flex-auto dark:bg-black">
      <Header title="Uploads" textSize="text-sm" />
    </div>
  );
};

export default ZoneUploads;
