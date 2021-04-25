import { Button, CardBody, CardFooter } from 'reactstrap'

import React from 'react'
import { getCompletedDownloads } from '../../slices/downloads'
import { saveAs } from 'file-saver'
import { useSelector } from 'react-redux'

let CompletedDownloads = () => {
    let completedDownloads = useSelector(getCompletedDownloads)

    return (
        <div
            style={{
                height: '250px',
            }}
        >
            <CardFooter>Completed Downloads</CardFooter>
            <CardBody
                className="m-0 p-0"
                style={{
                    overflowY: 'auto',
                }}
            >
                {completedDownloads.map((download) => (
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                        className="m-0 p-2"
                    >
                        <div>{download.name}</div>
                        <Button
                            color="primary"
                            outline
                            className="m-0 p-0 py-1 px-2"
                            onClick={() => {
                                saveAs(download.path, download.name)
                            }}
                        >
                            Save
                        </Button>
                    </div>
                ))}
            </CardBody>
        </div>
    )
}

export default CompletedDownloads
