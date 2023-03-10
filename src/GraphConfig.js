import LabelSharpIcon from '@mui/icons-material/LabelSharp';
import PersonSharpIcon from '@mui/icons-material/PersonSharp';
import Groups2SharpIcon from '@mui/icons-material/Groups2Sharp';
import HomeSharpIcon from '@mui/icons-material/HomeSharp';
import InsertDriveFileSharpIcon from '@mui/icons-material/InsertDriveFileSharp';
import HistoryEduSharpIcon from '@mui/icons-material/HistoryEduSharp';
import RoomSharpIcon from '@mui/icons-material/RoomSharp';
import PushPinSharpIcon from '@mui/icons-material/PushPinSharp';
import WcSharpIcon from '@mui/icons-material/WcSharp';
import DiamondSharpIcon from '@mui/icons-material/DiamondSharp';
import MilitaryTechSharpIcon from '@mui/icons-material/MilitaryTechSharp';
import WorkSharpIcon from '@mui/icons-material/WorkSharp';
import SportsMmaSharpIcon from '@mui/icons-material/SportsMmaSharp';
import ElectricRickshawSharpIcon from '@mui/icons-material/ElectricRickshawSharp';
import ArticleSharpIcon from '@mui/icons-material/ArticleSharp';
import AutoStoriesSharpIcon from '@mui/icons-material/AutoStoriesSharp';
import BackpackSharpIcon from '@mui/icons-material/BackpackSharp';
import ReactDOMServer from 'react-dom/server';
import { pathDataToPolys } from 'svg-path-to-polygons';

function getSVGBackground(ele, base_height_width)
{
    const height_width = base_height_width + (ele.data('pagerank')*2000)
    const parser = new DOMParser();
    var svgDocString = ""
    if (ele.data('subtype') == 'person'){
        svgDocString = ReactDOMServer.renderToString(<PersonSharpIcon />)
    }
    else if (ele.data('subtype') == 'article'){
        svgDocString = ReactDOMServer.renderToString(<ArticleSharpIcon />)
    }
    else if (ele.data('subtype') == 'item'){
        svgDocString = ReactDOMServer.renderToString(<BackpackSharpIcon />)
    }
    else if (ele.data('subtype') == 'myth'){
        svgDocString = ReactDOMServer.renderToString(<AutoStoriesSharpIcon />)
    }
    else if (ele.data('subtype') == 'organization'){
        svgDocString = ReactDOMServer.renderToString(<Groups2SharpIcon />)
    }
    else if (ele.data('subtype') == 'settlement'){
        svgDocString = ReactDOMServer.renderToString(<HomeSharpIcon />)
    }
    else if (ele.data('subtype') == 'report'){
        svgDocString = ReactDOMServer.renderToString(<InsertDriveFileSharpIcon />)
    }
    else if (ele.data('subtype') == 'landmark'){
        svgDocString = ReactDOMServer.renderToString(<RoomSharpIcon />)
    }
    else if (ele.data('subtype') == 'location'){
        svgDocString = ReactDOMServer.renderToString(<PushPinSharpIcon />)
    }
    else if (ele.data('subtype') == 'plot'){
        svgDocString = ReactDOMServer.renderToString(<HistoryEduSharpIcon />)
    }
    else if (ele.data('subtype') == 'technology'){
        svgDocString = ReactDOMServer.renderToString(<DiamondSharpIcon />)
    }
    else if (ele.data('subtype') == 'species'){
        svgDocString = ReactDOMServer.renderToString(<WcSharpIcon />)
    }
    else if (ele.data('subtype') == 'rank'){
        svgDocString = ReactDOMServer.renderToString(<MilitaryTechSharpIcon />)
    }
    else if (ele.data('subtype') == 'profession'){
        svgDocString = ReactDOMServer.renderToString(<WorkSharpIcon />)
    }
    else if (ele.data('subtype') == 'militaryConflict'){
        svgDocString = ReactDOMServer.renderToString(<SportsMmaSharpIcon />)
    }
    else if (ele.data('subtype') == 'vehicle'){
        svgDocString = ReactDOMServer.renderToString(<ElectricRickshawSharpIcon />)
    }
    const svgDoc = parser.parseFromString(svgDocString, 'image/svg+xml');
    const iconPath = String(svgDoc.querySelector('path')?.getAttribute('d'));
    // console.log(iconPath)
    const svg_pin = '<svg width="'+height_width+'" height="'+height_width+'" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="'+iconPath+'" fill="white"></path></svg>';
    const report_svgURI = encodeURI("data:image/svg+xml;utf-8," + svg_pin);
    // console.log(report_svgURI)
    return report_svgURI
}

