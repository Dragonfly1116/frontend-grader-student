import React from 'react'

const Embed = (props) => {
    return (<embed src={props.src} width={props.width} height={props.height} /> )
}

export default Embed