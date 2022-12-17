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

import Menu from './pages/menu.js';

import React, { useState, useContext } from "react";
import { cyContext } from './pages/cyContext';
import cytoscape from 'cytoscape';
import cxtmenu from 'cytoscape-cxtmenu';
import CytoscapeComponent from "react-cytoscapejs";
import cyCanvas from "cytoscape-canvas";
import { styleSheet, layout } from './GraphConfig';
// import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
// import IFrameTest from './pages/iframetest';
// import klay from 'cytoscape-klay';
// import elk from 'cytoscape-elk';
import dagre from 'cytoscape-dagre';

cytoscape.use(dagre);

// cytoscape.use( elk );

// cytoscape.use( klay );

cytoscape.use(cxtmenu); // register extension

export default function Graph(props) {

  const { items, setItems } = useContext(cyContext);


  function redoLayout(ele) {
    var core = ele.cy();
    var layout_subgraph = core.elements().not(':hidden').layout(layout);

    layout_subgraph.run();

    core.animate({
      fit: {
        eles: ele.cy().elements(':visible'),
      }
    }, {
      duration: 100
    });
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
      { data: { id: "1", label: "IP 1", type: "ip", url: "https://www.worldanvil.com/dashboard/"} },
      { data: { id: "2", label: "Device 1", type: "device" } },
      { data: { id: "3", label: "IP 2", type: "ip", url: "http://192.168.1.37:3000/iframetest"} },
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
      { data: { id: "17", label: "Device 14", type: "device" } },
      { data: { id: 'j', label: 'Jerry' } },
      { data: { id: 'e', label: 'Elaine' } },
      { data: { id: 'k', label: 'Kramer' } },
      { data: { id: 'g', label: 'George' } }
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
      },
      { data: { source: 'j', target: 'e' } },
      { data: { source: 'j', target: 'k' } },
      { data: { source: 'j', target: 'g' } },
      { data: { source: 'e', target: 'j' } },
      { data: { source: 'e', target: 'k' } },
      { data: { source: 'k', target: 'j' } },
      { data: { source: 'k', target: 'e' } },
      { data: { source: 'k', target: 'g' } },
      { data: { source: 'g', target: 'j' } },
      { data: { source: 'k', target: '3' } }
    ]
  });

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

  const referrer = document.referrer;

  return (
    <>
      <div style={{ paddingTop: '65px' }}>
        {/* <h1>Cytoscape example | {referrer}</h1> */}
        <div
          style={{
            border: "1px solid",
            backgroundColor: "#f5f6fe"
          }}
        >
          {/* <Router>
          <Routes>
              <Route path='/iframetest' element={<IFrameTest/>} />
          </Routes>
          </Router> */}
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
              setItems((myCyRef) => cy);

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
            abc={console.log("myCyRef-after", myCyRef)}
          />
        </div>
      </div>
      <Menu myCyRef={myCyRef} />
    </>

  );
}