function normalize_array(array)
{
    console.log("array", array);

    const min = Math.min(...array);

    console.log("min", min);

    let newSet = array.map(n => (n/min) - 1);

    console.log("min-ed", newSet);

    const max = Math.max(...newSet);

    console.log("max", max);

    newSet = newSet.map(n => n/max);

    console.log("max-ed", newSet);

    newSet = newSet.map(n => (n*2) - 1);

    console.log("normed-ed", newSet);

    return newSet;
}

function getEditIconPath(iconString) {
    // const iconString = ReactDOMServer.renderToString(<LabelSharpIcon />);
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(iconString, 'image/svg+xml');
    const iconPath = String(svgDoc.querySelector('path')?.getAttribute('d'));
    console.log("tag_icon_path", iconPath);

    var json_string = JSON.stringify(pathDataToPolys(iconPath, {tolerance:100, decimals:100}));

    console.log("tag_poly_string", json_string);

    json_string = json_string.replaceAll('[', '').replaceAll(']', '');

    console.log("tag_poly_string", json_string);

    var path_array = json_string.split(",")

    var path_array_num_x = [];
    var path_array_num_y = [];
    for (var i = 0; i < path_array.length; i=i+2) {
        path_array_num_x.push(Number(path_array[i]));
        path_array_num_y.push(Number(path_array[i+1]));
    }

    path_array_num_x = normalize_array(path_array_num_x);
    path_array_num_y = normalize_array(path_array_num_y);

    var path_array_num = [];
    for (i = 0; i < path_array_num_x.length; i++) {
        path_array_num.push(Number(path_array_num_x[i]));
        path_array_num.push(Number(path_array_num_y[i]));
    }

    console.log("final", path_array_num);
    return path_array_num;
  };

  let tag_path = getEditIconPath(ReactDOMServer.renderToString(<LabelSharpIcon />));
  console.log("tag_css_path", tag_path);

  //   let report_path = getEditIconPath(ReactDOMServer.renderToString(<InsertDriveFileSharpIcon />));
  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(ReactDOMServer.renderToString(<InsertDriveFileSharpIcon />), 'image/svg+xml');
  const iconPath = String(svgDoc.querySelector('path')?.getAttribute('d'));
  console.log(iconPath)
  const svg_pin = '<svg width="24" height="24" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="'+iconPath+'" fill="white"></path></svg>';
  const report_svgURI = encodeURI("data:image/svg+xml;utf-8," + svg_pin);
  console.log(report_svgURI)

export const layout_bf = {
  name: "breadthfirst",
  fit: true,
  // circle: true,
  directed: true,
  padding: 50,
//   spacingFactor: 1.5,
  animate: true,
  animationDuration: 500,
  avoidOverlap: true,
  nodeDimensionsIncludeLabels: false
};

export const layout_circle = {
  name: 'circle',

  fit: true, // whether to fit the viewport to the graph
  padding: 30, // the padding on fit
  boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
  avoidOverlap: true, // prevents node overlap, may overflow boundingBox and radius if not enough space
  nodeDimensionsIncludeLabels: false, // Excludes the label when calculating node bounding boxes for the layout algorithm
  spacingFactor: undefined, // Applies a multiplicative factor (>0) to expand or compress the overall area that the nodes take up
  radius: undefined, // the radius of the circle
  startAngle: 3 / 2 * Math.PI, // where nodes start in radians
  sweep: undefined, // how many radians should be between the first and last node (defaults to full circle)
  clockwise: true, // whether the layout should go clockwise (true) or counterclockwise/anticlockwise (false)
  sort: undefined, // a sorting function to order the nodes; e.g. function(a, b){ return a.data('weight') - b.data('weight') }
  animate: true, // whether to transition the node positions
  animationDuration: 500, // duration of animation in ms if enabled
  animationEasing: undefined, // easing of animation if enabled
  animateFilter: function ( node, i ){ return true; }, // a function that determines whether the node should be animated.  All nodes animated by default on animate enabled.  Non-animated nodes are positioned immediately when the layout starts
  ready: undefined, // callback on layoutready
  stop: undefined, // callback on layoutstop
  transform: function (node, position ){ return position; } // transform a given node position. Useful for changing flow direction in discrete layouts 

};

