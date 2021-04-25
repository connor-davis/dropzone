import { Card, CardBody, CardFooter } from 'reactstrap'

import React from 'react'

let Sidebar = (props) => {
    let RenderContent = () => {
        return props.content
    }

    let RenderFooter = () => {
        return props.footer
    }

    return (
        <Card
            style={{
                width: '100%',
                height: '100vh',
            }}
            className="m-0 p-0"
        >
            <CardBody
                className="m-0 p-0"
                style={{
                    overflowY: 'auto',
                }}
            >
                <RenderContent />
            </CardBody>
            <CardFooter>
                <RenderFooter />
            </CardFooter>
        </Card>
    )
}

export default Sidebar
