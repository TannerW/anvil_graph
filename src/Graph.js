// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;

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
import './index.css';

import React, { useState } from "react";
import cytoscape from 'cytoscape';
import cxtmenu from 'cytoscape-cxtmenu';
import CytoscapeComponent from "react-cytoscapejs";
import cyCanvas from "cytoscape-canvas";
// import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
// import IFrameTest from './pages/iframetest';
// import klay from 'cytoscape-klay';
// import elk from 'cytoscape-elk';
import dagre from 'cytoscape-dagre';

cytoscape.use(dagre);

// cytoscape.use( elk );

// cytoscape.use( klay );

cytoscape.use(cxtmenu); // register extension


const drawerWidth = 200;

function Graph(props) {


  function redoLayout(ele) {
    // var core = ele.cy();
    // var layout_subgraph = core.elements().not(':hidden').layout(layout);

    // layout_subgraph.run();

    // core.animate({
    //   fit: {
    //     eles: ele.cy().elements(':visible'),
    //   }
    // }, {
    //   duration: 10
    // });
  }

  function ShowHideNodeChildren(ele) {
    try {
      if (ele.outgoers()[0].style("display") == "none") {
        //show the nodes and edges
        ele.outgoers().style("display", "element");
      } else {
        //hide the children nodes and edges recursively
        ele.outgoers().edges().style("display", "none");
        // ele.successors().style("display", "none");
        for (const target_i of ele.outgoers().targets()) {
          let anyVisible = false;
          for (const edge_i of target_i.incomers().edges()) {
            if (edge_i.style("display") != "none") {
              console.log(edge_i.style("display"));
              anyVisible = true;
            }
          }
          if (!anyVisible) {
            target_i.style("display", "none")
          }
        }
      }
      redoLayout(ele);
    } catch {
      console.log("Tried expansion/collapse... something didn't work. This might be because there was nothing to collapse or expand.");
    }
  }

  function ExpandNeighborhoodOneHop(ele) {
    var core = ele.cy();
    var edges = core.elements(':visible').connectedEdges();
    edges.style("display", "element");
    edges.targets().style("display", "element");
    edges.sources().style("display", "element");

    // finally, make all edges between visible nodes visible
    var inter_edges = core.nodes(':visible').edgesTo(':visible')
    inter_edges.style("display", "element");

    redoLayout(ele);
  }

  const [width, setWith] = useState("100%");
  const [height, setHeight] = useState("600px");
  const [graphData, setGraphData] = useState({
    nodes: [
      { data: { id: "1", label: "IP 1", type: "ip", url: "https://www.worldanvil.com/dashboard/" } },
      { data: { id: "2", label: "Device 1", type: "device" } },
      { data: { id: "3", label: "IP 2", type: "ip", url: "http://192.168.1.37:3000/iframetest" } },
      { data: { id: "4", label: "Device 2", type: "device" } },
      { data: { id: "5", label: "Device 3", type: "device" } },
      { data: { id: "6", label: "IP 3", type: "ip" } },
      { data: { id: "7", label: "Device 5", type: "device" } },
      { data: { id: "8", label: "Device 6", type: "device" } },
      { data: { id: "9", label: "Device 7", type: "device" } },
      { data: { id: "10", label: "Device 8", type: "device" } },
      { data: { id: "11", label: "Device 9", type: "device" } },
      { data: { id: "12", label: "IP 3", type: "ip" } },
      { data: { id: "13", label: "Device 10", type: "device" } },
      { data: { id: "14", label: "Device 11", type: "device" } },
      { data: { id: "15", label: "Device 12", type: "device" } },
      { data: { id: "16", label: "Device 13", type: "device" } },
      { data: { id: "17", label: "Device 14", type: "device" } }
    ],
    edges: [
      {
        data: { source: "1", target: "2", label: "Node2" }
      },
      {
        data: { source: "3", target: "4", label: "Node4" }
      },
      {
        data: { source: "3", target: "5", label: "Node5" }
      },
      {
        data: { source: "6", target: "5", label: " 6 -> 5" }
      },
      {
        data: { source: "6", target: "7", label: " 6 -> 7" }
      },
      {
        data: { source: "6", target: "8", label: " 6 -> 8" }
      },
      {
        data: { source: "6", target: "9", label: " 6 -> 9" }
      },
      {
        data: { source: "3", target: "13", label: " 3 -> 13" }
      },
      {
        data: { source: "14", target: "3", label: " 3 -> 13" }
      },
      {
        data: { source: "15", target: "3", label: " 3 -> 13" }
      },
      {
        data: { source: "16", target: "3", label: " 3 -> 13" }
      },
      {
        data: { source: "17", target: "3", label: " 3 -> 13" }
      },
      {
        data: { source: "17", target: "16", label: " 3 -> 13" }
      }
    ]
  });

  // const layout = {
  //   name: "breadthfirst",
  //   fit: true,
  //   // circle: true,
  //   directed: true,
  //   padding: 50,
  //   // spacingFactor: 1.5,
  //   animate: true,
  //   animationDuration: 1000,
  //   avoidOverlap: true,
  //   nodeDimensionsIncludeLabels: false
  // };

  // const layout = {
  //   name: 'circle',

  //   fit: true, // whether to fit the viewport to the graph
  //   padding: 30, // the padding on fit
  //   boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
  //   avoidOverlap: true, // prevents node overlap, may overflow boundingBox and radius if not enough space
  //   nodeDimensionsIncludeLabels: false, // Excludes the label when calculating node bounding boxes for the layout algorithm
  //   spacingFactor: undefined, // Applies a multiplicative factor (>0) to expand or compress the overall area that the nodes take up
  //   radius: undefined, // the radius of the circle
  //   startAngle: 3 / 2 * Math.PI, // where nodes start in radians
  //   sweep: undefined, // how many radians should be between the first and last node (defaults to full circle)
  //   clockwise: true, // whether the layout should go clockwise (true) or counterclockwise/anticlockwise (false)
  //   sort: undefined, // a sorting function to order the nodes; e.g. function(a, b){ return a.data('weight') - b.data('weight') }
  //   animate: false, // whether to transition the node positions
  //   animationDuration: 500, // duration of animation in ms if enabled
  //   animationEasing: undefined, // easing of animation if enabled
  //   animateFilter: function ( node, i ){ return true; }, // a function that determines whether the node should be animated.  All nodes animated by default on animate enabled.  Non-animated nodes are positioned immediately when the layout starts
  //   ready: undefined, // callback on layoutready
  //   stop: undefined, // callback on layoutstop
  //   transform: function (node, position ){ return position; } // transform a given node position. Useful for changing flow direction in discrete layouts 

  // };

  // const layout = {
  //   name: 'concentric',

  //   fit: true, // whether to fit the viewport to the graph
  //   padding: 30, // the padding on fit
  //   startAngle: 3 / 2 * Math.PI, // where nodes start in radians
  //   sweep: undefined, // how many radians should be between the first and last node (defaults to full circle)
  //   clockwise: true, // whether the layout should go clockwise (true) or counterclockwise/anticlockwise (false)
  //   equidistant: false, // whether levels have an equal radial distance betwen them, may cause bounding box overflow
  //   minNodeSpacing: 10, // min spacing between outside of nodes (used for radius adjustment)
  //   boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
  //   avoidOverlap: true, // prevents node overlap, may overflow boundingBox if not enough space
  //   nodeDimensionsIncludeLabels: false, // Excludes the label when calculating node bounding boxes for the layout algorithm
  //   height: undefined, // height of layout area (overrides container height)
  //   width: undefined, // width of layout area (overrides container width)
  //   spacingFactor: undefined, // Applies a multiplicative factor (>0) to expand or compress the overall area that the nodes take up
  //   concentric: function( node ){ // returns numeric value for each node, placing higher nodes in levels towards the centre
  //   return node.degree();
  //   },
  //   levelWidth: function( nodes ){ // the variation of concentric values in each level
  //   return nodes.maxDegree() / 4;
  //   },
  //   animate: false, // whether to transition the node positions
  //   animationDuration: 500, // duration of animation in ms if enabled
  //   animationEasing: undefined, // easing of animation if enabled
  //   animateFilter: function ( node, i ){ return true; }, // a function that determines whether the node should be animated.  All nodes animated by default on animate enabled.  Non-animated nodes are positioned immediately when the layout starts
  //   ready: undefined, // callback on layoutready
  //   stop: undefined, // callback on layoutstop
  //   transform: function (node, position ){ return position; } // transform a given node position. Useful for changing flow direction in discrete layouts
  // };

  // const layout = {
  //   name: 'klay',
  //   nodeDimensionsIncludeLabels: false, // Boolean which changes whether label dimensions are included when calculating node dimensions
  //   fit: true, // Whether to fit
  //   padding: 20, // Padding on fit
  //   animate: false, // Whether to transition the node positions
  //   animateFilter: function( node, i ){ return true; }, // Whether to animate specific nodes when animation is on; non-animated nodes immediately go to their final positions
  //   animationDuration: 500, // Duration of animation in ms if enabled
  //   animationEasing: undefined, // Easing of animation if enabled
  //   transform: function( node, pos ){ return pos; }, // A function that applies a transform to the final node position
  //   ready: undefined, // Callback on layoutready
  //   stop: undefined, // Callback on layoutstop
  //   // Following descriptions taken from http://layout.rtsys.informatik.uni-kiel.de:9444/Providedlayout.html?algorithm=de.cau.cs.kieler.klay.layered
  //   addUnnecessaryBendpoints: false, // Adds bend points even if an edge does not change direction.
  //   aspectRatio: 1.6, // The aimed aspect ratio of the drawing, that is the quotient of width by height
  //   borderSpacing: 20, // Minimal amount of space to be left to the border
  //   compactComponents: false, // Tries to further compact components (disconnected sub-graphs).
  //   crossingMinimization: 'LAYER_SWEEP', // Strategy for crossing minimization.
  //   /* LAYER_SWEEP The layer sweep algorithm iterates multiple times over the layers, trying to find node orderings that minimize the number of crossings. The algorithm uses randomization to increase the odds of finding a good result. To improve its results, consider increasing the Thoroughness option, which influences the number of iterations done. The Randomization seed also influences results.
  //   INTERACTIVE Orders the nodes of each layer by comparing their positions before the layout algorithm was started. The idea is that the relative order of nodes as it was before layout was applied is not changed. This of course requires valid positions for all nodes to have been set on the input graph before calling the layout algorithm. The interactive layer sweep algorithm uses the Interactive Reference Point option to determine which reference point of nodes are used to compare positions. */
  //   cycleBreaking: 'GREEDY', // Strategy for cycle breaking. Cycle breaking looks for cycles in the graph and determines which edges to reverse to break the cycles. Reversed edges will end up pointing to the opposite direction of regular edges (that is, reversed edges will point left if edges usually point right).
  //   /* GREEDY This algorithm reverses edges greedily. The algorithm tries to avoid edges that have the Priority property set.
  //   INTERACTIVE The interactive algorithm tries to reverse edges that already pointed leftwards in the input graph. This requires node and port coordinates to have been set to sensible values.*/
  //   direction: 'UNDEFINED', // Overall direction of edges: horizontal (right / left) or vertical (down / up)
  //   /* UNDEFINED, RIGHT, LEFT, DOWN, UP */
  //   edgeRouting: 'ORTHOGONAL', // Defines how edges are routed (POLYLINE, ORTHOGONAL, SPLINES)
  //   edgeSpacingFactor: 0.5, // Factor by which the object spacing is multiplied to arrive at the minimal spacing between edges.
  //   feedbackEdges: false, // Whether feedback edges should be highlighted by routing around the nodes.
  //   fixedAlignment: 'NONE', // Tells the BK node placer to use a certain alignment instead of taking the optimal result.  This option should usually be left alone.
  //   /* NONE Chooses the smallest layout from the four possible candidates.
  //   LEFTUP Chooses the left-up candidate from the four possible candidates.
  //   RIGHTUP Chooses the right-up candidate from the four possible candidates.
  //   LEFTDOWN Chooses the left-down candidate from the four possible candidates.
  //   RIGHTDOWN Chooses the right-down candidate from the four possible candidates.
  //   BALANCED Creates a balanced layout from the four possible candidates. */
  //   inLayerSpacingFactor: 1.0, // Factor by which the usual spacing is multiplied to determine the in-layer spacing between objects.
  //   layoutHierarchy: false, // Whether the selected layouter should consider the full hierarchy
  //   linearSegmentsDeflectionDampening: 0.3, // Dampens the movement of nodes to keep the diagram from getting too large.
  //   mergeEdges: false, // Edges that have no ports are merged so they touch the connected nodes at the same points.
  //   mergeHierarchyCrossingEdges: true, // If hierarchical layout is active, hierarchy-crossing edges use as few hierarchical ports as possible.
  //   nodeLayering:'NETWORK_SIMPLEX', // Strategy for node layering.
  //   /* NETWORK_SIMPLEX This algorithm tries to minimize the length of edges. This is the most computationally intensive algorithm. The number of iterations after which it aborts if it hasn't found a result yet can be set with the Maximal Iterations option.
  //   LONGEST_PATH A very simple algorithm that distributes nodes along their longest path to a sink node.
  //   INTERACTIVE Distributes the nodes into layers by comparing their positions before the layout algorithm was started. The idea is that the relative horizontal order of nodes as it was before layout was applied is not changed. This of course requires valid positions for all nodes to have been set on the input graph before calling the layout algorithm. The interactive node layering algorithm uses the Interactive Reference Point option to determine which reference point of nodes are used to compare positions. */
  //   nodePlacement:'BRANDES_KOEPF', // Strategy for Node Placement
  //   /* BRANDES_KOEPF Minimizes the number of edge bends at the expense of diagram size: diagrams drawn with this algorithm are usually higher than diagrams drawn with other algorithms.
  //   LINEAR_SEGMENTS Computes a balanced placement.
  //   INTERACTIVE Tries to keep the preset y coordinates of nodes from the original layout. For dummy nodes, a guess is made to infer their coordinates. Requires the other interactive phase implementations to have run as well.
  //   SIMPLE Minimizes the area at the expense of... well, pretty much everything else. */
  //   randomizationSeed: 1, // Seed used for pseudo-random number generators to control the layout algorithm; 0 means a new seed is generated
  //   routeSelfLoopInside: false, // Whether a self-loop is routed around or inside its node.
  //   separateConnectedComponents: true, // Whether each connected component should be processed separately
  //   spacing: 20, // Overall setting for the minimal amount of space to be left between objects
  //   thoroughness: 7 // How much effort should be spent to produce a nice layout..
  // };

  // var layout = {
  //   name: 'elk',
  //   nodeDimensionsIncludeLabels: true, // Boolean which changes whether label dimensions are included when calculating node dimensions
  //   fit: true, // Whether to fit
  //   padding: 20, // Padding on fit
  //   animate: false, // Whether to transition the node positions
  //   animateFilter: function( node, i ){ return true; }, // Whether to animate specific nodes when animation is on; non-animated nodes immediately go to their final positions
  //   animationDuration: 500, // Duration of animation in ms if enabled
  //   animationEasing: undefined, // Easing of animation if enabled
  //   transform: function( node, pos ){ return pos; }, // A function that applies a transform to the final node position
  //   ready: undefined, // Callback on layoutready
  //   stop: undefined, // Callback on layoutstop
  //   elk: {
  //     // All options are available at http://www.eclipse.org/elk/reference.html
  //     //
  //     // 'org.eclipse.' can be dropped from the identifier. The subsequent identifier has to be used as property key in quotes.
  //     // E.g. for 'org.eclipse.elk.direction' use:
  //     // 'elk.direction'
  //     //
  //     // Enums use the name of the enum as string e.g. instead of Direction.DOWN use:
  //     // 'elk.direction': 'DOWN'
  //     //
  //     // The main field to set is `algorithm`, which controls which particular layout algorithm is used.
  //     // Example (downwards layered layout):
  //     'algorithm': 'layered',
  //     'elk.direction': 'DOWN',
  //   },
  //   priority: function( edge ){ return null; }, // Edges with a non-nil value are skipped when geedy edge cycle breaking is enabled
  // };


  var layout = {
    name: 'dagre',
    // dagre algo options, uses default value on undefined
    nodeSep: undefined, // the separation between adjacent nodes in the same rank
    edgeSep: undefined, // the separation between adjacent edges in the same rank
    rankSep: undefined, // the separation between each rank in the layout
    rankDir: undefined, // 'TB' for top to bottom flow, 'LR' for left to right,
    align: undefined,  // alignment for rank nodes. Can be 'UL', 'UR', 'DL', or 'DR', where U = up, D = down, L = left, and R = right
    acyclicer: undefined, // If set to 'greedy', uses a greedy heuristic for finding a feedback arc set for a graph.
    // A feedback arc set is a set of edges that can be removed to make a graph acyclic.
    ranker: undefined, // Type of algorithm to assign a rank to each node in the input graph. Possible values: 'network-simplex', 'tight-tree' or 'longest-path'
    minLen: function (edge) { return 1; }, // number of ranks to keep between the source and target of the edge
    edgeWeight: function (edge) { return 1; }, // higher weight edges are generally made shorter and straighter than lower weight edges

    // general layout options
    fit: true, // whether to fit to viewport
    padding: 30, // fit padding
    spacingFactor: undefined, // Applies a multiplicative factor (>0) to expand or compress the overall area that the nodes take up
    nodeDimensionsIncludeLabels: true, // whether labels should be included in determining the space used by a node
    animate: false, // whether to transition the node positions
    animateFilter: function (node, i) { return true; }, // whether to animate specific nodes when animation is on; non-animated nodes immediately go to their final positions
    animationDuration: 10, // duration of animation in ms if enabled
    animationEasing: undefined, // easing of animation if enabled
    boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
    transform: function (node, pos) { return pos; }, // a function that applies a transform to the final node position
    ready: function () { }, // on layoutready
    sort: undefined, // a sorting function to order the nodes and edges; e.g. function(a, b){ return a.data('weight') - b.data('weight') }
    // because cytoscape dagre creates a directed graph, and directed graphs use the node order as a tie breaker when
    // defining the topology of a graph, this sort function can help ensure the correct order of the nodes/edges.
    // this feature is most useful when adding and removing the same nodes and edges multiple times in a graph.
    stop: function () { } // on layoutstop
  };

  const styleSheet = [
    {
      selector: "node",
      style: {
        backgroundColor: "#4a56a6",
        width: 30,
        height: 30,
        label: "data(label)",

        // "width": "mapData(score, 0, 0.006769776522008331, 20, 60)",
        // "height": "mapData(score, 0, 0.006769776522008331, 20, 60)",
        // "text-valign": "center",
        // "text-halign": "center",
        "overlay-padding": "6px",
        "z-index": "10",
        //text props
        "text-outline-color": "#4a56a6",
        "text-outline-width": "2px",
        color: "white",
        fontSize: 20
      }
    },
    {
      selector: "node:selected",
      style: {
        "border-width": "6px",
        "border-color": "#AAD8FF",
        "border-opacity": "0.5",
        "background-color": "#77828C",
        width: 50,
        height: 50,
        //text props
        "text-outline-color": "#77828C",
        "text-outline-width": 8
      }
    },
    {
      selector: "node[type='device']",
      style: {
        shape: "rectangle"
      }
    },
    {
      selector: "edge",
      style: {
        width: 3,
        // "line-color": "#6774cb",
        "line-color": "#AAD8FF",
        "target-arrow-color": "#6774cb",
        "target-arrow-shape": "triangle",
        "curve-style": "bezier"
      }
    }
  ];

  let myCyRef;

  // the default values of each option are outlined below:
  let defaults = {
    menuRadius: function (ele) { return 100; }, // the outer radius (node center to the end of the menu) in pixels. It is added to the rendered size of the node. Can either be a number or function as in the example.
    selector: 'node', // elements matching this Cytoscape.js selector will trigger cxtmenus
    commands: [ // an array of commands to list in the menu or a function that returns the array

      { // example command
        fillColor: 'rgba(200, 200, 200, 0.75)', // optional: custom background color for item
        content: 'Show/hide children', // html/text content to be displayed in the menu
        contentStyle: {}, // css key:value pairs to set the command's css in js if you want
        select: function (ele) { // a function to execute when the command is selected
          ShowHideNodeChildren(ele);
        },
        enabled: true // whether the command is selectable
      },
      { // example command
        fillColor: 'rgba(200, 200, 200, 0.75)', // optional: custom background color for item
        content: 'Go to page', // html/text content to be displayed in the menu
        contentStyle: {}, // css key:value pairs to set the command's css in js if you want
        select: function (ele) { // a function to execute when the command is selected
          console.log(ele.data());
          window.open(ele.data().url, '_blank');
        },
        enabled: true // whether the command is selectable
      },
      { // example command
        fillColor: 'rgba(200, 200, 200, 0.75)', // optional: custom background color for item
        content: 'Expand by one', // html/text content to be displayed in the menu
        contentStyle: {}, // css key:value pairs to set the command's css in js if you want
        select: function (ele) { // a function to execute when the command is selected
          ExpandNeighborhoodOneHop(ele);
        },
        enabled: true // whether the command is selectable
      }

    ], // function( ele ){ return [ /*...*/ ] }, // a function that returns commands or a promise of commands
    fillColor: 'rgba(0, 0, 0, 0.75)', // the background colour of the menu
    activeFillColor: 'rgba(1, 105, 217, 0.75)', // the colour used to indicate the selected command
    activePadding: 20, // additional size in pixels for the active command
    indicatorSize: 24, // the size in pixels of the pointer to the active command, will default to the node size if the node size is smaller than the indicator size, 
    separatorWidth: 3, // the empty spacing in pixels between successive commands
    spotlightPadding: 4, // extra spacing in pixels between the element and the spotlight
    adaptativeNodeSpotlightRadius: false, // specify whether the spotlight radius should adapt to the node size
    minSpotlightRadius: 24, // the minimum radius in pixels of the spotlight (ignored for the node if adaptativeNodeSpotlightRadius is enabled but still used for the edge & background)
    maxSpotlightRadius: 38, // the maximum radius in pixels of the spotlight (ignored for the node if adaptativeNodeSpotlightRadius is enabled but still used for the edge & background)
    openMenuEvents: 'cxttapstart taphold', // space-separated cytoscape events that will open the menu; only `cxttapstart` and/or `taphold` work here
    itemColor: 'white', // the colour of text in the command's content
    itemTextShadowColor: 'transparent', // the text shadow colour of the command's content
    zIndex: 9999, // the z-index of the ui div
    atMouse: false, // draw menu at mouse position
    outsideMenuCancel: false // if set to a number, this will cancel the command if the pointer is released outside of the spotlight, padded by the number given 
  };

  const { window } = props;

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
        <Button>One</Button>
        <Button>Two</Button>
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
        <Box
          component="main"
          sx={{ flexGrow: 1, p: 3, width: { sm: `100%` } }}
        >
          <Toolbar />
          <div>
            {/* <h1>Cytoscape example | {referrer}</h1> */}
            <div
              style={{
                border: "1px solid",
                backgroundColor: "#f5f6fe"
              }}
            >
              <CytoscapeComponent
                elements={CytoscapeComponent.normalizeElements(graphData)}
                // pan={{ x: 200, y: 200 }}
                style={{ width: width, height: height }}
                zoomingEnabled={true}
                maxZoom={3}
                minZoom={0.1}
                autounselectify={false}
                boxSelectionEnabled={true}
                // layout={layout}
                stylesheet={styleSheet}
                cy={cy => {

                  if (referrer != "") {
                    console.log(referrer);
                    let hidden_nodes = cy.nodes('[url != "' + referrer + '"]');
                    hidden_nodes.style("display", "none");
                    hidden_nodes.connectedEdges().style("display", "none");

                    let referring_nodes = cy.nodes('[url = "' + referrer + '"]');
                    referring_nodes.style("border-color", "red");
                    referring_nodes.style("border-width", "4px");
                    referring_nodes.connectedEdges().style("display", "element");
                    referring_nodes.connectedEdges().targets().style("display", "element");
                    referring_nodes.connectedEdges().sources().style("display", "element");

                    // finally, make all edges between visible nodes visible
                    var inter_edges = cy.nodes(':visible').edgesTo(':visible')
                    inter_edges.style("display", "element");

                    console.log(referring_nodes.size())

                    var layout_subgraph = cy.elements().not(':hidden').layout(layout);

                    layout_subgraph.run();

                    cy.animate({
                      fit: {
                        eles: cy.elements(':visible'),
                      }
                    }, {
                      duration: 100
                    });

                  }
                  else {
                    var default_layout = cy.layout(layout);
                    default_layout.run();
                  }

                  myCyRef = cy;
                  console.log("myCyRef", myCyRef)

                  cy.cxtmenu(defaults);

                  console.log("EVT", cy);

                  cy.on("tap", "node", evt => {
                    var node = evt.target;
                    console.log("EVT", evt);
                    console.log("TARGET", node.data());
                    console.log("TARGET TYPE", typeof node[0]);
                  });

                  cy.on('tap', 'node', function () {
                    //if the node's children have been hidden
                    //getting the element at 1 because the element at 0 is the node itself
                    //want to check if its children are hidden
                    /*if (this.connectedEdges().targets()[0].style("display") == "none"){
                      //show the nodes and edges
                      this.connectedEdges().targets().style("display", "element");
                    } else {
                      //hide the children nodes and edges recursively
                      this.successors().targets().style("display", "none");
                    }*/

                    //ShowHideNodeChildren(this);
                  });

                }}
                abc={console.log("myCyRef", myCyRef)}
              />
            </div>
          </div>
        </Box>
      </Box>
    </>

  );
}

Graph.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default Graph;