export const layout_concentric = {
  name: 'concentric',

  fit: true, // whether to fit the viewport to the graph
  padding: 30, // the padding on fit
  startAngle: 3 / 2 * Math.PI, // where nodes start in radians
  sweep: undefined, // how many radians should be between the first and last node (defaults to full circle)
  clockwise: true, // whether the layout should go clockwise (true) or counterclockwise/anticlockwise (false)
  equidistant: false, // whether levels have an equal radial distance betwen them, may cause bounding box overflow
  minNodeSpacing: 10, // min spacing between outside of nodes (used for radius adjustment)
  boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
  avoidOverlap: true, // prevents node overlap, may overflow boundingBox if not enough space
  nodeDimensionsIncludeLabels: false, // Excludes the label when calculating node bounding boxes for the layout algorithm
  height: undefined, // height of layout area (overrides container height)
  width: undefined, // width of layout area (overrides container width)
  spacingFactor: 1.25, // Applies a multiplicative factor (>0) to expand or compress the overall area that the nodes take up
  concentric: function( node ){ // returns numeric value for each node, placing higher nodes in levels towards the centre
  return node.degree();
  },
  levelWidth: function( nodes ){ // the variation of concentric values in each level
  return nodes.maxDegree() / 4;
  },
  animate: true, // whether to transition the node positions
  animationDuration: 500, // duration of animation in ms if enabled
  animationEasing: undefined, // easing of animation if enabled
  animateFilter: function ( node, i ){ return true; }, // a function that determines whether the node should be animated.  All nodes animated by default on animate enabled.  Non-animated nodes are positioned immediately when the layout starts
  ready: undefined, // callback on layoutready
  stop: undefined, // callback on layoutstop
  transform: function (node, position ){ return position; } // transform a given node position. Useful for changing flow direction in discrete layouts
};

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

// export const layout = {
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


