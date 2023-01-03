import * as React from 'react';

import { cyContext } from './cyContext';
import { useContext, useEffect, useState } from "react";
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

function Cust_Tooltip(props) {
    const { myCy } = useContext(cyContext);


    const [myTooltip, setMyTooltip] = useState({
        open: false,
        selectedTitle: ""
    });


    const HtmlTooltip = styled(({ className, ...props }) => (
        <Tooltip {...props} classes={{ popper: className }} />
    ))(({ theme }) => ({
        [`& .${tooltipClasses.tooltip}`]: {
            backgroundColor: '#f5f5f9',
            color: 'rgba(0, 0, 0, 0.87)',
            maxWidth: 220,
            fontSize: theme.typography.pxToRem(12),
            border: '1px solid #dadde9',
        },
    }));

    try {

        function tooltipOpen(node) {
            let pos = node.renderedPosition();
            setMyTooltip({
                open: true,
                selectedTitle: node.data("label"),
                selectedType: node.data("type"),
                selectedSubtype: node.data("subtype"),
                selectedPagerank: node.data("pagerank"),
                selectedId: node.data("id")
            });

            console.log(node.data("label"))
        }

        function tooltipClose() {
            setMyTooltip({
                open: false,
                selectedTitle: "",
                selectedType: "",
                selectedSubtype: "",
                selectedPagerank: "",
                selectedId: ""
            });
        }

        myCy.on('select', 'node', function () {
            tooltipOpen(this);
        });

        myCy.on('unselect', 'node', function () {
            tooltipClose();
        });

        return (
            <>
                <HtmlTooltip
                    open={myTooltip.open}
                    onClose={function () { }}
                    onOpen={function () { }}
                    style={{
                        position: "absolute",
                        right: `10px`,
                        top: `75px`,
                    }}
                    title={<React.Fragment>
                        <Typography color="inherit">{myTooltip.selectedTitle}</Typography>
                        <Typography color="inherit"><b>{'Article Type: '}</b>{myTooltip.selectedType}</Typography>
                        <Typography color="inherit"><b>{'Article Subtype: '}</b>{myTooltip.selectedSubtype}</Typography>
                        <Typography color="inherit"><b>{'Article ID: '}</b>{myTooltip.selectedId}</Typography>
                        <Typography color="inherit"><b>{'Pagerank: '}</b>{myTooltip.selectedPagerank}</Typography>
                        <em>{"And here's"}</em> <b>{'some'}</b> <u>{'amazing content'}</u>.{' '}
                        {"It's very engaging. Right?"}
                      </React.Fragment>}>
                    <Box
                        style={{
                            position: "absolute",
                            right: `10px`,
                            top: `75px`,
                        }}>
                    </Box>
                </HtmlTooltip>
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