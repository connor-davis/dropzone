import { CardBody, CardFooter } from 'reactstrap'
import React, { useEffect } from 'react'

import { getActiveUploads } from '../../slices/uploads'
import { useSelector } from 'react-redux'

let ActiveUploads = () => {
    let activeUploads = useSelector(getActiveUploads)

    return (
        <div
            style={{
                height: '250px',
            }}
        >
            <CardFooter>Active Uploads</CardFooter>
            <CardBody
                className="m-0 p-0"
                style={{
                    overflowY: 'auto',
                }}
            >
                {activeUploads.map((upload) => {
                    return upload ? (
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
                            <div className="text-primary">
                                {upload.progress}%
                            </div>
                        </div>
                    ) : (
                        'Something went wrong.'
                    )
                })}
            </CardBody>
        </div>
    )
}

export default ActiveUploads
