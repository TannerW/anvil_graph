// import React from 'react';
import ReactDOM from 'react-dom/client';
import '../index.css';
import Graph from '../Graph';

import * as GraphStaticData from '../GraphStaticData';

import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
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
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import cytoscape from 'cytoscape';
import cxtmenu from 'cytoscape-cxtmenu';
import CytoscapeComponent from "react-cytoscapejs";

import { cyContext } from './cyContext';
import { useContext } from "react";
import * as config from '../GraphConfig';
import { NextPlanRounded } from '@mui/icons-material';

const drawerWidth = 200;

// export function MyComponent() {
//     let hrefOrigin = React.useRef()

//     React.useEffect( () => {  
//        hrefOrigin.current= window.location.ancestorOrigins
//   }, []);

//   return (<div>

//                        <div>
//                             {hrefOrigin.current && <p>Reference: {hrefOrigin.current}</p>}
//                        </div>
//           </div>)
//   }

function Menu(props) {
    const { window } = props;

    const { myCy, setMyCy, graph_layout, setGraph_layout } = useContext(cyContext);

    console.log("myCyRef - menu - context", myCy);

    const zoom_test = () => {
        myCy.zoom(2);
    };

    function zoom_to(newVal) {
        console.log(newVal);
        if (newVal === undefined || newVal === null) {
            let node_zoom_to = myCy.nodes()
            myCy.animate({
                fit: {
                    eles: node_zoom_to,
                }
            }, {
                duration: 1000
            });
        }
        else {
            let node_zoom_to = myCy.nodes('[id="' + newVal.id + '"]')
            node_zoom_to.select()
            myCy.animate({
                fit: {
                    eles: node_zoom_to,
                }
            }, {
                duration: 1000
            });
        }
    }

    function redoLayout() {
        var core = myCy;
        var layout_subgraph = core.elements().not(':hidden').layout(graph_layout);

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
        var core = myCy;
        var edges = core.elements(':visible').connectedEdges();
        edges.style("display", "element");
        edges.targets().style("display", "element");
        edges.sources().style("display", "element");

        // finally, make all edges between visible nodes visible
        var inter_edges = core.nodes(':visible').edgesTo(':visible')
        inter_edges.style("display", "element");

        redoLayout();
    }

    const [view, setView] = React.useState('list');

    const view_to_layout = new Map();
    view_to_layout.set('dagre', config.layout_dagre);
    view_to_layout.set('breadthfirst', config.layout_bf);
    view_to_layout.set('circle', config.layout_circle);
    view_to_layout.set('concentric', config.layout_concentric);

    const handleChange_layoutselect = (event, nextView) => {
        setView(nextView);
        console.log(nextView);
        console.log(event);
        try {
            var layout;
            if (nextView != null) {
                layout = view_to_layout.get(nextView);
            }
            else {
                layout = graph_layout;
            }
            setGraph_layout(layout);
            var layout_graph = myCy.elements().not(':hidden').layout(layout);

            layout_graph.run();
            console.log("Setting graph layout to: ", layout.name)
        }
        catch {
            console.log("menu init - setLayout")
        }
    };


    const setLayout = (layout) => {
        try {
            setGraph_layout(layout);
            var layout_graph = myCy.elements().not(':hidden').layout(layout);

            layout_graph.run();
            console.log("Setting graph layout to: ", layout.name)
        }
        catch {
            console.log("menu init - setLayout")
        }
    }

    const [state, setState] = React.useState(false);

    const toggleDrawer = () => {
        setState(!state);
    };

    const drawer = (
        <div>
            <Toolbar />
            <Divider />
            <p>Layout</p>
            <ToggleButtonGroup
                orientation="vertical"
                value={view}
                exclusive
                onChange={handleChange_layoutselect}
            >
                <ToggleButton value="dagre" aria-label="list">
                    <ListItemText primary={"Dagre"} />
                </ToggleButton>
                <ToggleButton value="breadthfirst" aria-label="module">
                    <ListItemText primary={"BreadthFirst"} />
                </ToggleButton>
                <ToggleButton value="circle" aria-label="quilt">
                    <ListItemText primary={"Circle"} />
                </ToggleButton>
                <ToggleButton value="concentric" aria-label="quilt">
                    <ListItemText primary={"Concentric"} />
                </ToggleButton>
            </ToggleButtonGroup>
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

    var referrer_test2 = ""

    var autocomplete_mapping = []

    try {
        for (const node of myCy.nodes(':visible')) {
            if (node.data('type') == 'article') {
                autocomplete_mapping.push({ label: node.data('label'), id: node.data('id') })
            }
        }
    }
    catch {
        for (const node of GraphStaticData.GraphStaticData_dict['nodes']) {
            if (node['data']['type'] == 'article') {
                autocomplete_mapping.push({ label: node['data']['label'], id: node['data']['id'] })
            }
        }
    }


    return (
        <>
            {/* <MyComponent/> */}
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
                            Cytoscape example | {referrer} | {referrer_test2}
                        </Typography>
                        <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            options={autocomplete_mapping}
                            onChange={(event, newValue) => {
                                zoom_to(newValue);
                            }}
                            sx={{ width: 300 }}
                            renderInput={(params) => <TextField {...params} label="Article Name" />}
                        />
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