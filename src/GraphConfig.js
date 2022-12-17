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


  export const layout = {
    name: 'dagre',
    // dagre algo options, uses default value on undefined
    nodeSep: undefined, // the separation between adjacent nodes in the same rank
    edgeSep: undefined, // the separation between adjacent edges in the same rank
    rankSep: undefined, // the separation between each rank in the layout
    rankDir: undefined, // 'TB' for top to bottom flow, 'LR' for left to right,
    align: undefined,  // alignment for rank nodes. Can be 'UL', 'UR', 'DL', or 'DR', where U = up, D = down, L = left, and R = right
    acyclicer: 'greedy', // If set to 'greedy', uses a greedy heuristic for finding a feedback arc set for a graph.
                          // A feedback arc set is a set of edges that can be removed to make a graph acyclic.
    ranker: undefined, // Type of algorithm to assign a rank to each node in the input graph. Possible values: 'network-simplex', 'tight-tree' or 'longest-path'
    minLen: function( edge ){ return 1; }, // number of ranks to keep between the source and target of the edge
    edgeWeight: function( edge ){ return 1; }, // higher weight edges are generally made shorter and straighter than lower weight edges
  
    // general layout options
    fit: true, // whether to fit to viewport
    padding: 30, // fit padding
    spacingFactor: undefined, // Applies a multiplicative factor (>0) to expand or compress the overall area that the nodes take up
    nodeDimensionsIncludeLabels: true, // whether labels should be included in determining the space used by a node
    animate: false, // whether to transition the node positions
    animateFilter: function( node, i ){ return true; }, // whether to animate specific nodes when animation is on; non-animated nodes immediately go to their final positions
    animationDuration: 10, // duration of animation in ms if enabled
    animationEasing: undefined, // easing of animation if enabled
    boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
    transform: function( node, pos ){ return pos; }, // a function that applies a transform to the final node position
    ready: function(){}, // on layoutready
    sort: undefined, // a sorting function to order the nodes and edges; e.g. function(a, b){ return a.data('weight') - b.data('weight') }
                     // because cytoscape dagre creates a directed graph, and directed graphs use the node order as a tie breaker when
                     // defining the topology of a graph, this sort function can help ensure the correct order of the nodes/edges.
                     // this feature is most useful when adding and removing the same nodes and edges multiple times in a graph.
    stop: function(){} // on layoutstop
  };

  export const styleSheet = [
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