import {
    Button,
    Card,
    CardBody,
    CardFooter,
    Col,
    Input,
    Row,
    Spinner,
} from 'reactstrap'
import React, { useEffect, useState } from 'react'
import {
    getDiscoveryChannel,
    setDiscoveryChannel,
} from './app/slices/discoveryChannel'
import { isConnected, setConnected } from './app/slices/connection'
import { useDispatch, useSelector } from 'react-redux'

import { saveAs } from 'file-saver'
import { useDropzone } from 'react-dropzone'
import { v4 } from 'uuid'

const App = () => {
    const dispatch = useDispatch()

    const connected = useSelector(isConnected)
    const discoveryChannel = useSelector(getDiscoveryChannel)

    const [nickname, setNickName] = useState('')
    const [channel, setChannel] = useState('')

    const [messages, setMessages] = useState([])
    const [message, setMessage] = useState('')

    const { getRootProps, getInputProps } = useDropzone()

    useEffect(() => {
        if (discoveryChannel) {
            discoveryChannel.on('packet', (channelPeer, { packet }) => {
                switch (packet.type) {
                    case 'shareChunk':
                        window.appendChunk(packet)
                        break
                    case 'shareFinishUpload':
                        console.log('Finished')
                        let parts = window.compileFile(packet)
                        let file = new Blob([parts], { type: packet.fileType })
                        saveAs(file, packet.fileName)
                        break
                    case 'message':
                        setMessages((messages) => [...messages, packet])
                        break
                    default:
                        console.log(packet)
                        break
                }
            })

            discoveryChannel.on('peer', (channelPeer) => {
                dispatch(setConnected(true))
            })

            discoveryChannel.on('disconnected', () => {
                dispatch(setConnected(false))
                window.connector.destroy(() => {
                    setNickName('')
                    dispatch(setDiscoveryChannel(undefined))
                })
            })
        }
    }, [discoveryChannel])

    const connectChannel = (channelName) => {
        if (discoveryChannel !== undefined) {
            discoveryChannel.closeChannel()

            window.connector.destroy(() => {
                dispatch(
                    setDiscoveryChannel(
                        window.initializeConnector().channel(channelName)
                    )
                )
            })
        } else {
            dispatch(setDiscoveryChannel(window.connector.channel(channelName)))
        }
    }

    const sendMessage = (message) => {
        let messagePacket = {
            type: 'message',
            sender: nickname,
            content: message,
        }
        discoveryChannel.sendPacket(messagePacket)
        setMessages((old) => [...old, messagePacket])
        setMessage('')
    }

    const sendFile = async () => {
        let uploadID = Date.now() + v4()
        let file = document.getElementById('fileToShare').files[0]

        if (file instanceof File) {
            let firstByte = 0
            let lastByte = file.size - 1

            let blob = file.slice(firstByte, lastByte + 1, file.type)

            let buffer = await blob.arrayBuffer()
            let chunks = new Uint8Array(buffer)

            function chunk(arr, len) {
                var chunks = [],
                    i = 0,
                    n = arr.length

                while (i < n) {
                    chunks.push(arr.slice(i, (i += len)))
                }

                return chunks
            }

            chunk(chunks, 16).forEach((chunk) => {
                let shareChunk = {
                    type: 'shareChunk',
                    uploadID: uploadID,
                    fileChunk: chunk,
                    fileName: file.name,
                    fileType: file.type,
                    fileSize: file.size,
                    firstByte,
                    lastByte,
                }

                discoveryChannel.sendPacket(shareChunk)
            })

            let shareFinishUpload = {
                type: 'shareFinishUpload',
                uploadID: uploadID,
                fileName: file.name,
                fileType: file.type,
                fileSize: file.size,
                firstByte,
                lastByte,
            }

            discoveryChannel.sendPacket(shareFinishUpload)
        }
    }

    return (
        <div
            style={{
                overflow: 'hidden',
            }}
            className="m-0 p-0"
        >
            {discoveryChannel ? (
                <>
                    {connected ? (
                        <Row
                            style={{
                                position: 'absolute',
                                width: '100vw',
                                height: '100vh',
                                overflow: 'none',
                            }}
                            className="m-0 p-0"
                        >
                            <Col md={9} className="m-0 p-0">
                                <div
                                    {...getRootProps()}
                                    className="border m-0 p-0"
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        width: '100%',
                                        height: '100vh',
                                    }}
                                >
                                    <input
                                        {...getInputProps()}
                                        id="fileToShare"
                                        onChange={() => sendFile()}
                                    />
                                    <div>Drag and Drop your files here.</div>
                                </div>
                            </Col>
                            <Col md={3} className="m-0 p-0">
                                <Card
                                    style={{
                                        width: '100%',
                                        height: '100vh',
                                    }}
                                    className="m-0 p-0"
                                >
                                    <CardBody>
                                        {messages.map((message) => (
                                            <div className="text-primary mb-1">
                                                {message.sender +
                                                    ' > ' +
                                                    message.content}
                                            </div>
                                        ))}
                                    </CardBody>
                                    <CardFooter>
                                        <div
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'row',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <Input
                                                className="rounded mr-2"
                                                type="text"
                                                value={message}
                                                onChange={({
                                                    target: { value },
                                                }) => setMessage(value)}
                                                placeholder="Message"
                                                style={{
                                                    width: '200px',
                                                }}
                                            />
                                            <Button
                                                color="primary"
                                                outline
                                                onClick={() =>
                                                    sendMessage(message)
                                                }
                                            >
                                                Send
                                            </Button>
                                        </div>
                                    </CardFooter>
                                </Card>
                            </Col>
                        </Row>
                    ) : (
                        <div
                            style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                            }}
                        >
                            <Card>
                                <CardBody>
                                    <Col className="text-center">
                                        <Spinner color="success" />
                                        <div className="mt-2">Connecting</div>
                                    </Col>
                                </CardBody>
                            </Card>
                        </div>
                    )}
                </>
            ) : (
                <>
                    <div
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 'auto',
                        }}
                    >
                        <Card className="rounded">
                            <CardBody>
                                <Col className="text-center">
                                    <Input
                                        className="rounded mb-2"
                                        type="text"
                                        value={nickname}
                                        onChange={({ target: { value } }) =>
                                            setNickName(value)
                                        }
                                        placeholder="Nickname"
                                    />
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Input
                                            className="rounded mr-2"
                                            type="text"
                                            value={channel}
                                            onChange={({ target: { value } }) =>
                                                setChannel(value)
                                            }
                                            placeholder="Key (e.g. dropzone-alpha)"
                                        />
                                        <Button
                                            className="rounded"
                                            color="primary"
                                            onClick={() =>
                                                connectChannel(channel)
                                            }
                                        >
                                            Connect
                                        </Button>
                                    </div>
                                </Col>
                            </CardBody>
                        </Card>
                    </div>
                </>
            )}
        </div>
    )
}

export default App
