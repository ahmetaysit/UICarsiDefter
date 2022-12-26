import React from 'react'

export default function ScroolableArea(props) {
    return (
        <div className="scroolableArea" {...props}>
            {props.children}
        </div>
    )
}
