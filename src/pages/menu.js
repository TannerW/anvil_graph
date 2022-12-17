// import React from 'react';
import ReactDOM from 'react-dom/client';
import '../index.css';
import Graph from '../Graph';

import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';

import cytoscape from 'cytoscape';
import cxtmenu from 'cytoscape-cxtmenu';
import CytoscapeComponent from "react-cytoscapejs";

import { cyContext } from './cyContext';
import { useContext } from "react";
import { styleSheet, layout } from '../GraphConfig';

const drawerWidth = 200;

function Menu(props) {
    const { window } = props;

    const { items, setItems } = useContext(cyContext);

    console.log("myCyRef - menu - context", items);


    const zoom_test = () => {
        items.zoom(2);
    };

    function redoLayout() {
        var core = items;
        var layout_subgraph = core.elements().not(':hidden').layout(layout);

        layout_subgraph.run();

        // core.animate({
        //     fit: {
        //         eles: core.elements(':visible'),
        //     }
        // }, {
        //     duration: 100
        // });
    }

    function ExpandNeighborhoodOneHop() {
        var core = items;
        var edges = core.elements(':visible').connectedEdges();
        edges.style("display", "element");
        edges.targets().style("display", "element");
        edges.sources().style("display", "element");

        // finally, make all edges between visible nodes visible
        var inter_edges = core.nodes(':visible').edgesTo(':visible')
        inter_edges.style("display", "element");

        redoLayout();
    }

    const [state, setState] = React.useState(false);

    const toggleDrawer = () => {
        setState(!state);
    };

    const drawer = (
        <div>
            <Toolbar />
            <Divider />
            <List>
                {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                            </ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Divider />
            <ButtonGroup size="small" variant="contained" aria-label="outlined primary button group">
                <Button onClick={zoom_test}>One</Button>
                <Button onClick={ExpandNeighborhoodOneHop}>Two</Button>
                <Button>Three</Button>
            </ButtonGroup>
            <List>
                {['All mail', 'Trash', 'Spam'].map((text, index) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                            </ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </div>
    );

    const container = window !== undefined ? () => window().document.body : undefined;

    // const root = ReactDOM.createRoot(document.getElementById('root'));

    const referrer = document.referrer;

    return (
        <>
            <Box>
                <CssBaseline />
                <AppBar
                    position="fixed"
                    sx={{
                        width: { sm: `100%` },
                        ml: { sm: `${drawerWidth}px` },
                    }}>
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={toggleDrawer}>
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" noWrap component="div">
                            Cytoscape example | {referrer}
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Box
                    component="nav"
                    sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                    aria-label="mailbox folders"
                >
                    {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                    <Drawer
                        container={container}
                        variant="temporary"
                        open={state}
                        onClose={toggleDrawer}
                        ModalProps={{
                            keepMounted: true, // Better open performance on mobile.
                        }}
                    >
                        {drawer}
                    </Drawer>
                </Box>
            </Box>

        </>
    );

}

Menu.propTypes = {
    /**
     * Injected by the documentation to work in an iframe.
     * You won't need it on your project.
     */
    window: PropTypes.func,
};

export default Menu;