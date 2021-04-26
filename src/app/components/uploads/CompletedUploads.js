import { CardBody, CardFooter } from 'reactstrap'

import React from 'react'
import { getCompletedUploads } from '../../slices/uploads'
import { useSelector } from 'react-redux'

let CompletedUploads = () => {
    let completedUploads = useSelector(getCompletedUploads)

    return (
        <div
            style={{
                height: '250px',
            }}
        >
            <CardFooter>Completed Uploads</CardFooter>
            <CardBody
                className="m-0 p-0"
                style={{
                    overflowY: 'auto',
                }}
            >
                {completedUploads.map((upload) => {
                    return (
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                            className="m-0 p-2"
                        >
                            <div>{upload.fileName}</div>
                        </div>
                    )
                })}
            </CardBody>
        </div>
    )
}

export default CompletedUploads
