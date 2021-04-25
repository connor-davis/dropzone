import { CardBody, CardFooter } from 'reactstrap'

import React from 'react'
import { getActiveDownloads } from '../../slices/downloads'
import { useSelector } from 'react-redux'

let ActiveDownloads = () => {
    let activeDownloads = useSelector(getActiveDownloads)

    return (
        <div
            style={{
                height: '250px',
            }}
        >
            <CardFooter>Active Downloads</CardFooter>
            <CardBody
                className="m-0 p-0"
                style={{
                    overflowY: 'auto',
                }}
            >
                {activeDownloads.map((download) => (
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
                        <div className="text-primary">
                            {download.progress < 100
                                ? download.progress + 1
                                : download.progress}
                            %
                        </div>
                    </div>
                ))}
            </CardBody>
        </div>
    )
}

export default ActiveDownloads
