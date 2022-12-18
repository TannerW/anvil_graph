import { cyContext } from './cyContext';
import { useContext, useEffect } from "react";
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';

function Cust_Tooltip(props) {
    const { myTooltip, setMyTooltip } = useContext(cyContext);

    useEffect(() => { 
        setTimeout(() => setMyTooltip(myTooltip?.current), 5) 
    },  [myTooltip])


    try {

        return (
            <>
            <Tooltip
                open={myTooltip.open}
                onClose={function () { }}
                onOpen={function () { }}
                style={{
                    position: "absolute",
                    left: `${myTooltip.x}px`,
                    top: `${myTooltip.y}px`,
                }}
                title="Add">
                <Box
                    style={{
                        position: "absolute",
                        left: `${myTooltip.x}px`,
                        top: `${myTooltip.y}px`,
                    }}>
                </Box>
            </Tooltip>
            </>
        )
    }
    catch {
        console.log("tooltip init");
    }
}

Cust_Tooltip.propTypes = {
    /**
     * Injected by the documentation to work in an iframe.
     * You won't need it on your project.
     */
    window: PropTypes.func,
};

export default Cust_Tooltip;