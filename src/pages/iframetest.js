import React from 'react';
import '../index.css';
import Iframe from 'react-iframe'

const IFrameTest = () => {
    return (
        <Iframe url="http://192.168.1.37:3000"
        width="100%"
        height="625px"
        id=""
        className=""
        display="block"
        position="relative"/>
    )
    };


export default IFrameTest;
