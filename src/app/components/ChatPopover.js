import React, { useEffect, useState } from 'react';
import { addMessage, getMessages, readMessage } from '../slices/messages';
import { useDispatch, useSelector } from 'react-redux';

import { Popover } from '@headlessui/react';
import ScrollToBottom from 'react-scroll-to-bottom';
import { getUserInfo } from '../slices/user';
import { v4 } from 'uuid';

let Message = ({ id, sender, content }) => {
    let dispatch = useDispatch();
    let user = useSelector(getUserInfo);

    useEffect(() => {
        dispatch(readMessage(id));
    }, [dispatch, id]);

    return sender === user.nickname ? (
        <div key={id} className="flex flex-col items-end">
            <div className="w-3/5 rounded-tl-lg rounded-br-lg rounded-bl-lg bg-blue-500 text-white p-2 mx-2 mb-2 break-all">
                {content}
            </div>
        </div>
    ) : (
        <div key={id} className="flex flex-col items-start">
            <div className="flex flex-row flex-auto px-2 py-1">
                {sender || 'Bob'}
            </div>
            <div className="w-3/5 rounded-tr-lg rounded-br-lg rounded-bl-lg border-t border-r border-b border-l border-gray-300 bg-gray-100 dark:bg-black dark:border-gray-800 p-2 mx-2 mb-2 break-all">
                {content}
            </div>
        </div>
    );
};

let ChatPopover = () => {
    let dispatch = useDispatch();
    let user = useSelector(getUserInfo);
    let messages = useSelector(getMessages);
    let [messageSent, setMessageSent] = useState(false);

    let sendMessage = () => {
        if (
            document.getElementById('message').innerText !==
            (undefined || null || '')
        ) {
            let messagePacket = {
                type: 'message',
                messageId: v4(),
                messageSender: user.nickname,
                messageContent: document.getElementById('message').innerText,
                messageRead: false,
            };

            window.sendMessage(messagePacket);

            dispatch(addMessage(messagePacket));
            document.getElementById('message').innerText = '';
        }
    };

    return (
        <Popover className="relative">
            {({ open }) => (
                <>
                    <Popover.Button className="flex flex-row justify-center items-center rounded-full w-8 h-8 cursor-pointer hover:bg-gray-300 relative dark:hover:bg-gray-800 transition duration-500 ease-in-out dark:border dark:border-gray-800">
                        <div className="flex flex-row justify-center items-center px-1 rounded-xl bg-blue-500 text-xs text-white absolute -bottom-1 right-6">
                            {messages.filter(
                                (message) =>
                                    message.messageSender !== user.nickname &&
                                    !message.messageRead
                            ).length > 0
                                ? messages.filter(
                                      (message) =>
                                          message.messageSender !==
                                              user.nickname &&
                                          !message.messageRead
                                  ).length
                                : null}
                        </div>
                        <svg
                            className="flex-none w-4 h-4 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                            ></path>
                        </svg>
                    </Popover.Button>

                    <Popover.Panel className="absolute z-10 top-10 -right-0 h-96 rounded-xl text-gray-500 dark:text-white cursor-default flex flex-row border-r border-b border-l border-t border-gray-200 dark:border-gray-800">
                        <div className="flex flex-row rounded-xl bg-gray-100 dark:bg-black">
                            {/* <div className="flex flex-col w-48 border-r border-gray-200 dark:border dark:border-gray-800">
                        <div className="flex flex-row items-center rounded-tl-xl p-2 bg-gray-100 border-b border-gray-200 dark:bg-black dark:border-gray-800">
                            <div className="text-sm mr-auto">Messages</div>
                            <div className="flex flex-row justify-center items-center rounded-full w-6 h-6 cursor-pointer self-end hover:bg-gray-300 dark:hover:bg-gray-800 transition duration-500 ease-in-out">
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                    />
                                </svg>
                            </div>
                        </div>

                        <div className="flex-auto bg-gray-100 dark:bg-black rounded-bl-xl">
                            Content
                        </div>
                    </div> */}
                            <div className="flex flex-col w-96">
                                <div className="flex flex-row items-center rounded-tl-xl rounded-tr-xl p-2 bg-gray-100 border-b border-gray-200 bg-gray-100 dark:bg-black dark:border-gray-800 mb-2">
                                    {/* <div className="flex flex-row justify-center items-center rounded-full w-6 h-6 cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-800 transition duration-500 ease-in-out">
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 19l-7-7 7-7"
                                    />
                                </svg>
                            </div> */}
                                    <div className="text-sm ml-2">Messages</div>
                                </div>

                                <ScrollToBottom className="flex-auto overflow-y-auto bg-gray-100 dark:bg-black">
                                    {messages.map((message) => (
                                        <Message
                                            id={message.messageId}
                                            sender={message.messageSender}
                                            content={message.messageContent}
                                        />
                                    ))}
                                </ScrollToBottom>

                                <div className="flex flex-row items-center rounded-bl-xl rounded-br-xl p-1 bg-gray-100 border-t border-gray-200 dark:bg-black dark:border-gray-800">
                                    <div
                                        id="message"
                                        className="flex-auto max-h-20 px-1 outline-none overflow-y-auto cursor-text editableInput"
                                        onKeyDown={(e) => {
                                            const _code = e.key;

                                            if (_code === 'Enter') {
                                                e.preventDefault();
                                                sendMessage();
                                                setMessageSent(true);
                                            } else {
                                                setMessageSent(false);
                                            }
                                        }}
                                        role="textbox"
                                        contentEditable={true}
                                        data-placeholder="Message"
                                    >
                                        {!messageSent && null}
                                    </div>
                                    <div
                                        onClick={() => sendMessage()}
                                        className="flex flex-row flex-none ml-2 text-blue-500 justify-center items-center rounded-full w-8 h-8 cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-800"
                                    >
                                        <svg
                                            className="w-4 h-4 transform rotate-90"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Popover.Panel>
                </>
            )}
        </Popover>
    );
};

export default ChatPopover;