export const layout_dagre = {
    name: 'dagre',
    // dagre algo options, uses default value on undefined
    nodeSep: undefined, // the separation between adjacent nodes in the same rank
    edgeSep: undefined, // the separation between adjacent edges in the same rank
    rankSep: undefined, // the separation between each rank in the layout
    rankDir: undefined, // 'TB' for top to bottom flow, 'LR' for left to right,
    align: undefined,  // alignment for rank nodes. Can be 'UL', 'UR', 'DL', or 'DR', where U = up, D = down, L = left, and R = right
    acyclicer: 'greedy', // If set to 'greedy', uses a greedy heuristic for finding a feedback arc set for a graph.
    // A feedback arc set is a set of edges that can be removed to make a graph acyclic.
    ranker: 'network-simplex', // Type of algorithm to assign a rank to each node in the input graph. Possible values: 'network-simplex', 'tight-tree' or 'longest-path'
    minLen: function (edge) { return 1; }, // number of ranks to keep between the source and target of the edge
    edgeWeight: function (edge) { return edge.data().weight; }, // higher weight edges are generally made shorter and straighter than lower weight edges
    // edgeWeight: function (edge) { return 1; }, // higher weight edges are generally made shorter and straighter than lower weight edges

    // general layout options
    fit: true, // whether to fit to viewport
    padding: 30, // fit padding
    spacingFactor: undefined, // Applies a multiplicative factor (>0) to expand or compress the overall area that the nodes take up
    nodeDimensionsIncludeLabels: false, // whether labels should be included in determining the space used by a node
    animate: true, // whether to transition the node positions
    animateFilter: function (node, i) { return true; }, // whether to animate specific nodes when animation is on; non-animated nodes immediately go to their final positions
    animationDuration: 500, // duration of animation in ms if enabled
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

export const styleSheet = [
    {
        selector: "node",
        style: {
            backgroundColor: "#4a56a6",
            width: function( ele ){ return 30 + (ele.data('pagerank')*2000) },
            height: function( ele ){ return 30 + (ele.data('pagerank')*2000) },
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
            width: function( ele ){ return 50 + (ele.data('pagerank')*2000) },
            height: function( ele ){ return 50 + (ele.data('pagerank')*2000) },
            //text props
            "text-outline-color": "#77828C",
            "text-outline-width": 8
        }
    },
    {
        selector: "node[type='article']",
        style: {
            shape: "rectangle",
            "background-image": function(ele){
                return getSVGBackground(ele, 25)
            }
        }
    },
    {
        selector: "node[type='category']",
        style: {
            shape: "circle",
        }
    },
    {
        selector: "node[type='tag']",
        style: {
            // shape: "tag"
            shape: 'polygon',
            "shape-polygon-points": tag_path,
        }
    },
    {
        selector: "node[subtype='person']",
        style: {
            // shape: "tag"
            // shape: 'polygon',
            // "shape-polygon-points": person_path,
            "background-image": function(ele){
                return getSVGBackground(ele, 25)
            }
        }
    },
    {
        selector: "node[subtype='organization']",
        style: {
            // shape: "tag"
            // shape: 'polygon',
            // "shape-polygon-points": group_path,
            "background-image": function(ele){
                return getSVGBackground(ele, 25)
            }
        }
    },
    {
        selector: "node[subtype='settlement']",
        style: {
            // shape: "tag"
            // shape: 'polygon',
            // "shape-polygon-points": house_path,
            "background-image": function(ele){
                return getSVGBackground(ele, 25)
            }
        }
    },
    {
        selector: "node[subtype='report']",
        style: {
            // shape: "tag"
            // shape: 'polygon',
            // "shape-polygon-points": report_path,
            "background-image": function(ele){
                return getSVGBackground(ele, 25)
            }
        }
    },
    {
        selector: "node[subtype='plot']",
        style: {
            // shape: "tag"
            // shape: 'polygon',
            // "shape-polygon-points": plot_path,
            "background-image": function(ele){
                return getSVGBackground(ele, 25)
            }
        }
    },
    {
        selector: "node[subtype='item']",
        style: {
            // shape: "tag"
            // shape: 'polygon',
            // "shape-polygon-points": plot_path,
            "background-image": function(ele){
                return getSVGBackground(ele, 25)
            }
        }
    },
    {
        selector: "node[subtype='landmark']",
        style: {
            // shape: "tag"
            // shape: 'polygon',
            // "shape-polygon-points": landmark_path,
            "background-image": function(ele){
                return getSVGBackground(ele, 25)
            }
        }
    },
    {
        selector: "node[subtype='location']",
        style: {
            // shape: "tag"
            // shape: 'polygon',
            // "shape-polygon-points": location_path,
            "background-image": function(ele){
                return getSVGBackground(ele, 25)
            }
        }
    },
    {
        selector: "node[subtype='species']",
        style: {
            // shape: "tag"
            // shape: 'polygon',
            // "shape-polygon-points": species_path,
            "background-image": function(ele){
                return getSVGBackground(ele, 25)
            }
        }
    },

    {
        selector: "node[subtype='myth']",
        style: {
            // shape: "tag"
            // shape: 'polygon',
            // "shape-polygon-points": species_path,
            "background-image": function(ele){
                return getSVGBackground(ele, 25)
            }
        }
    },
    {
        selector: "node[subtype='technology']",
        style: {
            // shape: "tag"
            // shape: 'polygon',
            // "shape-polygon-points": technology_path,
            "background-image": function(ele){
                return getSVGBackground(ele, 25)
            }
        }
    },
    {
        selector: "node[subtype='rank']",
        style: {
            // shape: "tag"
            // shape: 'polygon',
            // "shape-polygon-points": rank_path,
            "background-image": function(ele){
                return getSVGBackground(ele, 25)
            }
        }
    },
    {
        selector: "node[subtype='militaryConflict']",
        style: {
            // shape: "tag"
            // shape: 'polygon',
            // "shape-polygon-points": rank_path,
            "background-image": function(ele){
                return getSVGBackground(ele, 25)
            }
        }
    },
    {
        selector: "node[subtype='profession']",
        style: {
            // shape: "tag"
            // shape: 'polygon',
            // "shape-polygon-points": rank_path,
            "background-image": function(ele){
                return getSVGBackground(ele, 25)
            }
        }
    },
    {
        selector: "node[subtype='vehicle']",
        style: {
            // shape: "tag"
            // shape: 'polygon',
            // "shape-polygon-points": rank_path,
            "background-image": function(ele){
                return getSVGBackground(ele, 25)
            }
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
    },
    {
        selector: "edge[type='tag']",
        style: {
            width: 3,
            // "line-color": "#6774cb",
            "line-color": "#AAD8FF",
            "target-arrow-shape": "none",
            "curve-style": "bezier"
        }
    }
];