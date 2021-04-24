import {Button, Card, CardBody, CardFooter, Col, Input, Row} from 'reactstrap'
import React, {useEffect, useState} from 'react'
import {getDiscoveryChannel, setDiscoveryChannel,} from './app/slices/discoveryChannel'
import {useDispatch, useSelector} from 'react-redux'
import {useDropzone} from 'react-dropzone'

const App = () => {
    const dispatch = useDispatch()

    const discoveryChannel = useSelector(getDiscoveryChannel)

    const [nickname, setNickName] = useState('')
    const [channel, setChannel] = useState('')
    const [downloadManager, setDownloadManager] = useState()

    const [messages, setMessages] = useState([])
    const [message, setMessage] = useState('')

    const [activeDownloads, setActiveDownloads] = useState([])
    const [completeDownloads, setCompleteDownloads] = useState([])

    const [filePaths, setFilePaths] = useState([])

    const {getRootProps, getInputProps} = useDropzone({
        onDrop: (acceptedFiles) => {
            acceptedFiles.forEach(({path, name, size, type}) =>
                window.uploadFile({path, information: {name, size, type}})
            )
        },
    })

    useEffect(() => {
        window.joinedChannel(dispatch, setDiscoveryChannel)
        window.receiveMessages(setMessages)

        window.on('transferStarted', console.log)
        window.on('transferProgress', console.log)
        window.on('transferComplete', console.log)
        window.on('processingStarted', console.log)
        window.on('processingProgress', console.log)
        window.on('processingComplete', console.log)
    }, [])

    const connectChannel = (channelName) => {
        window.joinChannel(channelName)
    }

    const sendMessage = (message) => {
        let messagePacket = {
            type: 'message',
            sender: nickname,
            content: message,
        }
        window.sendMessage(messagePacket)
        setMessages((old) => [...old, messagePacket])
        setMessage('')
    }

    let RenderActiveDownloads = () => {
        // return activeDownloads.map((download) => (
        //     <div className="text-primary mb-1">
        //         {download.fileName +
        //         ' - ' +
        //         (download.progress ? download.progress : 0) +
        //         '%'}
        //     </div>
        // ))
    }

    let RenderCompleteDownloads = () => {
        // return completeDownloads.map((download) => (
        //     <div
        //         className="text-primary mb-1"
        //         onClick={() => {
        //             let parts = Uint8Array.from(download.chunks)
        //             let file = new Blob([parts], {type: download.fileType})
        //
        //             saveAs(file, download.fileName)
        //         }}
        //     >
        //         {download.fileName +
        //         ' - ' +
        //         (download.progress ? download.progress : 100) +
        //         '%'}
        //     </div>
        // ))
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
                    <Row
                        style={{
                            position: 'absolute',
                            width: '100vw',
                            height: '100vh',
                            overflow: 'none',
                        }}
                        className="m-0 p-0"
                    >
                        <Col md={3} className="m-0 p-0">
                            <Card
                                style={{
                                    width: '100%',
                                    height: '100vh',
                                }}
                                className="m-0 p-0"
                            >
                                <CardBody>
                                    <CardFooter>Active Downloads</CardFooter>
                                    <CardBody>
                                        {/*<RenderActiveDownloads/>*/}
                                    </CardBody>

                                    <CardFooter>Complete Downloads</CardFooter>
                                    <CardBody>
                                        {/*<RenderCompleteDownloads/>*/}
                                    </CardBody>
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
                                        2021 @ Connor Davis
                                    </div>
                                </CardFooter>
                            </Card>
                        </Col>
                        <Col md={6} className="m-0 p-0">
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
                                <input {...getInputProps()} id="fileToShare"/>
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
                                            onChange={({target: {value}}) =>
                                                setMessage(value)
                                            }
                                            placeholder="Message"
                                            style={{
                                                width: '200px',
                                            }}
                                        />
                                        <Button
                                            color="primary"
                                            outline
                                            onClick={() => sendMessage(message)}
                                        >
                                            Send
                                        </Button>
                                    </div>
                                </CardFooter>
                            </Card>
                        </Col>
                    </Row>
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
                                        onChange={({target: {value}}) =>
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
                                            onChange={({target: {value}}) =>
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

// discoveryChannel.on('packet', (channelPeer, { packet }) => {
//     switch (packet.type) {
//         case 'shareChunk':
//             window.appendChunk(packet)
//             break
//         case 'shareFinishUpload':
//             console.log('Finished')
//             let parts = window.compileFile(packet)
//             let file = new Blob([parts], { type: packet.fileType })
//             saveAs(file, packet.fileName)
//             break
//         case 'message':
//             setMessages((messages) => [...messages, packet])
//             break
//         default:
//             console.log(packet)
//             break
//     }
// })

// <div
// style={{
//     position: 'absolute',
//         top: '50%',
//         left: '50%',
//         transform: 'translate(-50%, -50%)',
// }}
// >
// <Card>
// <CardBody>
// <Col className="text-center">
//     <Spinner color="success"/>
//     <div className="mt-2">Connecting</div>
// </Col>
// </CardBody>
// </Card>
// </div>
