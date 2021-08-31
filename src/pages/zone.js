/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState } from 'react';

import LocalZone from '../components/zone/localZone';
import Navbar from '../components/navbar';
import RemoteZone from '../components/zone/remoteZone';
import { getUserInfo } from '../state/user.slice';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';

let ZonePage = () => {
  let router = useHistory();

  let userInfo = useSelector(getUserInfo);

  let [zone, setZone] = useState({});

  useEffect(() => {
    let displayName =
      router.location.pathname.split('/')[1] ||
      router.location.pathname.split('/')[2];

    if (displayName === userInfo.displayName)
      window.send('getLocalZone', { displayName });
    else window.send('getRemoteZone', { displayName });

    window.on('userZone', (zone) => {
      setZone(zone);
    });

    return () => {};
  }, []);

  return zone.zoneOwner ? (
    zone.zoneOwner.displayName === userInfo.displayName ? (
      <div className="flex flex-col w-full h-full">
        <Navbar title={'Your Zone'} backButton={false} />
        <LocalZone zone={zone} setZone={setZone} />
      </div>
    ) : (
      <div className="flex flex-col w-full h-full">
        <Navbar
          title={`${zone.zoneOwner.displayName}'s Zone`}
          backButton={true}
          onBackButtonClick={() => {
            if (zone.zonePreviousDirectory === '/')
              return router.push(`/${userInfo.publicKey}`);
            else
              return window.send('getRemoteFileStructure', {
                displayName: zone.zoneOwner.displayName,
                root: zone.zonePreviousDirectory,
              });
          }}
        />
        <RemoteZone zone={zone} setZone={setZone} />
      </div>
    )
  ) : (
    <div className="flex justify-center items-center w-full h-full">
      <div className="flex flex-col justify-center items-center w-full h-full">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          version="1.0"
          width="64px"
          height="64px"
          viewBox="0 0 128 128"
        >
          <path
            fill="#10b981"
            id="ball1"
            className="cls-1"
            d="M67.712,108.82a10.121,10.121,0,1,1-1.26,14.258A10.121,10.121,0,0,1,67.712,108.82Z"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="0 64 64;4 64 64;0 64 64;0 64 64;0 64 64;0 64 64;0 64 64;0 64 64;0 64 64;0 64 64;0 64 64;0 64 64;0 64 64;"
              dur="1800ms"
              repeatCount="indefinite"
            ></animateTransform>
          </path>
          <path
            fill="#10b981"
            id="ball2"
            className="cls-1"
            d="M51.864,106.715a10.125,10.125,0,1,1-8.031,11.855A10.125,10.125,0,0,1,51.864,106.715Z"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="0 64 64;10 64 64;0 64 64;0 64 64;0 64 64;0 64 64;0 64 64;0 64 64;0 64 64;0 64 64;0 64 64;0 64 64;0 64 64;"
              dur="1800ms"
              repeatCount="indefinite"
            ></animateTransform>
          </path>
          <path
            fill="#10b981"
            id="ball3"
            className="cls-1"
            d="M33.649,97.646a10.121,10.121,0,1,1-11.872,8A10.121,10.121,0,0,1,33.649,97.646Z"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="0 64 64;20 64 64;40 64 64;65 64 64;85 64 64;100 64 64;120 64 64;140 64 64;160 64 64;185 64 64;215 64 64;255 64 64;300 64 64;"
              dur="1800ms"
              repeatCount="indefinite"
            ></animateTransform>
          </path>
        </svg>
        <div>{zone.message}</div>
      </div>
    </div>
  );
};

export default ZonePage;
