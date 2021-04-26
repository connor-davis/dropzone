import React, { useState } from 'react';

import { setUser } from '../slices/user';
import { useDispatch } from 'react-redux';

let JoinPage = () => {
    let dispatch = useDispatch();
    let [nickname, setNickname] = useState('');
    let [channel, setChannel] = useState('');

    return (
        <div className="flex flex-col w-screen h-screen select-none text-gray-500 dark:bg-black dark:text-white outline-none">
            <div className="flex flex-row flex-auto">
                <div className="flex flex-col flex-auto justify-center items-center">
                    <div className="flex flex-col items-center rounded-xl p-3">
                        <input
                            type="text"
                            className="text-gray-500 dark:text-white text-center rounded-md bg-transparent outline-none px-2 py-2 mb-2 border-l border-t border-r border-b border-gray-300 dark:border-gray-800"
                            value={nickname}
                            onChange={({ target: { value } }) => {
                                setNickname(value);
                            }}
                            placeholder="Name"
                        />

                        <input
                            type="text"
                            className="text-gray-500 dark:text-white text-center rounded-md bg-transparent outline-none px-2 py-2 mb-2 border-l border-t border-r border-b border-gray-300 dark:border-gray-800"
                            value={channel}
                            onChange={({ target: { value } }) => {
                                setChannel(value);
                            }}
                            placeholder="Key (e.g. dropzone)"
                        />

                        <div
                            className="border-l border-t border-r border-b border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white px-2 py-1 rounded-sm mt-2 cursor-pointer transition duration-500 ease-in-out"
                            onClick={() =>
                                dispatch(setUser({ nickname, channel }))
                            }
                        >
                            Connect
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-row justify-center items-center p-2 bg-gray-100 border-t border-gray-200 dark:bg-black dark:border-gray-800">
                <div className="text-gray-500 text-sm">2021 @ Connor Davis</div>
            </div>
        </div>
    );
};

export default JoinPage;
