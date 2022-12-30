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

import SquareSharpIcon from '@mui/icons-material/SquareSharp';
import CircleIcon from '@mui/icons-material/Circle';
import LabelSharpIcon from '@mui/icons-material/LabelSharp';
import HelpIcon from '@mui/icons-material/Help';
// import Box from '@mui/material/Box';
// import Tooltip from '@mui/material/Tooltip';

import './index.css';

import React, { useState, useContext } from "react";
import { cyContext } from './pages/cyContext';
import cytoscape from 'cytoscape';
import cxtmenu from 'cytoscape-cxtmenu';
import CytoscapeComponent from "react-cytoscapejs";
import cyCanvas from "cytoscape-canvas";
import * as config from './GraphConfig';
// import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
// import IFrameTest from './pages/iframetest';
// import klay from 'cytoscape-klay';
// import elk from 'cytoscape-elk';
import dagre from 'cytoscape-dagre';

cytoscape.use(dagre);

// cytoscape.use( elk );

// cytoscape.use( klay );

cytoscape.use(cxtmenu); // register extension

cytoscape.use(cyCanvas);

function Graph(props) {

    const { myCy, setMyCy, graph_layout, setGraph_layout } = useContext(cyContext);



    function redoLayout(ele) {
        var core = ele.cy();
        var layout_subgraph = core.elements().not(':hidden').layout(graph_layout);

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

    function IsolateNeighborhood(ele) {
        var core = ele.cy();
        let hidden_nodes = core.nodes('[url != "' + ele.data().url + '"]');
        hidden_nodes.style("display", "none");
        hidden_nodes.connectedEdges().style("display", "none");

        let referring_nodes = core.nodes('[url = "' + ele.data().url + '"]');
        referring_nodes.connectedEdges().style("display", "element");
        referring_nodes.connectedEdges().targets().style("display", "element");
        referring_nodes.connectedEdges().sources().style("display", "element");

        // finally, make all edges between visible nodes visible
        var inter_edges = core.nodes(':visible').edgesTo(':visible')
        inter_edges.style("display", "element");

        console.log(referring_nodes.size())

        redoLayout(ele);
    }

    // const [tooltipOpen, setTooltipOpen] = React.useState(false);

    // const [tooltipPos, setTooltipPos] = React.useState({
    //   x: 0,
    //   y: 0,
    // });


    // const handleTooltipClose = () => {
    //   setTooltipOpen(false);
    // };

    // const handleTooltipOpen = (ele) => {
    //   try {
    //     let pos = ele.renderedPosition();
    //     setTooltipPos({
    //       x: pos.x,
    //       y: pos.y
    //     });
    //     setTooltipOpen(true);
    //   }
    //   catch {
    //     console.log("tooltip handler init");
    //   }
    // };

    const [width, setWith] = useState("100%");
    const [height, setHeight] = useState("600px");
    // const [graphData, setGraphData] = useState({
    //   nodes: [
    //     { data: { id: "1", label: "IP 1", type: "tag", url: "https://www.worldanvil.com/dashboard/" } },
    //     { data: { id: "2", label: "Device 1", type: "article" } },
    //     { data: { id: "3", label: "IP 2", type: "tag", url: "http://192.168.1.37:3000/iframetest" } },
    //     { data: { id: "4", label: "Device 2", type: "article" } },
    //     { data: { id: "5", label: "Device 3", type: "article" } },
    //     { data: { id: "6", label: "IP 3", type: "tag" } },
    //     { data: { id: "7", label: "Device 5", type: "article" } },
    //     { data: { id: "8", label: "Device 6", type: "article" } },
    //     { data: { id: "9", label: "Device 7", type: "article" } },
    //     { data: { id: "10", label: "Device 8", type: "article" } },
    //     { data: { id: "11", label: "Device 9", type: "article" } },
    //     { data: { id: "12", label: "IP 3", type: "tag" } },
    //     { data: { id: "13", label: "Device 10", type: "article" } },
    //     { data: { id: "14", label: "Device 11", type: "article" } },
    //     { data: { id: "15", label: "Device 12", type: "article" } },
    //     { data: { id: "16", label: "Device 13", type: "article" } },
    //     { data: { id: "17", label: "Device 14", type: "article" } },
    //     { data: { id: 'j', label: 'Jerry', type: "category" } },
    //     { data: { id: 'e', label: 'Elaine', type: "category" } },
    //     { data: { id: 'k', label: 'Kramer', type: "category" } },
    //     { data: { id: 'g', label: 'George', type: "category" } }
    //   ],
    //   edges: [
    //     {
    //       data: { source: "1", target: "2", label: "Node2" }
    //     },
    //     {
    //       data: { source: "3", target: "4", label: "Node4" }
    //     },
    //     {
    //       data: { source: "3", target: "5", label: "Node5" }
    //     },
    //     {
    //       data: { source: "6", target: "5", label: " 6 -> 5" }
    //     },
    //     {
    //       data: { source: "6", target: "7", label: " 6 -> 7" }
    //     },
    //     {
    //       data: { source: "6", target: "8", label: " 6 -> 8" }
    //     },
    //     {
    //       data: { source: "6", target: "9", label: " 6 -> 9" }
    //     },
    //     {
    //       data: { source: "3", target: "13", label: " 3 -> 13" }
    //     },
    //     {
    //       data: { source: "14", target: "3", label: " 3 -> 13" }
    //     },
    //     {
    //       data: { source: "15", target: "3", label: " 3 -> 13" }
    //     },
    //     {
    //       data: { source: "16", target: "3", label: " 3 -> 13" }
    //     },
    //     {
    //       data: { source: "17", target: "3", label: " 3 -> 13" }
    //     },
    //     {
    //       data: { source: "17", target: "16", label: " 3 -> 13" }
    //     },
    //     { data: { source: 'j', target: 'e' } },
    //     { data: { source: 'j', target: 'k' } },
    //     { data: { source: 'j', target: 'g' } },
    //     { data: { source: 'e', target: 'j' } },
    //     { data: { source: 'e', target: 'k' } },
    //     { data: { source: 'k', target: 'j' } },
    //     { data: { source: 'k', target: 'e' } },
    //     { data: { source: 'k', target: 'g' } },
    //     { data: { source: 'g', target: 'j' } },
    //     { data: { source: 'k', target: '3' } }
    //   ]
    // });
    const [graphData, setGraphData] = useState({
        nodes: [{data: {id: 'The Wide', label: 'The Wide', type: 'tag', url: ''}},
        {data: {id: 'Bailiff', label: 'Bailiff', type: 'tag', url: ''}},
        {data: {id: 'BG-rank', label: 'BG-rank', type: 'tag', url: ''}},
        {data: {id: 'population',
                  label: 'population',
                  type: 'tag',
                  url: ''}},
        {data: {id: 'city size', label: 'city size', type: 'tag', url: ''}},
        {data: {id: 'density', label: 'density', type: 'tag', url: ''}},
        {data: {id: 'Magic', label: 'Magic', type: 'tag', url: ''}},
        {data: {id: ' gems', label: ' gems', type: 'tag', url: ''}},
        {data: {id: 'leyden', label: 'leyden', type: 'tag', url: ''}},
        {data: {id: 'nexus', label: 'nexus', type: 'tag', url: ''}},
        {data: {id: 'spellcasting',
                  label: 'spellcasting',
                  type: 'tag',
                  url: ''}},
        {data: {id: 'focus', label: 'focus', type: 'tag', url: ''}},
        {data: {id: 'gem', label: 'gem', type: 'tag', url: ''}},
        {data: {id: 'touched', label: 'touched', type: 'tag', url: ''}},
        {data: {id: 'place-of-worship',
                  label: 'place-of-worship',
                  type: 'tag',
                  url: ''}},
        {data: {id: 'BG-Gates', label: 'BG-Gates', type: 'tag', url: ''}},
        {data: {id: 'BG-Restaurant',
                  label: 'BG-Restaurant',
                  type: 'tag',
                  url: ''}},
        {data: {id: 'gem-rail-station',
                  label: 'gem-rail-station',
                  type: 'tag',
                  url: ''}},
        {data: {id: 'greater-deity',
                  label: 'greater-deity',
                  type: 'tag',
                  url: ''}},
        {data: {id: 'polytheistic',
                  label: 'polytheistic',
                  type: 'tag',
                  url: ''}},
        {data: {id: 'Rules', label: 'Rules', type: 'tag', url: ''}},
        {data: {id: ' Homebrew', label: ' Homebrew', type: 'tag', url: ''}},
        {data: {id: 'weapon swapping',
                  label: 'weapon swapping',
                  type: 'tag',
                  url: ''}},
        {data: {id: 'diagonals', label: 'diagonals', type: 'tag', url: ''}},
        {data: {id: 'diagonal movement',
                  label: 'diagonal movement',
                  type: 'tag',
                  url: ''}},
        {data: {id: 'aerial combat',
                  label: 'aerial combat',
                  type: 'tag',
                  url: ''}},
        {data: {id: 'euclidean', label: 'euclidean', type: 'tag', url: ''}},
        {data: {id: 'extra attack',
                  label: 'extra attack',
                  type: 'tag',
                  url: ''}},
        {data: {id: 'ready action',
                  label: 'ready action',
                  type: 'tag',
                  url: ''}},
        {data: {id: 'ready condition',
                  label: 'ready condition',
                  type: 'tag',
                  url: ''}},
        {data: {id: 'ready', label: 'ready', type: 'tag', url: ''}},
        {data: {id: 'session-report',
                  label: 'session-report',
                  type: 'tag',
                  url: ''}},
        {data: {id: "Baldur's Gate",
                  label: "Baldur's Gate",
                  type: 'tag',
                  url: ''}},
        {data: {id: 'taxes', label: 'taxes', type: 'tag', url: ''}},
        {data: {id: 'finance', label: 'finance', type: 'tag', url: ''}},
        {data: {community_id: 5,
                  id: '01868e04-ee6d-43f7-a3a8-698cf7080f5e',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: 'Getting Started',
                  pagerank: 0.0011493203204284736,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/introduction-category'}},
        {data: {community_id: 5,
                  id: '06bbb2e8-d9c4-4939-9503-986f0eae1ce1',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'False',
                  label: 'Notable Locations - Neril',
                  pagerank: 0.006916969498155515,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/notable-locations-category'}},
        {data: {community_id: 10,
                  id: '0abdbd64-b8d2-4a60-8a55-d8ddf9232604',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: 'Player Handbook',
                  pagerank: 0.029496111742790748,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/player-handbook-category'}},
        {data: {community_id: 7,
                  id: '0d0ab841-8ff7-41b4-9144-d36c18c67475',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: 'Flintrock',
                  pagerank: 0.0028007152737945084,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/flintrock-category'}},
        {data: {community_id: 2,
                  id: '0d188ed3-6f29-49f6-99bd-4c213a010d8a',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'False',
                  label: 'Flaming Fist',
                  pagerank: 0.0020634686887178485,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/flaming-fist-category'}},
        {data: {community_id: 7,
                  id: '0e2e1fa7-d2cc-4f62-bbcc-97aed9d0b397',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: 'Westmen',
                  pagerank: 0.002524702668102846,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/westmen-category'}},
        {data: {community_id: 11,
                  id: '0e4d98a6-afd1-42f4-9042-fc1c6a80f0f3',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'False',
                  label: 'NPCs - Dastrow',
                  pagerank: 0.00209852731368455,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/npcs---dastrow-category'}},
        {data: {community_id: 7,
                  id: '10a66e51-a53b-40b4-9969-c421f13ad412',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: 'NPCs - Flintrock',
                  pagerank: 0.0017274142045319398,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/npcs---flintrock-category'}},
        {data: {community_id: 8,
                  id: '11ff24b1-1378-4517-a9c5-148bf5a5d870',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: 'Halfling Pantheon',
                  pagerank: 0.0009349918817885876,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/halfling-pantheon-category'}},
        {data: {community_id: 10,
                  id: '12824120-c343-4501-9f97-1f367569fea3',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: 'Adventuring Gear',
                  pagerank: 0.0009349918817885876,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/adventuring-gear-category'}},
        {data: {community_id: 7,
                  id: '1307c198-ab2d-4888-b312-2e838bb52f8a',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: 'NPCs - Luskan',
                  pagerank: 0.0009349918817885876,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/npcs---luskan-category'}},
        {data: {community_id: 8,
                  id: '14d0c9e7-2cbf-4857-acd3-0f69394403fc',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: 'Bulwark of Myndra',
                  pagerank: 0.002524702668102846,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/bulwark-of-myndra-category'}},
        {data: {community_id: 5,
                  id: '15b49f54-25b3-41e3-bad7-665680a43b80',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: 'Forests and Woodlands - Etherin',
                  pagerank: 0.0024055043772160936,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/forests-and-woodlands-category'}},
        {data: {community_id: 10,
                  id: '171d3bd8-83d1-4c74-8b8b-9f4e0ef82759',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'False',
                  label: 'Setting Rules',
                  pagerank: 0.0017298472749457164,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/setting-rules-category'}},
        {data: {community_id: 5,
                  id: '18f8185c-5a62-4a36-89f9-b81d39e722f0',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'False',
                  label: 'Neril',
                  pagerank: 0.028685918005739566,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/neril-category'}},
        {data: {community_id: 2,
                  id: '1ae679c0-c890-4377-b8ac-7093d9d7f8e2',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: 'NPCs - Arcane Brotherhood',
                  pagerank: 0.0009349918817885876,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/npcs-category-1'}},
        {data: {community_id: 7,
                  id: '2193f2f1-0c22-4ff9-bb43-5b100df458df',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: 'NPCs - Wadun',
                  pagerank: 0.002659834088556921,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/npcs---wadun-category'}},
        {data: {community_id: 3,
                  id: '21fb4997-bcf4-4828-afe9-640412f9242e',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: 'NPCs - Gildila',
                  pagerank: 0.0011132859194182263,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/npcs---gildila-category'}},
        {data: {community_id: 10,
                  id: '25837647-b2ea-4bad-8b98-33015e65466a',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'False',
                  label: 'House Rules',
                  pagerank: 0.002524702668102846,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/house-rules-category'}},
        {data: {community_id: 2,
                  id: '25e76c20-1bbb-4dbb-8d64-0639cf098873',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'False',
                  label: 'The Spanners',
                  pagerank: 0.002453751525743334,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/the-spanners-category'}},
        {data: {community_id: 7,
                  id: '2887a5dc-f539-46f4-b709-8b651c14ddf1',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'False',
                  label: 'Lower City',
                  pagerank: 0.0009680944612862324,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/lower-city-category'}},
        {data: {community_id: 7,
                  id: '2d0a798a-7058-4bde-8076-0b7bcf68c114',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: 'NPCs - Neverwinter',
                  pagerank: 0.0009349918817885876,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/npcs---neverwinter-category'}},
        {data: {community_id: 1,
                  id: '309b7567-01ed-4a3f-b2de-b6503a40e00a',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'False',
                  label: "Day's Calamity",
                  pagerank: 0.011839050844432623,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/day-s-calamity-category'}},
        {data: {community_id: 10,
                  id: '30dac3db-a2b3-4161-b11c-d74a55c0387e',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: 'Armor',
                  pagerank: 0.0009349918817885876,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/armor-category'}},
        {data: {community_id: 10,
                  id: '341aec9d-9726-41a5-84b2-c28b476623f5',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: 'Weapons',
                  pagerank: 0.0009349918817885876,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/weapons-category'}},
        {data: {community_id: 5,
                  id: '355bbf06-e575-485f-8153-9c6d7cc32d84',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: 'Important Locations',
                  pagerank: 0.0009349918817885876,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/important-locations-category'}},
        {data: {community_id: 3,
                  id: '361f6100-eccc-4a9c-8914-26455780ddeb',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'False',
                  label: 'Rangers Guilds',
                  pagerank: 0.004553054319094784,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/rangers-guilds-category'}},
        {data: {community_id: 5,
                  id: '377b6172-1949-4d37-8878-a104ecf5dbd0',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: 'Atlas',
                  pagerank: 0.028064203895275048,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/world-atlas-category'}},
        {data: {community_id: 7,
                  id: '392ed320-4d80-401a-9b9a-cc617023101f',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: "NPCs - Baldur's Gate",
                  pagerank: 0.0009349918817885876,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/npcs---baldur-s-gate-category'}},
        {data: {community_id: 2,
                  id: '3a3556dd-1064-464d-845e-cc49535964a1',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: 'The Zhentarim',
                  pagerank: 0.002524702668102846,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/the-zhentarim-category'}},
        {data: {community_id: 2,
                  id: '3bc36745-bcb5-4d11-9b82-173bdd525d92',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: 'Farhorn Swords',
                  pagerank: 0.002524702668102846,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/farhorn-swords-category'}},
        {data: {community_id: 10,
                  id: '3bd5d3ee-822e-4f52-b431-13031c9b3847',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'False',
                  label: 'Player Options',
                  pagerank: 0.029372119203461666,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/player-options-category'}},
        {data: {community_id: 2,
                  id: '3c0a1268-6dab-4ed2-94ea-6cdf7d0313c8',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: 'NPCs - The Spanners',
                  pagerank: 0.0009349918817885876,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/npcs-category-7'}},
        {data: {community_id: 8,
                  id: '3dc3c37e-b7f3-4f4b-8318-305068032941',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'False',
                  label: 'Dwarven Pantheon',
                  pagerank: 0.0017298472749457164,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/dwarven-pantheon-category'}},
        {data: {community_id: 14,
                  id: '3f4240a6-4513-4d01-97e7-bc1af09115dd',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: 'World History',
                  pagerank: 0.0009349918817885876,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/world-history-category'}},
        {data: {community_id: 8,
                  id: '44fe42f7-da24-4997-b337-481ad26b5207',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: 'NPCs - Bulwark of Myndra',
                  pagerank: 0.0009349918817885876,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/npcs-category-12'}},
        {data: {community_id: 11,
                  id: '478573a8-e709-47f1-9e23-69e11d403521',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'False',
                  label: "Water's Mercy",
                  pagerank: 0.0031303608638965546,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/water-s-mercy-category'}},
        {data: {community_id: 2,
                  id: '4d1da60c-56e2-437c-b597-bb01ab631f35',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: 'Sapient Species',
                  pagerank: 0.0009349918817885876,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/sapient-species-category'}},
        {data: {community_id: 5,
                  id: '4dd4b5fc-b3c1-4ceb-99fa-d4fb3128dc0a',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'False',
                  label: 'Regions - Neril',
                  pagerank: 0.0017298472749457164,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/regions-category-1'}},
        {data: {community_id: 5,
                  id: '4fea9216-77fb-4bc8-9a16-7caf59910429',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: 'Forests and Woodlands - Neril',
                  pagerank: 0.0009349918817885876,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/forests-and-woodlands---neril-category'}},
        {data: {community_id: 8,
                  id: '52e6a171-8893-434d-9f05-4b9c424e3363',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: 'Orcish Pantheon',
                  pagerank: 0.0009349918817885876,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/orcish-pantheon-category'}},
        {data: {community_id: 10,
                  id: '55311379-44cc-4d54-be8c-59942677fe67',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: 'Classes',
                  pagerank: 0.0009349918817885876,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/classes-category'}},
        {data: {community_id: 7,
                  id: '553cec9c-ff0c-4a79-8398-59a5535856f7',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: 'NPCs - Westmen',
                  pagerank: 0.0009349918817885876,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/npcs---westmen-category'}},
        {data: {community_id: 2,
                  id: '56d191a4-f254-4383-b5ad-f9dfa3b6cc55',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'False',
                  label: 'Fauna & Flora',
                  pagerank: 0.005704124240731362,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/fauna-26-flora-category'}},
        {data: {community_id: 2,
                  id: '5a2a47f2-a93d-4ffd-a5cf-f2c71b89e124',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'False',
                  label: 'Science & Technology & Magic',
                  pagerank: 0.003549056536067648,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/science-26-technology-category'}},
        {data: {community_id: 5,
                  id: '5ddf08f6-fa1e-46de-96fd-05beafd87fe7',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: 'Continents',
                  pagerank: 0.030483822512544372,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/regions-category'}},
        {data: {community_id: 8,
                  id: '5fc045cf-705c-41aa-b4dc-517a1bec5d52',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'False',
                  label: 'Deities & Religions',
                  pagerank: 0.0267315638460982,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/deities-26-religions-category'}},
        {data: {community_id: 11,
                  id: '65fb527e-4158-4239-9687-8c714eb92d1c',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: 'Dastrow',
                  pagerank: 0.0028385462955704812,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/dastrow-category'}},
        {data: {community_id: 0,
                  id: '6889ca60-afdc-4a7f-b68f-a5e3aeb6e13c',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'False',
                  label: 'NPCs - The Isims',
                  pagerank: 0.004612466881720245,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/npcs-category-4'}},
        {data: {community_id: 8,
                  id: '6b406091-f679-49fa-b44e-5f5a134a3705',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: 'The Warring Fist',
                  pagerank: 0.002524702668102846,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/the-warring-fist-category'}},
        {data: {community_id: 10,
                  id: '6c25af4a-9107-4120-8858-90e15d29240e',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: 'Spells',
                  pagerank: 0.0009349918817885876,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/spells-category'}},
        {data: {community_id: 2,
                  id: '6dce918e-c6d4-4a12-a897-613742005656',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: 'NPCs - Farhorn Swords',
                  pagerank: 0.0009349918817885876,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/npcs-category-3'}},
        {data: {community_id: 5,
                  id: '6e63da18-5cc7-4786-b516-01ebdb15a16a',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: 'Planes',
                  pagerank: 0.0009349918817885876,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/planes-category'}},
        {data: {community_id: 7,
                  id: '726a2e50-bfed-4d29-850f-9f70907c253d',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'False',
                  label: 'Upper City',
                  pagerank: 0.0009782104744859945,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/upper-city-category'}},
        {data: {community_id: 11,
                  id: '73965660-4803-455c-a6e8-027511996809',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: "NPCs - Water's Mercy",
                  pagerank: 0.0009349918817885876,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/npcs---water-s-mercy-category'}},
        {data: {community_id: 8,
                  id: '74102638-9ae6-4676-9fc2-989e431a6aad',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'False',
                  label: "Nature's Audience",
                  pagerank: 0.002659834088556921,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/nature-s-audience-category'}},
        {data: {community_id: 9,
                  id: '7593fa16-8ce3-472f-ad59-e924c392679e',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'False',
                  label: 'Session Reports - Rise of the Necromancer',
                  pagerank: 0.0018400531677536347,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/session-reports-category-2'}},
        {data: {community_id: 1,
                  id: '76fa6a54-065b-4be0-9e1b-8948e8b68d8e',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: "Session Reports - Dastrow's Shining",
                  pagerank: 0.0016575197867522479,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/session-reports-category-1'}},
        {data: {community_id: 2,
                  id: '7826eb69-1d67-4b35-9574-97bd07ba9c25',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: 'Plants',
                  pagerank: 0.0009349918817885876,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/plants-category'}},
        {data: {community_id: 5,
                  id: '78b07367-1ccb-4c41-983f-f94fb491c5c3',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: 'Sword Coast',
                  pagerank: 0.0009349918817885876,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/sword-coast-category'}},
        {data: {community_id: 5,
                  id: '803567bd-3056-4fae-8244-5ef2ca652e64',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'False',
                  label: 'Honeywell',
                  pagerank: 0.0025266136434678272,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/honeywell-category'}},
        {data: {community_id: 8,
                  id: '808faaed-0d82-43aa-b1a1-059d95d8dbff',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'False',
                  label: 'The Light-sighted',
                  pagerank: 0.002659834088556921,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/the-light-sighted-category'}},
        {data: {community_id: 5,
                  id: '864b40d3-70d3-4d81-b28b-5da341dc30e4',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'False',
                  label: 'Etherin',
                  pagerank: 0.006083524370723471,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/etherin-category'}},
        {data: {community_id: 7,
                  id: '89b9f719-53ac-4785-a7df-a193644899ec',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'False',
                  label: 'Neverwinter',
                  pagerank: 0.002524702668102846,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/neverwinter-category'}},
        {data: {community_id: 5,
                  id: '8a9f53bc-114f-4f41-9eb6-4ccb5d104921',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'False',
                  label: "Maalen'ar",
                  pagerank: 0.029034253587066114,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/maalen-ar-category'}},
        {data: {community_id: 3,
                  id: '8d66b580-6af4-4ea6-a0fb-c4a414a1911a',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: 'The Rangers Guild of Gildila',
                  pagerank: 0.0040623320681734045,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/the-rangers-guild-of-gildila-category'}},
        {data: {community_id: 0,
                  id: '8eb263b4-447c-4fd3-9762-525921bea6a2',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'False',
                  label: 'NPCs',
                  pagerank: 0.009722080857004736,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/npcs-category'}},
        {data: {community_id: 2,
                  id: '91b796d8-8666-4ff8-9d89-8f787fef0bc6',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'False',
                  label: 'Arcane Brotherhood',
                  pagerank: 0.0021803550790136647,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/arcane-brotherhood-category'}},
        {data: {community_id: 2,
                  id: '943e87a6-7e91-4c9c-a9af-f196557808bb',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: 'NPCs - Flaming Fist',
                  pagerank: 0.0009349918817885876,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/npcs-category-2'}},
        {data: {community_id: 2,
                  id: '95008541-1608-41d1-bbcc-c770e07d27a4',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'False',
                  label: 'The Harpers',
                  pagerank: 0.002524702668102846,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/the-harpers-category'}},
        {data: {community_id: 2,
                  id: '9549d9a2-c01a-4dfd-9c2c-bf3a4731d55c',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: 'Animals',
                  pagerank: 0.0009349918817885876,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/animals-category'}},
        {data: {community_id: 5,
                  id: '969f6dcf-75e3-4f25-b8cf-8ac586742f52',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: 'NPCs - Honeywell',
                  pagerank: 0.0009349918817885876,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/npcs---honeywell-category'}},
        {data: {community_id: 10,
                  id: '9ce1b3ba-7bf2-4549-ad4b-a2dd9e70d41b',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: 'Feats & Traits',
                  pagerank: 0.0009349918817885876,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/feats-26-traits-category'}},
        {data: {community_id: 3,
                  id: '9effb3c5-240e-40c9-af80-db4aad2c8e75',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'False',
                  label: 'NPCs - The Rangers Guild of Gildila',
                  pagerank: 0.003679319610900146,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/npcs-category-8'}},
        {data: {community_id: 5,
                  id: 'a08595d9-a022-4b2e-8c33-7262a4a11f82',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'False',
                  label: 'Faerland',
                  pagerank: 0.0017298472749457164,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/faerland-category'}},
        {data: {community_id: 5,
                  id: 'a1a46f2e-8628-4cb6-a00b-bcf395dfe005',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: 'Settlements - Etherin',
                  pagerank: 0.003081546097908416,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/settlements---etherin-category'}},
        {data: {community_id: 2,
                  id: 'a3fe07ba-a93f-44f9-bdda-ca84bc2294d0',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: 'Encyclopedia',
                  pagerank: 0.05491027348956678,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/world-encyclopedia-category'}},
        {data: {community_id: 10,
                  id: 'aa0cc3c4-9697-409b-85d4-4139e70c829d',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: 'Backgrounds & Professions',
                  pagerank: 0.0009349918817885876,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/backgrounds-26-professions-category'}},
        {data: {community_id: 7,
                  id: 'aace67c9-7d36-445a-9876-e43936273fa9',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'False',
                  label: 'Settlements - Neril',
                  pagerank: 0.020888011788707167,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/settlements-category'}},
        {data: {community_id: 8,
                  id: 'ab8b0496-e456-4472-a11e-31f0c2572621',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'False',
                  label: 'Human Pantheon',
                  pagerank: 0.02222810117610894,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/human-pantheon-category'}},
        {data: {community_id: 5,
                  id: 'ae6a32a1-8424-45b3-9824-17702db8d62f',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: 'Gem Rail Stations',
                  pagerank: 0.002524702668102846,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/gem-rail-stations-category'}},
        {data: {community_id: 2,
                  id: 'af49353a-10f1-451f-ba53-22d00a32a8c0',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'False',
                  label: 'Commerce & Trade',
                  pagerank: 0.0013324195783671522,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/commerce-26-trade-category'}},
        {data: {community_id: 8,
                  id: 'b5f38b5d-62fc-4d8d-8cc6-e4eae91ba34e',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: 'NPCs - The Church of the Silver Flame',
                  pagerank: 0.0009349918817885876,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/npcs-category-14'}},
        {data: {community_id: 3,
                  id: 'ba32f9c3-603f-4217-a3a1-7f1210471748',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'False',
                  label: 'Gildila',
                  pagerank: 0.002886583046775428,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/gildila-category'}},
        {data: {community_id: 2,
                  id: 'c011adda-8d48-4741-99bf-ee7c4638e999',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'False',
                  label: 'Powerful Organizations',
                  pagerank: 0.021399521994383535,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/powerful-organizations-category'}},
        {data: {community_id: 3,
                  id: 'c21883ef-edfd-4ced-9057-808f9d756bda',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'False',
                  label: 'PCs',
                  pagerank: 0.005399102211633075,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/the-protagonists-2F-pcs-category'}},
        {data: {community_id: 9,
                  id: 'c396b18c-aa26-4578-81e7-8bf2c0419332',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'False',
                  label: "NPCs - Dastrow's Shining",
                  pagerank: 0.0033195580612599748,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/npcs-category-15'}},
        {data: {community_id: 2,
                  id: 'c46e33d9-f514-4bf3-8add-1be25b5dcacf',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: 'Beasts & Monsters',
                  pagerank: 0.0009349918817885876,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/beasts-26-monsters-category'}},
        {data: {community_id: 5,
                  id: 'c5814f42-d54d-434e-a33f-5e89eb4055ae',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: 'Notable Locations - Etherin',
                  pagerank: 0.0029791703579663906,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/notable-locations---etherin-category'}},
        {data: {community_id: 2,
                  id: 'ce8fa6c8-3435-4a34-b0b3-b52848090235',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: 'NPCs - The Zhentarim',
                  pagerank: 0.0009349918817885876,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/npcs-category-5'}},
        {data: {community_id: 7,
                  id: 'd18e2b11-96aa-44ff-b2f7-37bfa61c9beb',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'False',
                  label: 'Luskan',
                  pagerank: 0.002122422391069387,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/luskan-category'}},
        {data: {community_id: 2,
                  id: 'd3a9adf6-9c14-4389-be08-2c8dc2952528',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: 'Folklore',
                  pagerank: 0.0009349918817885876,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/folklore-category'}},
        {data: {community_id: 12,
                  id: 'd5a1d4e9-81d6-49cf-9249-d70626944fe8',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'False',
                  label: 'Staging Area',
                  pagerank: 0.002524702668102846,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/staging-area-category'}},
        {data: {community_id: 0,
                  id: 'd9e2d266-d168-4c77-8163-b36c40b362d0',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'False',
                  label: 'The Isims',
                  pagerank: 0.0052529330765990895,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/the-isims-category'}},
        {data: {community_id: 7,
                  id: 'd9f8b271-fae8-4107-857a-d9da664f3825',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: 'Wadun',
                  pagerank: 0.0033548657542679574,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/wadun-category'}},
        {data: {community_id: 2,
                  id: 'dbfbd1a6-e34b-43f0-8d14-c3df14a8a748',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'False',
                  label: 'Ethnicities & Cultures',
                  pagerank: 0.0017298472749457164,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/ethnicities-26-cultures-category'}},
        {data: {community_id: 8,
                  id: 'e136dfdb-3842-49b2-bc9b-4f1fe4c2b8ac',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: "NPCs - Nature's Audience",
                  pagerank: 0.0009349918817885876,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/npcs-category-13'}},
        {data: {community_id: 9,
                  id: 'e2461c29-077e-4fd6-8404-935d1396048c',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: 'Campaigns',
                  pagerank: 0.012164620022890798,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/campaigns-category'}},
        {data: {community_id: 10,
                  id: 'e2fb3959-1f55-4e5f-9d5d-fea013e25be0',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'False',
                  label: 'Equipment',
                  pagerank: 0.004790070556687481,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/equipment-category'}},
        {data: {community_id: 9,
                  id: 'e382a22d-2331-4e8d-b949-eb75e393fe0b',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'False',
                  label: 'NPCs - Rise of the Necromancer',
                  pagerank: 0.004123052031572718,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/npcs-category-16'}},
        {data: {community_id: 2,
                  id: 'e77088f7-a57a-421d-90db-6c06b2d11b74',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: 'NPCs - The Harpers',
                  pagerank: 0.0009349918817885876,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/npcs-category-6'}},
        {data: {community_id: 10,
                  id: 'ea08641f-ebd9-42da-bfe3-7e6200fa8dbf',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'False',
                  label: 'Artifacts',
                  pagerank: 0.0017298472749457164,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/artifacts-category'}},
        {data: {community_id: 1,
                  id: 'ecb86c94-622b-4a62-9b85-e21ce82b4bfc',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: "NPCs - Day's Calamity",
                  pagerank: 0.00919147146906289,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/npcs-category-9'}},
        {data: {community_id: 8,
                  id: 'ed3d1db3-6227-410c-a0da-72cb852c254e',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'False',
                  label: 'The Church of the Silver Flame',
                  pagerank: 0.002659834088556921,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/the-church-of-the-silver-flame-category'}},
        {data: {community_id: 2,
                  id: 'ed7c9084-0b43-4e5b-9db6-d7c9b2a62a61',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: 'Professions',
                  pagerank: 0.0021149627344455336,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/professions-category'}},
        {data: {community_id: 15,
                  id: 'edc321d7-8a55-4e1a-b12f-308ff115bd2d',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: 'Gamemaster Vault',
                  pagerank: 0.0009349918817885876,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/gamemaster-vault-category'}},
        {data: {community_id: 13,
                  id: 'f08ade4a-6087-4f41-8666-b2a4c0da24b9',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'False',
                  label: 'The Leyden Nexus Worldbuilding Standards and Practices',
                  pagerank: 0.0017298472749457164,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/worldbuilding-standards-and-practices-category'}},
        {data: {community_id: 8,
                  id: 'f407c8fc-18e4-4745-8c71-442839f95e35',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: 'Elven Pantheon',
                  pagerank: 0.0035959811801102052,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/elven-pantheon-category'}},
        {data: {community_id: 9,
                  id: 'f506393a-d938-4114-b2c7-14ecf347a07e',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'False',
                  label: "Dastrow's Shining",
                  pagerank: 0.005488099310404129,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/dastrow-s-shining-category'}},
        {data: {community_id: 7,
                  id: 'f616390d-2099-44a0-8850-bbe7213196d0',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'False',
                  label: 'Outer City',
                  pagerank: 0.0010080010568465684,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/outer-city-category'}},
        {data: {community_id: 8,
                  id: 'f7c1bce2-773c-4d78-b918-ebf61688f603',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: 'NPCs - The Light-sighted',
                  pagerank: 0.0009349918817885876,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/npcs-category-10'}},
        {data: {community_id: 8,
                  id: 'f881ed54-2426-49d4-a705-bdd724d9bca7',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: 'NPCs - The Warring Fist',
                  pagerank: 0.0009349918817885876,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/npcs-category-11'}},
        {data: {community_id: 7,
                  id: 'f8897033-c0f9-41ca-9be9-bcbef7ce536a',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'False',
                  label: "Baldur's Gate",
                  pagerank: 0.004422967750087235,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/baldur-s-gate-category'}},
        {data: {community_id: 4,
                  id: 'f9192b97-2255-48fb-bada-e2c521d8af5b',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'False',
                  label: 'Playable Races',
                  pagerank: 0.024923940941793364,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/playable-races-category'}},
        {data: {community_id: 9,
                  id: 'fa4eb288-df1a-45c6-a922-daaea5c40c49',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: 'Rise of the Necromancer',
                  pagerank: 0.006795908967112904,
                  type: 'category',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/c/rise-of-the-necromancer-category'}},
        {data: {community_id: 3,
                  id: '014be81e-265e-48c3-9e5d-2d6fe0d68158',
                  idoms_from_parent_cats: ['f9192b97-2255-48fb-bada-e2c521d8af5b',
                                             'a3fe07ba-a93f-44f9-bdda-ca84bc2294d0',
                                             '8eb263b4-447c-4fd3-9762-525921bea6a2',
                                             'f506393a-d938-4114-b2c7-14ecf347a07e',
                                             'c21883ef-edfd-4ced-9057-808f9d756bda',
                                             '18f8185c-5a62-4a36-89f9-b81d39e722f0'],
                  is_in_dominating_set: 'False',
                  label: 'Gildila',
                  pagerank: 0.003076765622594741,
                  'subtype': 'settlement',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/gildila-settlement'}},
        {data: {community_id: 3,
                  id: '022ec78c-ee39-4db7-8212-aaea0a3c39a8',
                  idoms_from_parent_cats: ['9effb3c5-240e-40c9-af80-db4aad2c8e75'],
                  is_in_dominating_set: 'True',
                  label: 'Cassen',
                  pagerank: 0.0014610329187799806,
                  'subtype': 'person',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/cassen-person'}},
        {data: {community_id: 9,
                  id: '03b2cfe3-dad1-4419-b4a3-c02554e4dd6a',
                  idoms_from_parent_cats: ['f874731e-a939-40df-957d-38e52462bb35',
                                             '803567bd-3056-4fae-8244-5ef2ca652e64',
                                             'fa4eb288-df1a-45c6-a922-daaea5c40c49'],
                  is_in_dominating_set: 'False',
                  label: 'Honeywell',
                  pagerank: 0.004692264129243676,
                  'subtype': 'settlement',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/honeywell-settlement'}},
        {data: {community_id: 7,
                  id: '03bd9d1f-2d7f-40d1-89a2-6f75c85bfe3e',
                  idoms_from_parent_cats: ['61995c43-27e4-421e-b146-9ec4587d41e7',
                                             'a3fe07ba-a93f-44f9-bdda-ca84bc2294d0',
                                             '18f8185c-5a62-4a36-89f9-b81d39e722f0'],
                  is_in_dominating_set: 'False',
                  label: 'Arcane Brotherhood',
                  pagerank: 0.0021199893206556106,
                  'subtype': 'organization',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/arcane-brotherhood-organization'}},
        {data: {community_id: 0,
                  id: '043efcdf-6c21-4957-9bbf-b1fefb68eb3d',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'False',
                  label: 'Vanthampur Villa',
                  pagerank: 0.0009782104744859945,
                  'subtype': 'landmark',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/vanthampur-villa-landmark'}},
        {data: {community_id: 0,
                  id: '0508b003-b753-4871-a80f-a91767875180',
                  idoms_from_parent_cats: ['f9192b97-2255-48fb-bada-e2c521d8af5b',
                                             'a3fe07ba-a93f-44f9-bdda-ca84bc2294d0',
                                             '8eb263b4-447c-4fd3-9762-525921bea6a2',
                                             'f506393a-d938-4114-b2c7-14ecf347a07e',
                                             'c21883ef-edfd-4ced-9057-808f9d756bda',
                                             '18f8185c-5a62-4a36-89f9-b81d39e722f0'],
                  is_in_dominating_set: 'True',
                  label: 'Bailiff of the Wide',
                  pagerank: 0.0019237456095078467,
                  'subtype': 'rank',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/bailiff-of-the-wide-rank'}},
        {data: {community_id: 0,
                  id: '057a115b-865e-48c9-8024-22f6a97d2dac',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: "Danthelon's Dancing Axe",
                  pagerank: 0.0014405833855820633,
                  'subtype': 'landmark',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/danthelon-s-dancing-axe-landmark'}},
        {data: {community_id: 5,
                  id: '05d5dd47-4bae-45df-8998-8eed28fbbd46',
                  idoms_from_parent_cats: ['377b6172-1949-4d37-8878-a104ecf5dbd0'],
                  is_in_dominating_set: 'True',
                  label: 'Settlement Classification by Population',
                  pagerank: 0.0009349918817885876,
                  'subtype': 'article',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/settlement-classification-by-population-article'}},
        {data: {community_id: 4,
                  id: '05dc1477-72c0-4d5b-b16b-b0ed62aab470',
                  idoms_from_parent_cats: ['f9192b97-2255-48fb-bada-e2c521d8af5b'],
                  is_in_dominating_set: 'True',
                  label: 'Hobgoblin',
                  pagerank: 0.0009349918817885876,
                  'subtype': 'species',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/hobgoblin-species'}},
        {data: {community_id: 12,
                  id: '06c1acca-c436-42cc-9c44-d3ce14d19a85',
                  idoms_from_parent_cats: ['d5a1d4e9-81d6-49cf-9249-d70626944fe8'],
                  is_in_dominating_set: 'True',
                  label: 'Calendar Test',
                  pagerank: 0.0009349918817885876,
                  'subtype': 'article',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/calendar-test-article'}},
        {data: {community_id: 3,
                  id: '077bce4a-05e0-428b-b1ee-ac61be011cbf',
                  idoms_from_parent_cats: ['f9192b97-2255-48fb-bada-e2c521d8af5b',
                                             'a3fe07ba-a93f-44f9-bdda-ca84bc2294d0',
                                             '8eb263b4-447c-4fd3-9762-525921bea6a2',
                                             'f506393a-d938-4114-b2c7-14ecf347a07e',
                                             'c21883ef-edfd-4ced-9057-808f9d756bda',
                                             '18f8185c-5a62-4a36-89f9-b81d39e722f0'],
                  is_in_dominating_set: 'True',
                  label: 'Tanner the Tanner',
                  pagerank: 0.0010487021209486845,
                  'subtype': 'person',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/tanner-the-tanner-person'}},
        {data: {community_id: 1,
                  id: '078031f7-5cbc-4b4f-92d0-00a04ea0fe3e',
                  idoms_from_parent_cats: ['f9192b97-2255-48fb-bada-e2c521d8af5b',
                                             'a3fe07ba-a93f-44f9-bdda-ca84bc2294d0',
                                             '8eb263b4-447c-4fd3-9762-525921bea6a2',
                                             'f506393a-d938-4114-b2c7-14ecf347a07e',
                                             'c21883ef-edfd-4ced-9057-808f9d756bda',
                                             '18f8185c-5a62-4a36-89f9-b81d39e722f0'],
                  is_in_dominating_set: 'False',
                  label: 'Dastrow’s Shining',
                  pagerank: 0.010623257320320443,
                  'subtype': 'plot',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/dastrowE28099s-shining-plot'}},
        {data: {community_id: 2,
                  id: '093bf486-67c1-4cb1-b64d-e7b0b0cd3f01',
                  idoms_from_parent_cats: ['a3fe07ba-a93f-44f9-bdda-ca84bc2294d0',
                                             'e12cc565-6b06-4844-acc4-fa266c64b704'],
                  is_in_dominating_set: 'True',
                  label: 'Gems and Gem Magic',
                  pagerank: 0.002132873541770658,
                  'subtype': 'technology',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/gems-and-gem-magic-technology'}},
        {data: {community_id: 4,
                  id: '09ffaf01-8e01-44c6-9ac4-e854566814ea',
                  idoms_from_parent_cats: ['f9192b97-2255-48fb-bada-e2c521d8af5b'],
                  is_in_dominating_set: 'True',
                  label: 'Bugbear',
                  pagerank: 0.0009349918817885876,
                  'subtype': 'species',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/bugbear-species'}},
        {data: {community_id: 0,
                  id: '0a6c3046-9d46-450d-9c35-c866ffbe2acb',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: 'Tumbledown',
                  pagerank: 0.001189618426699998,
                  'subtype': 'settlement',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/tumbledown-settlement'}},
        {data: {community_id: 0,
                  id: '0afa9137-5a58-4d67-aa34-4d5df91ebe78',
                  idoms_from_parent_cats: ['8eb263b4-447c-4fd3-9762-525921bea6a2'],
                  is_in_dominating_set: 'True',
                  label: 'Sarah Zimmerman',
                  pagerank: 0.0009349918817885876,
                  'subtype': 'person',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/sarah-zimmerman-person'}},
        {data: {community_id: 0,
                  id: '0affe09b-3246-4c32-8c93-9b0ae2027ce8',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'False',
                  label: 'Church of Last Hope',
                  pagerank: 0.0018539747386121179,
                  'subtype': 'landmark',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/church-of-last-hope-landmark'}},
        {data: {community_id: 5,
                  id: '0da03bac-54bb-4838-8a7e-5a0f8c20e72a',
                  idoms_from_parent_cats: ['01868e04-ee6d-43f7-a3a8-698cf7080f5e',
                                             '81f899d5-0754-4ec9-9354-900fe8017b26'],
                  is_in_dominating_set: 'False',
                  label: 'Getting Started',
                  pagerank: 0.0012606598862319254,
                  'subtype': 'article',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/getting-started-article'}},
        {data: {community_id: 6,
                  id: '1125a6d4-dff4-4e50-b5d8-83237bd02721',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: 'Hissing Stones',
                  pagerank: 0.0009680944612862324,
                  'subtype': 'landmark',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/hissing-stones-landmark'}},
        {data: {community_id: 6,
                  id: '13b3ff36-ec1d-4334-8ca0-7e3a46a84123',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'False',
                  label: 'Basilisk Gate',
                  pagerank: 0.0009680944612862324,
                  'subtype': 'landmark',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/basilisk-gate-landmark'}},
        {data: {community_id: 6,
                  id: '149b8db6-0a3f-4555-affc-9b1437b31f7e',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: 'The Steeps',
                  pagerank: 0.0009680944612862324,
                  'subtype': 'settlement',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/the-steeps-settlement'}},
        {data: {community_id: 7,
                  id: '14ddfe78-6940-483c-8066-5e0075f0f673',
                  idoms_from_parent_cats: ['95af41b4-5299-4de1-a462-bf07815b2585',
                                             '18f8185c-5a62-4a36-89f9-b81d39e722f0'],
                  is_in_dominating_set: 'True',
                  label: 'Flintrock',
                  pagerank: 0.0009349918817885876,
                  'subtype': 'settlement',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/flintrock-settlement'}},
        {data: {community_id: 7,
                  id: '15775ff9-568c-408d-8b4c-26059d620bc0',
                  idoms_from_parent_cats: ['89b9f719-53ac-4785-a7df-a193644899ec'],
                  is_in_dominating_set: 'True',
                  label: 'Neverwinter',
                  pagerank: 0.0009349918817885876,
                  'subtype': 'settlement',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/neverwinter-settlement'}},
        {data: {community_id: 0,
                  id: '16bb79db-c4b7-4e3f-a550-b2732603d4e9',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: 'Twin Songs',
                  pagerank: 0.0010810102319045493,
                  'subtype': 'settlement',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/twin-songs-settlement'}},
        {data: {community_id: 1,
                  id: '181e4c8d-cb21-49e3-8ff4-1cd1d3293bbf',
                  idoms_from_parent_cats: ['c21883ef-edfd-4ced-9057-808f9d756bda',
                                             '078031f7-5cbc-4b4f-92d0-00a04ea0fe3e'],
                  is_in_dominating_set: 'True',
                  label: 'Poppy "Pops" McGee',
                  pagerank: 0.0012573761438420179,
                  'subtype': 'person',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/pops-mcgee-person'}},
        {data: {community_id: 6,
                  id: '19cc283f-eb67-4ce7-a308-dc0415b7260a',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: 'Drawing Tree',
                  pagerank: 0.001483654243191565,
                  'subtype': 'landmark',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/drawing-tree-landmark'}},
        {data: {community_id: 1,
                  id: '1b56d550-444d-4067-a34a-34778e2dda61',
                  idoms_from_parent_cats: ['078031f7-5cbc-4b4f-92d0-00a04ea0fe3e'],
                  is_in_dominating_set: 'True',
                  label: 'Blair',
                  pagerank: 0.0025090665452759953,
                  'subtype': 'person',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/blair-person'}},
        {data: {community_id: 0,
                  id: '1b836b46-5cb5-4399-9f00-275db2efc687',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: "Wyrm's Rock",
                  pagerank: 0.0014405833855820633,
                  'subtype': 'landmark',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/wyrm-s-rock-landmark'}},
        {data: {community_id: 9,
                  id: '1cbe8957-d506-481d-b7b0-bfcb75ef5192',
                  idoms_from_parent_cats: ['c396b18c-aa26-4578-81e7-8bf2c0419332'],
                  is_in_dominating_set: 'True',
                  label: 'Grismand ',
                  pagerank: 0.0009349918817885876,
                  'subtype': 'person',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/grismand--person'}},
        {data: {community_id: 11,
                  id: '1d9f0970-b41a-48cc-ae80-e025173d8881',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: "The Wench's Meadhall",
                  pagerank: 0.0012943418626949206,
                  'subtype': 'landmark',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/the-wench26230393Bs-meadhall-landmark'}},
        {data: {community_id: 6,
                  id: '1df40517-e243-44ac-9606-562fba5588e5',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'False',
                  label: 'Blushing Mermaid',
                  pagerank: 0.0009680944612862324,
                  'subtype': 'landmark',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/blushing-mermaid-landmark'}},
        {data: {community_id: 9,
                  id: '1f2298a7-1ad2-4725-8662-d4f4e7ada61c',
                  idoms_from_parent_cats: ['e113bba6-43bf-486d-a8fa-5017745e7af9',
                                             '03b2cfe3-dad1-4419-b4a3-c02554e4dd6a',
                                             'fa4eb288-df1a-45c6-a922-daaea5c40c49'],
                  is_in_dominating_set: 'False',
                  label: 'Zelver ',
                  pagerank: 0.0032078229155774783,
                  'subtype': 'person',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/zelver--person'}},
        {data: {community_id: 2,
                  id: '20e699f4-bc3e-4d0f-a98c-510c3e9c85dc',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'False',
                  label: "A Reader's Guide to The Leyden Nexus WorldAnvil",
                  pagerank: 0.0016025675392990592,
                  'subtype': 'article',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/a-reader-s-guide-to-the-leyden-nexus-worldanvil-article'}},
        {data: {community_id: 1,
                  id: '220a3eea-826a-4163-8b97-7c05b4185b44',
                  idoms_from_parent_cats: ['309b7567-01ed-4a3f-b2de-b6503a40e00a'],
                  is_in_dominating_set: 'True',
                  label: "Duality's Demise",
                  pagerank: 0.0025146814012325346,
                  'subtype': 'organization',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/duality-s-demise-organization'}},
        {data: {community_id: 6,
                  id: '2272d30f-786c-48b7-ba11-51997d4fed8a',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'False',
                  label: 'Heapside District',
                  pagerank: 0.0009680944612862324,
                  'subtype': 'settlement',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/heapside-district-settlement'}},
        {data: {community_id: 4,
                  id: '229e0fd9-7288-4aa8-b7df-b5bd05606ec7',
                  idoms_from_parent_cats: ['7bcfd68f-5920-423f-be89-9003841b384d',
                                             'f9192b97-2255-48fb-bada-e2c521d8af5b'],
                  is_in_dominating_set: 'True',
                  label: 'Half-elf',
                  pagerank: 0.0009349918817885876,
                  'subtype': 'species',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/half-elf-species'}},
        {data: {community_id: 0,
                  id: '238e9b4d-e785-4837-85e1-44ca55967008',
                  idoms_from_parent_cats: ['8751cf98-83be-45c4-9b6b-5549391cab1c',
                                             'a3fe07ba-a93f-44f9-bdda-ca84bc2294d0',
                                             '18f8185c-5a62-4a36-89f9-b81d39e722f0'],
                  is_in_dominating_set: 'True',
                  label: 'Flaming Fist',
                  pagerank: 0.0015699966429600339,
                  'subtype': 'organization',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/flaming-fist-organization'}},
        {data: {community_id: 0,
                  id: '23b7e4ac-f6ae-4cf8-b151-a19f2ce0d36f',
                  idoms_from_parent_cats: ['8eb263b4-447c-4fd3-9762-525921bea6a2',
                                             '7193e1e0-d071-4bc2-a04c-70f0e45a7ae0'],
                  is_in_dominating_set: 'True',
                  label: 'Borus Bormul',
                  pagerank: 0.0011163558326652081,
                  'subtype': 'person',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/borus-bormul-person'}},
        {data: {community_id: 0,
                  id: '24a61050-7a43-4cbd-bbb0-bc52c8ef3e8b',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'False',
                  label: 'Eomane House',
                  pagerank: 0.0009782104744859945,
                  'subtype': 'landmark',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/eomane-house-landmark'}},
        {data: {community_id: 4,
                  id: '26514314-d60c-4206-b6da-bf494cfd496c',
                  idoms_from_parent_cats: ['f9192b97-2255-48fb-bada-e2c521d8af5b'],
                  is_in_dominating_set: 'True',
                  label: 'Goliath',
                  pagerank: 0.0009349918817885876,
                  'subtype': 'species',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/goliath-species'}},
        {data: {community_id: 0,
                  id: '281f0443-f5f4-4742-a993-8e3031550944',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: 'High Hall',
                  pagerank: 0.001250509819777734,
                  'subtype': 'landmark',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/high-hall-landmark'}},
        {data: {community_id: 0,
                  id: '2a0c4087-0a56-4d77-8851-6d6d58be6159',
                  idoms_from_parent_cats: ['d88f42c4-d3bb-4118-b7c1-5cc59cf296e7'],
                  is_in_dominating_set: 'True',
                  label: 'Riverveins',
                  pagerank: 0.001189618426699998,
                  'subtype': 'landmark',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/riverveins-landmark'}},
        {data: {community_id: 3,
                  id: '2a2a30db-97a9-4bb3-9b45-0049bf6fd7ff',
                  idoms_from_parent_cats: ['f9192b97-2255-48fb-bada-e2c521d8af5b',
                                             'a3fe07ba-a93f-44f9-bdda-ca84bc2294d0',
                                             '8eb263b4-447c-4fd3-9762-525921bea6a2',
                                             'f506393a-d938-4114-b2c7-14ecf347a07e',
                                             'c21883ef-edfd-4ced-9057-808f9d756bda',
                                             '18f8185c-5a62-4a36-89f9-b81d39e722f0'],
                  is_in_dominating_set: 'False',
                  label: 'Human',
                  pagerank: 0.0010547752087573653,
                  'subtype': 'species',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/human-species'}},
        {data: {community_id: 16,
                  id: '2adad2e8-3604-459e-815e-69525a0dc3f8',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: 'Welcome to World Anvil - READ ME FIRST',
                  pagerank: 0.0009349918817885876,
                  'subtype': 'article',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/welcome-to-world-anvil---read-me-first-article'}},
        {data: {community_id: 11,
                  id: '2ae7db37-a3dd-4e5d-b033-d37c7ad1b971',
                  idoms_from_parent_cats: ['f9192b97-2255-48fb-bada-e2c521d8af5b',
                                             'a3fe07ba-a93f-44f9-bdda-ca84bc2294d0',
                                             '8eb263b4-447c-4fd3-9762-525921bea6a2',
                                             'f506393a-d938-4114-b2c7-14ecf347a07e',
                                             'c21883ef-edfd-4ced-9057-808f9d756bda',
                                             '18f8185c-5a62-4a36-89f9-b81d39e722f0'],
                  is_in_dominating_set: 'False',
                  label: 'Dastrow',
                  pagerank: 0.0023956533318230753,
                  'subtype': 'settlement',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/dastrow-settlement'}},
        {data: {community_id: 0,
                  id: '2e18c93d-3363-454e-84b1-1c39f6825eab',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: 'Harbreeze Bakery',
                  pagerank: 0.0009782104744859945,
                  'subtype': 'landmark',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/harbreeze-bakery-landmark'}},
        {data: {community_id: 3,
                  id: '2e55c550-f65c-483a-a2e8-c4ac189fa976',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: 'Rosecrown Borough',
                  pagerank: 0.0010487021209486845,
                  'subtype': 'settlement',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/rosecrown-borough-settlement'}},
        {data: {community_id: 5,
                  id: '2e6a1543-6c9d-4986-bfb0-42b9d16fa3c9',
                  idoms_from_parent_cats: ['06bbb2e8-d9c4-4939-9503-986f0eae1ce1'],
                  is_in_dominating_set: 'True',
                  label: 'Chionthar River',
                  pagerank: 0.0014441184468216317,
                  'subtype': 'location',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/chionthar-river-location'}},
        {data: {community_id: 0,
                  id: '2f1520b6-63b8-4436-891f-1cd586eabc57',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: "Hamhock's Slaughterhouse",
                  pagerank: 0.0019461748893755389,
                  'subtype': 'landmark',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/hamhock-s-slaughterhouse-landmark'}},
        {data: {community_id: 7,
                  id: '31356c83-6804-4403-864e-637f0296f4cb',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'False',
                  label: 'The ruins of Lowe Keep',
                  pagerank: 0.0010939629604200135,
                  'subtype': 'landmark',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/the-ruins-of-lowe-keep-landmark'}},
        {data: {community_id: 0,
                  id: '314bc9b8-095d-47b1-9811-16e45e1bdd31',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'False',
                  label: 'Helm and Cloak',
                  pagerank: 0.0009782104744859945,
                  'subtype': 'landmark',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/helm-and-cloak-landmark'}},
        {data: {community_id: 1,
                  id: '329a0014-76e0-4c01-bf4e-2eaab9a80477',
                  idoms_from_parent_cats: ['f9192b97-2255-48fb-bada-e2c521d8af5b',
                                             'a3fe07ba-a93f-44f9-bdda-ca84bc2294d0',
                                             '8eb263b4-447c-4fd3-9762-525921bea6a2',
                                             'f506393a-d938-4114-b2c7-14ecf347a07e',
                                             'c21883ef-edfd-4ced-9057-808f9d756bda',
                                             '18f8185c-5a62-4a36-89f9-b81d39e722f0'],
                  is_in_dominating_set: 'False',
                  label: 'Session 1: A Distant Patron Report',
                  pagerank: 0.0027577045324743343,
                  'subtype': 'report',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/session-13A-a-distant-patron-report-report'}},
        {data: {community_id: 1,
                  id: '32c2a8cf-4588-4b74-b32f-de377e5dc31e',
                  idoms_from_parent_cats: ['ecb86c94-622b-4a62-9b85-e21ce82b4bfc'],
                  is_in_dominating_set: 'False',
                  label: 'The Keymaster',
                  pagerank: 0.0013396541444872152,
                  'subtype': 'person',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/the-keymaster--person'}},
        {data: {community_id: 2,
                  id: '34100a19-5477-4e91-805a-88b411e662ce',
                  idoms_from_parent_cats: ['5a2a47f2-a93d-4ffd-a5cf-f2c71b89e124'],
                  is_in_dominating_set: 'True',
                  label: 'Firearms and Gemarms',
                  pagerank: 0.0009349918817885876,
                  'subtype': 'technology',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/firearms-and-gemarms-technology'}},
        {data: {community_id: 3,
                  id: '3435e6cb-a1c4-464d-a8ae-c8247fdf5da5',
                  idoms_from_parent_cats: ['ba32f9c3-603f-4217-a3a1-7f1210471748'],
                  is_in_dominating_set: 'True',
                  label: 'Beer Hall of Salen',
                  pagerank: 0.0010487021209486845,
                  'subtype': 'landmark',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/beer-hall-of-salen-landmark'}},
        {data: {community_id: 0,
                  id: '34d64bf2-9ff9-45c9-84bd-1d106730a5a7',
                  idoms_from_parent_cats: ['f9192b97-2255-48fb-bada-e2c521d8af5b',
                                             'a3fe07ba-a93f-44f9-bdda-ca84bc2294d0',
                                             '8eb263b4-447c-4fd3-9762-525921bea6a2',
                                             'f506393a-d938-4114-b2c7-14ecf347a07e',
                                             'c21883ef-edfd-4ced-9057-808f9d756bda',
                                             '18f8185c-5a62-4a36-89f9-b81d39e722f0'],
                  is_in_dominating_set: 'True',
                  label: 'Upper City',
                  pagerank: 0.0015254040104884185,
                  'subtype': 'settlement',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/upper-city-settlement'}},
        {data: {community_id: 2,
                  id: '35dd21d4-eaf6-462a-ad6c-21c1b76b0323',
                  idoms_from_parent_cats: ['a3fe07ba-a93f-44f9-bdda-ca84bc2294d0'],
                  is_in_dominating_set: 'True',
                  label: 'Introduction to the Encyclopedia',
                  pagerank: 0.0009349918817885876,
                  'subtype': 'article',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/introduction-to-the-encyclopedia-article'}},
        {data: {community_id: 12,
                  id: '3637da8e-6e77-4ad2-a388-769e1ac931dc',
                  idoms_from_parent_cats: ['d5a1d4e9-81d6-49cf-9249-d70626944fe8'],
                  is_in_dominating_set: 'True',
                  label: 'How to stage your world',
                  pagerank: 0.0009349918817885876,
                  'subtype': 'article',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/how-to-stage-your-world-article'}},
        {data: {community_id: 6,
                  id: '363c70ed-c0c6-49e5-b07e-0e3fdeb870cd',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'False',
                  label: "Mandorcai's Mansion",
                  pagerank: 0.0009680944612862324,
                  'subtype': 'landmark',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/mandorcai-s-mansion-landmark'}},
        {data: {community_id: 5,
                  id: '39b86545-81c4-4195-940a-0c80e883449f',
                  idoms_from_parent_cats: ['377b6172-1949-4d37-8878-a104ecf5dbd0'],
                  is_in_dominating_set: 'True',
                  label: 'Introduction to the Atlas',
                  pagerank: 0.0009349918817885876,
                  'subtype': 'article',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/introduction-to-the-atlas-article'}},
        {data: {community_id: 1,
                  id: '3cb46640-6821-4f97-8042-37ea06443059',
                  idoms_from_parent_cats: ['f9192b97-2255-48fb-bada-e2c521d8af5b',
                                             'a3fe07ba-a93f-44f9-bdda-ca84bc2294d0',
                                             '8eb263b4-447c-4fd3-9762-525921bea6a2',
                                             'f506393a-d938-4114-b2c7-14ecf347a07e',
                                             'c21883ef-edfd-4ced-9057-808f9d756bda',
                                             '18f8185c-5a62-4a36-89f9-b81d39e722f0'],
                  is_in_dominating_set: 'True',
                  label: "The Night's Chill",
                  pagerank: 0.00317920969003285,
                  'subtype': 'organization',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/the-night-s-chill-organization'}},
        {data: {community_id: 1,
                  id: '3d0d7062-9397-4bd0-a3d5-f3bb0538c3f2',
                  idoms_from_parent_cats: ['f9192b97-2255-48fb-bada-e2c521d8af5b',
                                             'a3fe07ba-a93f-44f9-bdda-ca84bc2294d0',
                                             '8eb263b4-447c-4fd3-9762-525921bea6a2',
                                             'f506393a-d938-4114-b2c7-14ecf347a07e',
                                             'c21883ef-edfd-4ced-9057-808f9d756bda',
                                             '18f8185c-5a62-4a36-89f9-b81d39e722f0'],
                  is_in_dominating_set: 'False',
                  label: 'Dawn',
                  pagerank: 0.0024399438734414173,
                  'subtype': 'person',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/dawn-person'}},
        {data: {community_id: 0,
                  id: '3d6f0b72-4378-4511-9bae-7ba17d585ab3',
                  idoms_from_parent_cats: ['a3fe07ba-a93f-44f9-bdda-ca84bc2294d0',
                                             'cb7cf108-f6a5-48a9-b9b1-37ae64f396a1'],
                  is_in_dominating_set: 'False',
                  label: "Ramazith's Tower",
                  pagerank: 0.002796258679966456,
                  'subtype': 'landmark',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/ramazith-s-tower-landmark'}},
        {data: {community_id: 1,
                  id: '3ee822f1-3432-4df1-92d5-3acaa8f48c45',
                  idoms_from_parent_cats: ['f9192b97-2255-48fb-bada-e2c521d8af5b',
                                             'a3fe07ba-a93f-44f9-bdda-ca84bc2294d0',
                                             '8eb263b4-447c-4fd3-9762-525921bea6a2',
                                             'f506393a-d938-4114-b2c7-14ecf347a07e',
                                             'c21883ef-edfd-4ced-9057-808f9d756bda',
                                             '18f8185c-5a62-4a36-89f9-b81d39e722f0'],
                  is_in_dominating_set: 'True',
                  label: 'Master Corvus Landia Pyn',
                  pagerank: 0.0032293082706133652,
                  'subtype': 'person',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/master-corvus-landia-pyn-person'}},
        {data: {community_id: 6,
                  id: '3eea0d33-3a47-420c-b693-8f52763852f8',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: 'Bloomridge',
                  pagerank: 0.0009680944612862324,
                  'subtype': 'settlement',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/bloomridge-settlement'}},
        {data: {community_id: 4,
                  id: '421187fd-99d3-4cdb-bd93-2d97e20fc508',
                  idoms_from_parent_cats: ['f9192b97-2255-48fb-bada-e2c521d8af5b'],
                  is_in_dominating_set: 'True',
                  label: 'Tabaxi',
                  pagerank: 0.0009349918817885876,
                  'subtype': 'species',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/tabaxi-species'}},
        {data: {community_id: 5,
                  id: '424cc442-1219-420b-8e7f-cf8ca2bd8c75',
                  idoms_from_parent_cats: ['ae6a32a1-8424-45b3-9824-17702db8d62f'],
                  is_in_dominating_set: 'True',
                  label: "Gem Rail Station - Baldur's Gate",
                  pagerank: 0.0009349918817885876,
                  'subtype': 'landmark',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/gem-rail-station---baldur-s-gate-landmark'}},
        {data: {community_id: 2,
                  id: '43092fdf-5d85-408e-bf99-fe9ed835a839',
                  idoms_from_parent_cats: ['ed7c9084-0b43-4e5b-9db6-d7c9b2a62a61'],
                  is_in_dominating_set: 'False',
                  label: 'Gemcutter',
                  pagerank: 0.0013882391006591734,
                  'subtype': 'profession',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/gemcutter-profession'}},
        {data: {community_id: 1,
                  id: '44c03cd5-51bf-436d-8fe3-1cfb6d5caec4',
                  idoms_from_parent_cats: ['f9192b97-2255-48fb-bada-e2c521d8af5b',
                                             'a3fe07ba-a93f-44f9-bdda-ca84bc2294d0',
                                             '8eb263b4-447c-4fd3-9762-525921bea6a2',
                                             'f506393a-d938-4114-b2c7-14ecf347a07e',
                                             'c21883ef-edfd-4ced-9057-808f9d756bda',
                                             '18f8185c-5a62-4a36-89f9-b81d39e722f0'],
                  is_in_dominating_set: 'False',
                  label: "Day's Calamity",
                  pagerank: 0.0030006170404609876,
                  'subtype': 'organization',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/day-s-calamity-organization-1'}},
        {data: {community_id: 7,
                  id: '48b1073b-c4d1-411b-b9bb-9fe389df84bd',
                  idoms_from_parent_cats: ['d9f8b271-fae8-4107-857a-d9da664f3825'],
                  is_in_dominating_set: 'True',
                  label: 'Wadun',
                  pagerank: 0.0009349918817885876,
                  'subtype': 'settlement',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/wadun-settlement'}},
        {data: {community_id: 3,
                  id: '48df75b0-177f-4e6b-ab5e-d9ba23a63d2c',
                  idoms_from_parent_cats: ['c21883ef-edfd-4ced-9057-808f9d756bda'],
                  is_in_dominating_set: 'True',
                  label: 'Leon ',
                  pagerank: 0.0009349918817885876,
                  'subtype': 'person',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/leon--person'}},
        {data: {community_id: 1,
                  id: '49301c65-06b9-4927-8b3c-a8bcaa7ac638',
                  idoms_from_parent_cats: ['ecb86c94-622b-4a62-9b85-e21ce82b4bfc'],
                  is_in_dominating_set: 'False',
                  label: 'Obedience',
                  pagerank: 0.001421166502153014,
                  'subtype': 'person',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/obedience--person'}},
        {data: {community_id: 4,
                  id: '4b101ce9-3a7e-434b-be22-b276b21acb5d',
                  idoms_from_parent_cats: ['f9192b97-2255-48fb-bada-e2c521d8af5b'],
                  is_in_dominating_set: 'True',
                  label: 'Changeling',
                  pagerank: 0.0009349918817885876,
                  'subtype': 'species',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/changeling-species'}},
        {data: {community_id: 4,
                  id: '4b3ef796-b4b6-4fef-9edf-ff892f083500',
                  idoms_from_parent_cats: ['f9192b97-2255-48fb-bada-e2c521d8af5b'],
                  is_in_dominating_set: 'True',
                  label: 'Simic Hybrid',
                  pagerank: 0.0009349918817885876,
                  'subtype': 'species',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/simic-hybrid-species'}},
        {data: {community_id: 1,
                  id: '4b57c07b-f3f4-4e1b-925f-a719d07451aa',
                  idoms_from_parent_cats: ['f9192b97-2255-48fb-bada-e2c521d8af5b',
                                             'a3fe07ba-a93f-44f9-bdda-ca84bc2294d0',
                                             '8eb263b4-447c-4fd3-9762-525921bea6a2',
                                             'f506393a-d938-4114-b2c7-14ecf347a07e',
                                             'c21883ef-edfd-4ced-9057-808f9d756bda',
                                             '18f8185c-5a62-4a36-89f9-b81d39e722f0'],
                  is_in_dominating_set: 'False',
                  label: 'Session 3: The Goblin’s Deep Hole Report',
                  pagerank: 0.002798812291111565,
                  'subtype': 'report',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/session-33A-the-goblinE28099s-deep-hole-report-report'}},
        {data: {community_id: 0,
                  id: '4cfc5e47-e3df-422e-a22d-666358cfbabd',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'False',
                  label: 'Sea Gate',
                  pagerank: 0.0009782104744859945,
                  'subtype': 'landmark',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/sea-gate-landmark'}},
        {data: {community_id: 6,
                  id: '4d356dae-400f-4fa5-a1b8-a0e1b05c5ce1',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: 'Low Lantern',
                  pagerank: 0.0009680944612862324,
                  'subtype': 'landmark',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/low-lantern-landmark'}},
        {data: {community_id: 11,
                  id: '4e33f683-0426-48e2-9918-50d42e5d9226',
                  idoms_from_parent_cats: ['a5e8c4a6-7014-4162-aa56-350c22c971df',
                                             'a3fe07ba-a93f-44f9-bdda-ca84bc2294d0'],
                  is_in_dominating_set: 'False',
                  label: 'Zona',
                  pagerank: 0.0023921002453533664,
                  'subtype': 'person',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/zona-person'}},
        {data: {community_id: 3,
                  id: '4ea193ca-720f-403d-81eb-45a644357674',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: "Craftsman's Borough",
                  pagerank: 0.0010487021209486845,
                  'subtype': 'settlement',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/craftsman-s-borough-settlement'}},
        {data: {community_id: 9,
                  id: '4f796835-3ee8-42bc-946c-eb59cf44889e',
                  idoms_from_parent_cats: ['e2461c29-077e-4fd6-8404-935d1396048c'],
                  is_in_dominating_set: 'True',
                  label: 'How to organize your Campaigns',
                  pagerank: 0.0009349918817885876,
                  'subtype': 'article',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/how-to-organize-your-campaigns-article'}},
        {data: {community_id: 0,
                  id: '52378476-f915-4d52-8879-d362780dd927',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'False',
                  label: "Baldur's Gate - The Gatehouse",
                  pagerank: 0.0009782104744859945,
                  'subtype': 'landmark',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/baldur-s-gate---the-gatehouse-landmark'}},
        {data: {community_id: 8,
                  id: '5342354a-8d76-44b6-9b4c-ba7020ded959',
                  idoms_from_parent_cats: ['5fc045cf-705c-41aa-b4dc-517a1bec5d52'],
                  is_in_dominating_set: 'True',
                  label: "Religions of Maalen'ar",
                  pagerank: 0.0009349918817885876,
                  'subtype': 'article',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/religions-of-maalen-ar-article'}},
        {data: {community_id: 3,
                  id: '5455d47c-5c8b-4c8d-9445-5edb86c50ea0',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: 'Feybluff District',
                  pagerank: 0.0010487021209486845,
                  'subtype': 'settlement',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/feybluff-district-settlement'}},
        {data: {community_id: 3,
                  id: '547a902c-1d91-4f6f-abfa-a527ccefa930',
                  idoms_from_parent_cats: ['c21883ef-edfd-4ced-9057-808f9d756bda',
                                             '8751cf98-83be-45c4-9b6b-5549391cab1c',
                                             'f9192b97-2255-48fb-bada-e2c521d8af5b'],
                  is_in_dominating_set: 'False',
                  label: 'Shifter Creation Story',
                  pagerank: 0.0035624017461585236,
                  'subtype': 'myth',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/shifter-creation-story-myth'}},
        {data: {community_id: 1,
                  id: '54f7d604-b2b7-4ac4-bc96-fc169a366af7',
                  idoms_from_parent_cats: ['18f8185c-5a62-4a36-89f9-b81d39e722f0',
                                             '078031f7-5cbc-4b4f-92d0-00a04ea0fe3e'],
                  is_in_dominating_set: 'True',
                  label: 'Jimmy Cariway',
                  pagerank: 0.0012573761438420179,
                  'subtype': 'person',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/jimmy-cariway-person'}},
        {data: {community_id: 4,
                  id: '558a25f8-e749-4c62-ba06-7635647e56bb',
                  idoms_from_parent_cats: ['f9192b97-2255-48fb-bada-e2c521d8af5b'],
                  is_in_dominating_set: 'True',
                  label: 'Dragonborn',
                  pagerank: 0.0009349918817885876,
                  'subtype': 'species',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/dragonborn-species'}},
        {data: {community_id: 1,
                  id: '5800677f-0020-432e-8ac5-cb93004f302f',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: 'Ch. 2 - Calamity’s Holding',
                  pagerank: 0.0015797604058954483,
                  'subtype': 'plot',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/ch-2---calamityE28099s-holding-article'}},
        {data: {community_id: 8,
                  id: '58087e56-e986-468c-875e-9643acfe6eb9',
                  idoms_from_parent_cats: ['808faaed-0d82-43aa-b1a1-059d95d8dbff'],
                  is_in_dominating_set: 'False',
                  label: 'The Light-sighted',
                  pagerank: 0.0010939629604200135,
                  'subtype': 'organization',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/the-light-sighted-article'}},
        {data: {community_id: 2,
                  id: '5b769580-a906-4588-a488-639369a771b8',
                  idoms_from_parent_cats: ['56d191a4-f254-4383-b5ad-f9dfa3b6cc55'],
                  is_in_dominating_set: 'True',
                  label: 'Norfal Glaring Owl',
                  pagerank: 0.0009349918817885876,
                  'subtype': 'species',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/norfal-glaring-owl-species'}},
        {data: {community_id: 6,
                  id: '5bfdbd26-6e7c-495e-b447-251686d9f2fd',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: 'Blade and Stars',
                  pagerank: 0.0009680944612862324,
                  'subtype': 'landmark',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/blade-and-stars-landmark'}},
        {data: {community_id: 2,
                  id: '5e0a5b1f-7ada-4616-b8c1-b2685fe1768b',
                  idoms_from_parent_cats: ['5a2a47f2-a93d-4ffd-a5cf-f2c71b89e124'],
                  is_in_dominating_set: 'True',
                  label: 'Baldur’s Gate Charge Card',
                  pagerank: 0.0011302753937650633,
                  'subtype': 'item',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/baldurE28099s-gate-charge-card-item'}},
        {data: {community_id: 1,
                  id: '5fa88ac0-d590-4453-8d66-05ae9ff01c02',
                  idoms_from_parent_cats: ['f9192b97-2255-48fb-bada-e2c521d8af5b',
                                             'a3fe07ba-a93f-44f9-bdda-ca84bc2294d0',
                                             '8eb263b4-447c-4fd3-9762-525921bea6a2',
                                             'f506393a-d938-4114-b2c7-14ecf347a07e',
                                             'c21883ef-edfd-4ced-9057-808f9d756bda',
                                             '18f8185c-5a62-4a36-89f9-b81d39e722f0'],
                  is_in_dominating_set: 'True',
                  label: "Night's Nesting",
                  pagerank: 0.0030200526768991666,
                  'subtype': 'landmark',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/night-s-nesting-landmark'}},
        {data: {community_id: 10,
                  id: '60cd8d55-f4ec-474c-adca-675d8ae78394',
                  idoms_from_parent_cats: ['ea08641f-ebd9-42da-bfe3-7e6200fa8dbf'],
                  is_in_dominating_set: 'True',
                  label: 'The Ring of Calamity',
                  pagerank: 0.0009349918817885876,
                  'subtype': 'item',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/the-ring-of-calamity-item'}},
        {data: {community_id: 9,
                  id: '61160e79-057f-4bfd-8355-51d1675b4050',
                  idoms_from_parent_cats: ['c396b18c-aa26-4578-81e7-8bf2c0419332'],
                  is_in_dominating_set: 'True',
                  label: 'Unnamed Flaming Fist Agent ',
                  pagerank: 0.0009349918817885876,
                  'subtype': 'person',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/unnamed-flaming-fist-agent--person'}},
        {data: {community_id: 7,
                  id: '61995c43-27e4-421e-b146-9ec4587d41e7',
                  idoms_from_parent_cats: ['ed0d3731-1686-410b-9808-1190b45173af',
                                             'a3fe07ba-a93f-44f9-bdda-ca84bc2294d0',
                                             '18f8185c-5a62-4a36-89f9-b81d39e722f0'],
                  is_in_dominating_set: 'True',
                  label: 'Luskan',
                  pagerank: 0.001385499685856536,
                  'subtype': 'settlement',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/luskan-settlement'}},
        {data: {community_id: 5,
                  id: '645835bc-dbb0-4844-bbe9-cee200f4f412',
                  idoms_from_parent_cats: ['06bbb2e8-d9c4-4939-9503-986f0eae1ce1'],
                  is_in_dominating_set: 'True',
                  label: 'Hollow Hills',
                  pagerank: 0.0009349918817885876,
                  'subtype': 'location',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/hollow-hills-location'}},
        {data: {community_id: 0,
                  id: '654c36b5-5fcc-4687-b87f-a446cab74789',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: 'Rivington',
                  pagerank: 0.001189618426699998,
                  'subtype': 'settlement',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/rivington-settlement'}},
        {data: {community_id: 0,
                  id: '6789886c-3883-4df1-9001-65a1a7cea16a',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'False',
                  label: 'Hhune House',
                  pagerank: 0.0009782104744859945,
                  'subtype': 'landmark',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/hhune-house-landmark'}},
        {data: {community_id: 9,
                  id: '68574ff8-cfeb-4433-abb7-1603d9a86fb6',
                  idoms_from_parent_cats: ['c21883ef-edfd-4ced-9057-808f9d756bda',
                                             'e113bba6-43bf-486d-a8fa-5017745e7af9'],
                  is_in_dominating_set: 'False',
                  label: 'Bran ',
                  pagerank: 0.001619131631179606,
                  'subtype': 'person',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/bran--person'}},
        {data: {community_id: 3,
                  id: '687571ce-f8dc-42fb-ad8a-5e2d17f6fcc3',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: "East Hart's Village",
                  pagerank: 0.0010487021209486845,
                  'subtype': 'settlement',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/east-hart-s-village-settlement'}},
        {data: {community_id: 1,
                  id: '687b79e2-b062-4f75-8762-1f7b7d433454',
                  idoms_from_parent_cats: ['309b7567-01ed-4a3f-b2de-b6503a40e00a',
                                             '06bbb2e8-d9c4-4939-9503-986f0eae1ce1'],
                  is_in_dominating_set: 'True',
                  label: 'Calamity’s Holding',
                  pagerank: 0.0011302753937650633,
                  'subtype': 'landmark',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/calamityE28099s-holding-landmark'}},
        {data: {community_id: 3,
                  id: '69f87e0f-e2c3-45cf-ac25-6fcb834eb1b4',
                  idoms_from_parent_cats: ['c21883ef-edfd-4ced-9057-808f9d756bda',
                                             '547a902c-1d91-4f6f-abfa-a527ccefa930'],
                  is_in_dominating_set: 'False',
                  label: 'Margie Williams',
                  pagerank: 0.002391838618155658,
                  'subtype': 'person',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/margie-williams-person-1'}},
        {data: {community_id: 0,
                  id: '6c034c72-1c98-4a12-a53f-deba52c838f9',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'False',
                  label: 'Manor Gate',
                  pagerank: 0.0009782104744859945,
                  'subtype': 'landmark',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/manor-gate-landmark'}},
        {data: {community_id: 0,
                  id: '6c1a7fcf-cf2c-484f-a580-16ba405771e9',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'False',
                  label: 'Watch Citadel',
                  pagerank: 0.0009782104744859945,
                  'subtype': 'landmark',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/watch-citadel-landmark'}},
        {data: {community_id: 7,
                  id: '6f7d200a-f37d-4ba2-a1ed-af6c498a1596',
                  idoms_from_parent_cats: ['2193f2f1-0c22-4ff9-bb43-5b100df458df'],
                  is_in_dominating_set: 'True',
                  label: 'Arvok Limiun',
                  pagerank: 0.0009349918817885876,
                  'subtype': 'person',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/arvok-limiun-person'}},
        {data: {community_id: 0,
                  id: '7126b683-be1f-4040-a40f-c20246cf4ef5',
                  idoms_from_parent_cats: ['06bbb2e8-d9c4-4939-9503-986f0eae1ce1'],
                  is_in_dominating_set: 'True',
                  label: 'Sword Coast',
                  pagerank: 0.002561869078433844,
                  'subtype': 'location',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/sword-coast-location'}},
        {data: {community_id: 0,
                  id: '7193e1e0-d071-4bc2-a04c-70f0e45a7ae0',
                  idoms_from_parent_cats: ['f9192b97-2255-48fb-bada-e2c521d8af5b',
                                             'a3fe07ba-a93f-44f9-bdda-ca84bc2294d0',
                                             '8eb263b4-447c-4fd3-9762-525921bea6a2',
                                             'f506393a-d938-4114-b2c7-14ecf347a07e',
                                             'c21883ef-edfd-4ced-9057-808f9d756bda',
                                             '18f8185c-5a62-4a36-89f9-b81d39e722f0'],
                  is_in_dominating_set: 'False',
                  label: 'Session 2: All Along the Watchtower Report',
                  pagerank: 0.0020270556778089997,
                  'subtype': 'report',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/session-23A-all-along-the-watchtower-report-report'}},
        {data: {community_id: 9,
                  id: '7233f0fa-df2c-471d-a846-cfc1ff8e9f4c',
                  idoms_from_parent_cats: ['68574ff8-cfeb-4433-abb7-1603d9a86fb6',
                                             '03b2cfe3-dad1-4419-b4a3-c02554e4dd6a',
                                             'fa4eb288-df1a-45c6-a922-daaea5c40c49'],
                  is_in_dominating_set: 'True',
                  label: 'Session 3: Hunting The Underlying Report',
                  pagerank: 0.0009349918817885876,
                  'subtype': 'report',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/session-33A-hunting-the-underlying-report-report'}},
        {data: {community_id: 2,
                  id: '72f693b7-c21e-4060-a0f9-36c21d5faac3',
                  idoms_from_parent_cats: ['3bc36745-bcb5-4d11-9b82-173bdd525d92'],
                  is_in_dominating_set: 'True',
                  label: 'Farhorn Swords',
                  pagerank: 0.0009349918817885876,
                  'subtype': 'organization',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/farhorn-swords-organization'}},
        {data: {community_id: 0,
                  id: '7336ef8a-eed6-4bc0-9f11-4479a5a7396a',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'False',
                  label: 'Distant Shores',
                  pagerank: 0.0009782104744859945,
                  'subtype': 'landmark',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/distant-shores-landmark'}},
        {data: {community_id: 1,
                  id: '75080b65-2527-4ca3-8b07-b5dc93611978',
                  idoms_from_parent_cats: ['a3fe07ba-a93f-44f9-bdda-ca84bc2294d0',
                                             '3cb46640-6821-4f97-8042-37ea06443059'],
                  is_in_dominating_set: 'True',
                  label: 'Grand Ro',
                  pagerank: 0.0009349918817885876,
                  'subtype': 'rank',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/grand-ro-rank'}},
        {data: {community_id: 1,
                  id: '7585bb54-b33d-4d63-ab0b-bde01248b475',
                  idoms_from_parent_cats: ['f9192b97-2255-48fb-bada-e2c521d8af5b',
                                             'a3fe07ba-a93f-44f9-bdda-ca84bc2294d0',
                                             '8eb263b4-447c-4fd3-9762-525921bea6a2',
                                             'f506393a-d938-4114-b2c7-14ecf347a07e',
                                             'c21883ef-edfd-4ced-9057-808f9d756bda',
                                             '18f8185c-5a62-4a36-89f9-b81d39e722f0'],
                  is_in_dominating_set: 'True',
                  label: 'The Night Mother',
                  pagerank: 0.002186946900603384,
                  'subtype': 'person',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/the-night-mother-person'}},
        {data: {community_id: 4,
                  id: '75a3c752-7b80-4bde-a0c3-cdcc1095e4cc',
                  idoms_from_parent_cats: ['8eb263b4-447c-4fd3-9762-525921bea6a2'],
                  is_in_dominating_set: 'True',
                  label: "Bild 'Bone Fist' Windergard",
                  pagerank: 0.0013324195783671522,
                  'subtype': 'person',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/bild--bone-fist--windergard-person'}},
        {data: {community_id: 4,
                  id: '75ead13f-9e8d-482d-ba4d-8f5b63c41e53',
                  idoms_from_parent_cats: ['f9192b97-2255-48fb-bada-e2c521d8af5b'],
                  is_in_dominating_set: 'True',
                  label: 'Firbolg',
                  pagerank: 0.0009349918817885876,
                  'subtype': 'species',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/firbolg-species'}},
        {data: {community_id: 0,
                  id: '79c9af5a-03b0-4eb7-a887-1b6ce9d36bef',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'False',
                  label: "Lady's Hall",
                  pagerank: 0.0009782104744859945,
                  'subtype': 'landmark',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/lady-s-hall-landmark'}},
        {data: {community_id: 0,
                  id: '79ea8b25-d8cf-4321-80a5-b30094ba88fe',
                  idoms_from_parent_cats: ['8eb263b4-447c-4fd3-9762-525921bea6a2'],
                  is_in_dominating_set: 'True',
                  label: 'Urdon Irongrip',
                  pagerank: 0.0009349918817885876,
                  'subtype': 'person',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/urdon-irongrip-person'}},
        {data: {community_id: 0,
                  id: '7a1b402c-c342-4dce-8924-bb30d69c72d4',
                  idoms_from_parent_cats: ['6889ca60-afdc-4a7f-b68f-a5e3aeb6e13c'],
                  is_in_dominating_set: 'False',
                  label: 'Cursius Isim',
                  pagerank: 0.0020318583044584455,
                  'subtype': 'person',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/cursius-isim-person'}},
        {data: {community_id: 10,
                  id: '7b0024ac-6bbd-4146-8a5f-de918d34d3ab',
                  idoms_from_parent_cats: ['171d3bd8-83d1-4c74-8b8b-9f4e0ef82759'],
                  is_in_dominating_set: 'True',
                  label: 'Spellcasting',
                  pagerank: 0.0009349918817885876,
                  'subtype': 'article',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/spellcasting-article'}},
        {data: {community_id: 1,
                  id: '7bcfd68f-5920-423f-be89-9003841b384d',
                  idoms_from_parent_cats: ['a3fe07ba-a93f-44f9-bdda-ca84bc2294d0',
                                             '3cb46640-6821-4f97-8042-37ea06443059'],
                  is_in_dominating_set: 'False',
                  label: 'Grand Ro Herman Foster',
                  pagerank: 0.001783882572384819,
                  'subtype': 'person',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/grand-ro-herman-foster-person'}},
        {data: {community_id: 0,
                  id: '7bd24a37-28a7-47fd-8d33-0bda438936bc',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: 'Norchapel',
                  pagerank: 0.001189618426699998,
                  'subtype': 'settlement',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/norchapel-settlement'}},
        {data: {community_id: 4,
                  id: '7c10e7a1-f3c2-4da1-a8cc-cb85581ef257',
                  idoms_from_parent_cats: ['f9192b97-2255-48fb-bada-e2c521d8af5b'],
                  is_in_dominating_set: 'True',
                  label: 'Vedalken',
                  pagerank: 0.0009349918817885876,
                  'subtype': 'species',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/vedalken-species'}},
        {data: {community_id: 0,
                  id: '7c75258d-3582-452c-aef8-cf2d7bee4c2f',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'False',
                  label: 'Citadel Gate',
                  pagerank: 0.0009782104744859945,
                  'subtype': 'landmark',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/citadel-gate-landmark'}},
        {data: {community_id: 1,
                  id: '7db79ff9-82b5-43b8-96a7-43e2abbf1b42',
                  idoms_from_parent_cats: ['a3fe07ba-a93f-44f9-bdda-ca84bc2294d0',
                                             '4b57c07b-f3f4-4e1b-925f-a719d07451aa'],
                  is_in_dominating_set: 'True',
                  label: 'Eb',
                  pagerank: 0.0011728404510481796,
                  'subtype': 'person',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/eb--person'}},
        {data: {community_id: 0,
                  id: '7de9777f-9da6-4e3b-bd45-380c7789cbfc',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'False',
                  label: 'Rillyn House',
                  pagerank: 0.0009782104744859945,
                  'subtype': 'landmark',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/rillyn-house-landmark'}},
        {data: {community_id: 0,
                  id: '7ec4d32a-7544-4d34-b890-bb5c54d7edce',
                  idoms_from_parent_cats: ['f9192b97-2255-48fb-bada-e2c521d8af5b',
                                             'a3fe07ba-a93f-44f9-bdda-ca84bc2294d0',
                                             '8eb263b4-447c-4fd3-9762-525921bea6a2',
                                             'f506393a-d938-4114-b2c7-14ecf347a07e',
                                             'c21883ef-edfd-4ced-9057-808f9d756bda',
                                             '18f8185c-5a62-4a36-89f9-b81d39e722f0'],
                  is_in_dominating_set: 'False',
                  label: 'The Wide',
                  pagerank: 0.0015686226031858253,
                  'subtype': 'settlement',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/the-wide-settlement'}},
        {data: {community_id: 0,
                  id: '7f251ce9-ed23-4bc8-919f-985f6338cfd8',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: 'Black Dragon Gate',
                  pagerank: 0.0009782104744859945,
                  'subtype': 'landmark',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/black-dragon-gate-landmark'}},
        {data: {community_id: 1,
                  id: '7f55cf94-78e0-4c00-9222-e405d600e979',
                  idoms_from_parent_cats: ['cb7cf108-f6a5-48a9-b9b1-37ae64f396a1'],
                  is_in_dominating_set: 'True',
                  label: 'Ch. 3 - Recruiting Help',
                  pagerank: 0.0015797604058954483,
                  'subtype': 'plot',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/ch-3---recruiting-help-plot'}},
        {data: {community_id: 6,
                  id: '7f6bf64b-189c-4552-bd7c-459fd034ff07',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'False',
                  label: 'Eastway District',
                  pagerank: 0.0009680944612862324,
                  'subtype': 'settlement',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/eastway-district-settlement'}},
        {data: {community_id: 0,
                  id: '8070937b-aea5-4ec5-89b2-1663be72df97',
                  idoms_from_parent_cats: ['8eb263b4-447c-4fd3-9762-525921bea6a2'],
                  is_in_dominating_set: 'True',
                  label: 'Jerry Tucker',
                  pagerank: 0.0009349918817885876,
                  'subtype': 'person',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/jerry-tucker-person'}},
        {data: {community_id: 1,
                  id: '80cc0e6e-f11b-48f4-bb00-54d504029652',
                  idoms_from_parent_cats: ['f9192b97-2255-48fb-bada-e2c521d8af5b',
                                             'a3fe07ba-a93f-44f9-bdda-ca84bc2294d0',
                                             '8eb263b4-447c-4fd3-9762-525921bea6a2',
                                             'f506393a-d938-4114-b2c7-14ecf347a07e',
                                             'c21883ef-edfd-4ced-9057-808f9d756bda',
                                             '18f8185c-5a62-4a36-89f9-b81d39e722f0'],
                  is_in_dominating_set: 'True',
                  label: 'Calamity Follows',
                  pagerank: 0.0010412424905322697,
                  'subtype': 'militaryConflict',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/calamity-follows-militaryConflict'}},
        {data: {community_id: 5,
                  id: '81f899d5-0754-4ec9-9354-900fe8017b26',
                  idoms_from_parent_cats: ['0da03bac-54bb-4838-8a7e-5a0f8c20e72a',
                                             'ec7f10bb-6242-4f93-aaad-24f9dcc62ef1'],
                  is_in_dominating_set: 'True',
                  label: 'Welcome to The Leyden Nexus',
                  pagerank: 0.0011493203204284736,
                  'subtype': 'article',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/welcome-to-the-leyden-nexus-article'}},
        {data: {community_id: 2,
                  id: '844bd261-2e0b-4efc-81ee-cca98b09d27b',
                  idoms_from_parent_cats: ['56d191a4-f254-4383-b5ad-f9dfa3b6cc55'],
                  is_in_dominating_set: 'True',
                  label: 'Thorny Frog Tongue',
                  pagerank: 0.0009349918817885876,
                  'subtype': 'species',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/thorny-frog-tongue-species'}},
        {data: {community_id: 1,
                  id: '8552fae0-1c87-43f6-b0cb-81b5e9baa0e3',
                  idoms_from_parent_cats: ['f9192b97-2255-48fb-bada-e2c521d8af5b',
                                             'a3fe07ba-a93f-44f9-bdda-ca84bc2294d0',
                                             '8eb263b4-447c-4fd3-9762-525921bea6a2',
                                             'f506393a-d938-4114-b2c7-14ecf347a07e',
                                             'c21883ef-edfd-4ced-9057-808f9d756bda',
                                             '18f8185c-5a62-4a36-89f9-b81d39e722f0'],
                  is_in_dominating_set: 'True',
                  label: "The Dawn's Embrace",
                  pagerank: 0.002532735017446209,
                  'subtype': 'organization',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/the-dawn-s-embrace-organization'}},
        {data: {community_id: 6,
                  id: '857e7b81-58a7-4307-867b-480039b13655',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'False',
                  label: "Jopalin's",
                  pagerank: 0.0009680944612862324,
                  'subtype': 'landmark',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/jopalin-s-landmark'}},
        {data: {community_id: 1,
                  id: '86d7d728-7f68-4e9e-8319-6274cd1e3049',
                  idoms_from_parent_cats: ['f9192b97-2255-48fb-bada-e2c521d8af5b',
                                             'a3fe07ba-a93f-44f9-bdda-ca84bc2294d0',
                                             '8eb263b4-447c-4fd3-9762-525921bea6a2',
                                             'f506393a-d938-4114-b2c7-14ecf347a07e',
                                             'c21883ef-edfd-4ced-9057-808f9d756bda',
                                             '18f8185c-5a62-4a36-89f9-b81d39e722f0'],
                  is_in_dominating_set: 'True',
                  label: "O'fair, Cunning of the Night Mother",
                  pagerank: 0.002080696291859702,
                  'subtype': 'person',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/o-fair2C-cunning-of-the-night-mother-person'}},
        {data: {community_id: 0,
                  id: '8751cf98-83be-45c4-9b6b-5549391cab1c',
                  idoms_from_parent_cats: ['f9192b97-2255-48fb-bada-e2c521d8af5b',
                                             'a3fe07ba-a93f-44f9-bdda-ca84bc2294d0',
                                             '8eb263b4-447c-4fd3-9762-525921bea6a2',
                                             'f506393a-d938-4114-b2c7-14ecf347a07e',
                                             'c21883ef-edfd-4ced-9057-808f9d756bda',
                                             '18f8185c-5a62-4a36-89f9-b81d39e722f0'],
                  is_in_dominating_set: 'False',
                  label: 'Neril',
                  pagerank: 0.004792106159686695,
                  'subtype': 'location',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/neril-location'}},
        {data: {community_id: 3,
                  id: '876af611-e551-4975-b263-8203b16fb159',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: 'Mere Ward',
                  pagerank: 0.0010487021209486845,
                  'subtype': 'settlement',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/mere-ward-settlement'}},
        {data: {community_id: 3,
                  id: '87a728c8-6d99-4b4b-86a4-cae2e7719ad7',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: "Dragon's Farthing",
                  pagerank: 0.0010487021209486845,
                  'subtype': 'settlement',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/dragon-s-farthing-settlement'}},
        {data: {community_id: 1,
                  id: '881c5607-f6e1-4313-9905-b3531c276f5e',
                  idoms_from_parent_cats: ['f9192b97-2255-48fb-bada-e2c521d8af5b',
                                             'a3fe07ba-a93f-44f9-bdda-ca84bc2294d0',
                                             '8eb263b4-447c-4fd3-9762-525921bea6a2',
                                             'f506393a-d938-4114-b2c7-14ecf347a07e',
                                             'c21883ef-edfd-4ced-9057-808f9d756bda',
                                             '18f8185c-5a62-4a36-89f9-b81d39e722f0'],
                  is_in_dominating_set: 'False',
                  label: "Stronen'dal",
                  pagerank: 0.0025433377971398443,
                  'subtype': 'person',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/stronen-dal-person'}},
        {data: {community_id: 0,
                  id: '88e4a97f-8e06-4ce0-b96d-fb5a46d3405e',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'False',
                  label: "Sow's Foot",
                  pagerank: 0.001189618426699998,
                  'subtype': 'settlement',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/sow-s-foot-settlement'}},
        {data: {community_id: 0,
                  id: '8abe03c6-c803-4bbf-9682-92049abb8d53',
                  idoms_from_parent_cats: ['d9e2d266-d168-4c77-8163-b36c40b362d0'],
                  is_in_dominating_set: 'True',
                  label: 'The Isims',
                  pagerank: 0.0009349918817885876,
                  'subtype': 'organization',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/the-isims-organization'}},
        {data: {community_id: 6,
                  id: '8adef028-bfea-4fe1-85d8-f0e0054e2db8',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: 'Shrine of Suffering',
                  pagerank: 0.0009680944612862324,
                  'subtype': 'landmark',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/shrine-of-suffering-landmark'}},
        {data: {community_id: 6,
                  id: '8b99cc1a-4852-4f54-b1ef-df896ae697c7',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'False',
                  label: "Candulhallow's Funeral Arrangements",
                  pagerank: 0.0009680944612862324,
                  'subtype': 'landmark',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/candulhallow-s-funeral-arrangements-landmark'}},
        {data: {community_id: 7,
                  id: '8c6a1339-328d-4784-b13e-31d7fa3e5a5f',
                  idoms_from_parent_cats: ['0e2e1fa7-d2cc-4f62-bbcc-97aed9d0b397'],
                  is_in_dominating_set: 'True',
                  label: 'Westmen',
                  pagerank: 0.0009349918817885876,
                  'subtype': 'settlement',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/westmen-settlement'}},
        {data: {community_id: 4,
                  id: '8df345bb-2e69-45de-bc09-62a8c3e01c1c',
                  idoms_from_parent_cats: ['f9192b97-2255-48fb-bada-e2c521d8af5b'],
                  is_in_dominating_set: 'True',
                  label: 'Satyr',
                  pagerank: 0.0009349918817885876,
                  'subtype': 'species',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/satyr-species'}},
        {data: {community_id: 11,
                  id: '8e13fe14-7227-4f32-b110-fd5c10f5e779',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: "Heswe's Ironworks",
                  pagerank: 0.0012943418626949206,
                  'subtype': 'landmark',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/heswe26230393Bs-ironworks-landmark'}},
        {data: {community_id: 0,
                  id: '8ef096c4-bd3b-4baf-be2b-603a2d060754',
                  idoms_from_parent_cats: ['8eb263b4-447c-4fd3-9762-525921bea6a2'],
                  is_in_dominating_set: 'True',
                  label: 'Timothy ',
                  pagerank: 0.0009349918817885876,
                  'subtype': 'person',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/timothy--person'}},
        {data: {community_id: 9,
                  id: '8efc2076-6416-4017-a4ab-a8192013602d',
                  idoms_from_parent_cats: ['f874731e-a939-40df-957d-38e52462bb35',
                                             '03b2cfe3-dad1-4419-b4a3-c02554e4dd6a',
                                             'fa4eb288-df1a-45c6-a922-daaea5c40c49'],
                  is_in_dominating_set: 'True',
                  label: 'Spire of Rest',
                  pagerank: 0.003091516030102346,
                  'subtype': 'location',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/spire-of-rest-location'}},
        {data: {community_id: 3,
                  id: '8f0ed82e-1962-4478-b46e-4f009cf48de4',
                  idoms_from_parent_cats: ['9effb3c5-240e-40c9-af80-db4aad2c8e75'],
                  is_in_dominating_set: 'True',
                  label: 'Shiv',
                  pagerank: 0.001379520561114182,
                  'subtype': 'person',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/shiv-person'}},
        {data: {community_id: 2,
                  id: '8f31407b-4022-4461-8a55-90393bbf7b1e',
                  idoms_from_parent_cats: ['8751cf98-83be-45c4-9b6b-5549391cab1c',
                                             'a3fe07ba-a93f-44f9-bdda-ca84bc2294d0'],
                  is_in_dominating_set: 'True',
                  label: 'Stratus Way',
                  pagerank: 0.0009349918817885876,
                  'subtype': 'ritual',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/stratus-way-ritual'}},
        {data: {community_id: 4,
                  id: '8f955305-f8db-4c06-a068-ea33aee262db',
                  idoms_from_parent_cats: ['f9192b97-2255-48fb-bada-e2c521d8af5b'],
                  is_in_dominating_set: 'True',
                  label: 'Kenku',
                  pagerank: 0.0009349918817885876,
                  'subtype': 'species',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/kenku-species'}},
        {data: {community_id: 6,
                  id: '90fba573-ba57-4d18-bd26-e34f94ea8c4d',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: 'Sorcerous Sundries',
                  pagerank: 0.0011497118311396617,
                  'subtype': 'landmark',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/sorcerous-sundries-landmark'}},
        {data: {community_id: 4,
                  id: '9276d6fd-b3b9-4147-bded-d80e67ac86d7',
                  idoms_from_parent_cats: ['75a3c752-7b80-4bde-a0c3-cdcc1095e4cc',
                                             'f9192b97-2255-48fb-bada-e2c521d8af5b'],
                  is_in_dominating_set: 'True',
                  label: 'Dwarf',
                  pagerank: 0.0009349918817885876,
                  'subtype': 'species',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/dwarf-species'}},
        {data: {community_id: 4,
                  id: '945b5ac2-e24a-49da-8412-20085528a3a9',
                  idoms_from_parent_cats: ['f9192b97-2255-48fb-bada-e2c521d8af5b'],
                  is_in_dominating_set: 'True',
                  label: 'Orc',
                  pagerank: 0.0009349918817885876,
                  'subtype': 'species',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/orc-species'}},
        {data: {community_id: 9,
                  id: '945e2575-3b0a-43ef-b0f3-f5ec68e5016b',
                  idoms_from_parent_cats: ['e382a22d-2331-4e8d-b949-eb75e393fe0b'],
                  is_in_dominating_set: 'True',
                  label: 'Ennat ',
                  pagerank: 0.0009349918817885876,
                  'subtype': 'person',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/ennat--person'}},
        {data: {community_id: 7,
                  id: '95af41b4-5299-4de1-a462-bf07815b2585',
                  idoms_from_parent_cats: ['03bd9d1f-2d7f-40d1-89a2-6f75c85bfe3e',
                                             '18f8185c-5a62-4a36-89f9-b81d39e722f0'],
                  is_in_dominating_set: 'False',
                  label: 'Necromancer Blair',
                  pagerank: 0.001864439740100899,
                  'subtype': 'person',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/necromancer-blair-person'}},
        {data: {community_id: 6,
                  id: '95de6c0b-f1d8-45a4-8319-cf64867b9c5d',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'False',
                  label: 'Brampton District',
                  pagerank: 0.0009680944612862324,
                  'subtype': 'settlement',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/brampton-district-settlement'}},
        {data: {community_id: 6,
                  id: '964609fe-10d0-4eab-af64-5e4a1b6ccc9f',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: 'Counting House',
                  pagerank: 0.001163377973262708,
                  'subtype': 'landmark',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/counting-house-landmark'}},
        {data: {community_id: 2,
                  id: '982f6644-e63c-4967-a185-9a244dc8bbf1',
                  idoms_from_parent_cats: ['a3fe07ba-a93f-44f9-bdda-ca84bc2294d0'],
                  is_in_dominating_set: 'True',
                  label: 'Gem Rail',
                  pagerank: 0.002382800383383824,
                  'subtype': 'vehicle',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/gem-rail-vehicle'}},
        {data: {community_id: 4,
                  id: '9853b7af-c9cb-4f91-955d-553ef49167a9',
                  idoms_from_parent_cats: ['f9192b97-2255-48fb-bada-e2c521d8af5b'],
                  is_in_dominating_set: 'True',
                  label: 'Tiefling',
                  pagerank: 0.0009349918817885876,
                  'subtype': 'species',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/tiefling-species'}},
        {data: {community_id: 1,
                  id: '990626ee-f14f-4151-91c1-44e4047e29ab',
                  idoms_from_parent_cats: ['f9192b97-2255-48fb-bada-e2c521d8af5b',
                                             'a3fe07ba-a93f-44f9-bdda-ca84bc2294d0',
                                             '8eb263b4-447c-4fd3-9762-525921bea6a2',
                                             'f506393a-d938-4114-b2c7-14ecf347a07e',
                                             'c21883ef-edfd-4ced-9057-808f9d756bda',
                                             '18f8185c-5a62-4a36-89f9-b81d39e722f0'],
                  is_in_dominating_set: 'False',
                  label: 'Ch. 1 - A Strange Patron',
                  pagerank: 0.0027977166928874813,
                  'subtype': 'plot',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/ch-1---a-strange-patron-plot'}},
        {data: {community_id: 3,
                  id: '9aeb5db7-6f2f-414f-aa65-7ccaa095da6e',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: "Armorer's Village",
                  pagerank: 0.0010487021209486845,
                  'subtype': 'settlement',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/armorer-s-village-settlement'}},
        {data: {community_id: 11,
                  id: '9b28d784-3a0c-4091-901a-4833c234f421',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: 'The Scoundrel and Flagon',
                  pagerank: 0.0012943418626949206,
                  'subtype': 'landmark',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/the-scoundrel-and-flagon-landmark'}},
        {data: {community_id: 3,
                  id: '9bdbbf36-9c34-427e-a3ea-a451df8216c4',
                  idoms_from_parent_cats: ['c21883ef-edfd-4ced-9057-808f9d756bda'],
                  is_in_dominating_set: 'True',
                  label: 'test character',
                  pagerank: 0.0009349918817885876,
                  'subtype': 'person',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/test-character-person'}},
        {data: {community_id: 0,
                  id: '9be05894-ee61-4f5d-b92a-824165e183fc',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: ' Garynmor Stables and Menagerie',
                  pagerank: 0.0019461748893755389,
                  'subtype': 'landmark',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/-garynmor-stables-and-menagerie-landmark'}},
        {data: {community_id: 1,
                  id: '9c91d612-08c7-482b-a274-6a3208a0d7a5',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: 'Ch. 4 - Taking the Offensive',
                  pagerank: 0.0015797604058954483,
                  'subtype': 'plot',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/ch-4---taking-the-offensive-plot'}},
        {data: {community_id: 6,
                  id: '9e49806a-ef0d-40a3-9490-ebc0e2586024',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: "Garmult's House of Mastery",
                  pagerank: 0.0009680944612862324,
                  'subtype': 'landmark',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/garmult-s-house-of-mastery-landmark'}},
        {data: {community_id: 8,
                  id: '9ec2ffdc-e5f5-494c-91ba-426faf71f090',
                  idoms_from_parent_cats: ['6b406091-f679-49fa-b44e-5f5a134a3705'],
                  is_in_dominating_set: 'True',
                  label: 'The Warring Fist',
                  pagerank: 0.0009349918817885876,
                  'subtype': 'organization',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/the-warring-fist-article'}},
        {data: {community_id: 3,
                  id: 'a068db1b-fb03-402b-a344-9840e65b82a1',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: "Unicorn's Farthing",
                  pagerank: 0.0010487021209486845,
                  'subtype': 'settlement',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/unicorn-s-farthing-settlement'}},
        {data: {community_id: 0,
                  id: 'a1202d49-589b-4bfc-ae6c-f109fff5cbcb',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'False',
                  label: 'Manorborn District',
                  pagerank: 0.0010688924499243047,
                  'subtype': 'settlement',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/manorborn-district-settlement'}},
        {data: {community_id: 9,
                  id: 'a1440768-7630-4a63-8d6a-42afb36b9dc9',
                  idoms_from_parent_cats: ['c396b18c-aa26-4578-81e7-8bf2c0419332'],
                  is_in_dominating_set: 'True',
                  label: 'Mumbost ',
                  pagerank: 0.0009349918817885876,
                  'subtype': 'person',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/mumbost--person'}},
        {data: {community_id: 8,
                  id: 'a21a8f12-6642-4ba0-a13a-8d787f461310',
                  idoms_from_parent_cats: ['14d0c9e7-2cbf-4857-acd3-0f69394403fc'],
                  is_in_dominating_set: 'True',
                  label: 'Bulwark of Myndra',
                  pagerank: 0.0009349918817885876,
                  'subtype': 'organization',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/bulwark-of-myndra-article'}},
        {data: {community_id: 4,
                  id: 'a24e22fe-78f1-4693-8d28-db9e269a803b',
                  idoms_from_parent_cats: ['f9192b97-2255-48fb-bada-e2c521d8af5b'],
                  is_in_dominating_set: 'True',
                  label: 'Halfling',
                  pagerank: 0.0009349918817885876,
                  'subtype': 'species',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/halfling-species'}},
        {data: {community_id: 6,
                  id: 'a2b5d90c-cc68-4376-94c7-82b7361b1ab3',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'False',
                  label: 'Cliffgate',
                  pagerank: 0.0009680944612862324,
                  'subtype': 'landmark',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/cliffgate-landmark'}},
        {data: {community_id: 1,
                  id: 'a4496372-ab05-4892-afc7-a223f02b34cf',
                  idoms_from_parent_cats: ['f9192b97-2255-48fb-bada-e2c521d8af5b',
                                             'a3fe07ba-a93f-44f9-bdda-ca84bc2294d0',
                                             '8eb263b4-447c-4fd3-9762-525921bea6a2',
                                             'f506393a-d938-4114-b2c7-14ecf347a07e',
                                             'c21883ef-edfd-4ced-9057-808f9d756bda',
                                             '18f8185c-5a62-4a36-89f9-b81d39e722f0'],
                  is_in_dominating_set: 'True',
                  label: 'Session 4: Deeper into the Goblin’s Hole Report',
                  pagerank: 0.0009349918817885876,
                  'subtype': 'report',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/session-43A-deeper-into-the-goblinE28099s-hole-report-report'}},
        {data: {community_id: 11,
                  id: 'a5e8c4a6-7014-4162-aa56-350c22c971df',
                  idoms_from_parent_cats: ['c67fe0ec-25dd-425a-ac37-af10a4d80463',
                                             'a3fe07ba-a93f-44f9-bdda-ca84bc2294d0'],
                  is_in_dominating_set: 'True',
                  label: "Water's Mercy",
                  pagerank: 0.002257424946602201,
                  'subtype': 'organization',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/water-s-mercy-organization'}},
        {data: {community_id: 13,
                  id: 'a6cc845f-f349-4b2b-81f7-999502799889',
                  idoms_from_parent_cats: ['f08ade4a-6087-4f41-8666-b2a4c0da24b9'],
                  is_in_dominating_set: 'True',
                  label: 'Categorization Practices',
                  pagerank: 0.0009349918817885876,
                  'subtype': 'article',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/categorization-practices-article'}},
        {data: {community_id: 4,
                  id: 'a6db2c99-7673-4e92-92de-cd59063692bb',
                  idoms_from_parent_cats: ['f9192b97-2255-48fb-bada-e2c521d8af5b'],
                  is_in_dominating_set: 'True',
                  label: 'Yuan-Ti Pureblood',
                  pagerank: 0.0009349918817885876,
                  'subtype': 'species',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/yuan-ti-pureblood-species'}},
        {data: {community_id: 0,
                  id: 'a81d9b3a-aa5c-4d0e-97d8-259acdf5b281',
                  idoms_from_parent_cats: ['6889ca60-afdc-4a7f-b68f-a5e3aeb6e13c'],
                  is_in_dominating_set: 'True',
                  label: 'Andrew Isim',
                  pagerank: 0.0022957883051090795,
                  'subtype': 'person',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/andrew-isim-person'}},
        {data: {community_id: 5,
                  id: 'a87c0eec-fe3e-4481-a45f-5afa40a3fc8a',
                  idoms_from_parent_cats: ['a08595d9-a022-4b2e-8c33-7262a4a11f82'],
                  is_in_dominating_set: 'True',
                  label: 'The Great Rabbit Tossing of Faerland',
                  pagerank: 0.0009349918817885876,
                  'subtype': 'militaryConflict',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/the-great-rabbit-tossing-of-faerland-militaryConflict'}},
        {data: {community_id: 7,
                  id: 'aacf2b9c-a181-4dc5-afa3-a72f3004c306',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: 'The Knave and Flagon',
                  pagerank: 0.0010939629604200135,
                  'subtype': 'landmark',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/the-knave-and-flagon-landmark'}},
        {data: {community_id: 2,
                  id: 'ab2b0a90-94c1-4ff2-82fb-4fe1517426fa',
                  idoms_from_parent_cats: ['3a3556dd-1064-464d-845e-cc49535964a1'],
                  is_in_dominating_set: 'True',
                  label: 'The Zhentarim',
                  pagerank: 0.0009349918817885876,
                  'subtype': 'organization',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/the-zhentarim-organization'}},
        {data: {community_id: 6,
                  id: 'ac675942-cd60-4434-85bf-73453c95562b',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: "Water Queen's House",
                  pagerank: 0.0009680944612862324,
                  'subtype': 'landmark',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/water-queen-s-house-landmark'}},
        {data: {community_id: 5,
                  id: 'acf69050-78bc-4f79-844f-21575284bfb7',
                  idoms_from_parent_cats: ['ae6a32a1-8424-45b3-9824-17702db8d62f'],
                  is_in_dominating_set: 'True',
                  label: 'Oberom Station',
                  pagerank: 0.0009349918817885876,
                  'subtype': 'settlement',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/oberom-station-settlement'}},
        {data: {community_id: 4,
                  id: 'ad3ebc68-9c24-412a-b505-142eb9795158',
                  idoms_from_parent_cats: ['f9192b97-2255-48fb-bada-e2c521d8af5b'],
                  is_in_dominating_set: 'True',
                  label: 'Lizardfolk',
                  pagerank: 0.0009349918817885876,
                  'subtype': 'species',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/lizardfolk-species'}},
        {data: {community_id: 0,
                  id: 'ae3d1d8e-f1dc-4afb-b4c6-179818e9e8d7',
                  idoms_from_parent_cats: ['8eb263b4-447c-4fd3-9762-525921bea6a2'],
                  is_in_dominating_set: 'True',
                  label: 'Utav Kimar',
                  pagerank: 0.0009349918817885876,
                  'subtype': 'person',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/'}},
        {data: {community_id: 0,
                  id: 'b04727ad-eee7-4297-bbbe-c6dbda13da16',
                  idoms_from_parent_cats: ['8eb263b4-447c-4fd3-9762-525921bea6a2'],
                  is_in_dominating_set: 'True',
                  label: 'Rollin Snowden',
                  pagerank: 0.0009349918817885876,
                  'subtype': 'person',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/rollin-snowden-person'}},
        {data: {community_id: 4,
                  id: 'b2d5c132-93ec-4480-a03a-0b48a5c45759',
                  idoms_from_parent_cats: ['f9192b97-2255-48fb-bada-e2c521d8af5b'],
                  is_in_dominating_set: 'True',
                  label: 'Centaur',
                  pagerank: 0.0009349918817885876,
                  'subtype': 'species',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/centaur-species'}},
        {data: {community_id: 0,
                  id: 'b30c4d77-93b3-4fd8-9b97-1ce0ed588681',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'False',
                  label: 'Three Old Kegs',
                  pagerank: 0.0009782104744859945,
                  'subtype': 'landmark',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/three-old-kegs-landmark'}},
        {data: {community_id: 3,
                  id: 'b427eb80-c835-4093-af53-e1dea6664ba7',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: "The Ranger's Guild of Gildila Guildhall",
                  pagerank: 0.00132782158019153,
                  'subtype': 'landmark',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/the-ranger-s-guild-of-gildila-guildhall-landmark'}},
        {data: {community_id: 8,
                  id: 'b4ad62f4-9deb-4746-86a8-5faa87e78da5',
                  idoms_from_parent_cats: ['74102638-9ae6-4676-9fc2-989e431a6aad'],
                  is_in_dominating_set: 'False',
                  label: "Nature's Audience",
                  pagerank: 0.0010939629604200135,
                  'subtype': 'organization',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/nature-s-audience-article'}},
        {data: {community_id: 8,
                  id: 'b4cbcfbd-f487-4ecc-9e85-e89b9fd3b1f1',
                  idoms_from_parent_cats: ['ed3d1db3-6227-410c-a0da-72cb852c254e'],
                  is_in_dominating_set: 'True',
                  label: 'The Church of the Silver Flame',
                  pagerank: 0.0010939629604200135,
                  'subtype': 'organization',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/the-church-of-the-silver-flame-article'}},
        {data: {community_id: 4,
                  id: 'b6bce107-268a-45c9-b326-86140e5c76e0',
                  idoms_from_parent_cats: ['f9192b97-2255-48fb-bada-e2c521d8af5b'],
                  is_in_dominating_set: 'True',
                  label: 'Tortle',
                  pagerank: 0.0009349918817885876,
                  'subtype': 'species',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/tortle-species'}},
        {data: {community_id: 4,
                  id: 'b7b66633-ebf3-4a03-b501-8c257326c26d',
                  idoms_from_parent_cats: ['f9192b97-2255-48fb-bada-e2c521d8af5b'],
                  is_in_dominating_set: 'True',
                  label: 'Aasimar',
                  pagerank: 0.0009349918817885876,
                  'subtype': 'species',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/aasimar-species'}},
        {data: {community_id: 7,
                  id: 'b84dd58b-51e0-424a-b2e6-cdf391f3eb48',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'False',
                  label: 'The Guildhall of Wadun',
                  pagerank: 0.0010939629604200135,
                  'subtype': 'landmark',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/the-guildhall-of-wadun-landmark'}},
        {data: {community_id: 4,
                  id: 'b8692be0-0d7f-4077-bcb1-3178758a6991',
                  idoms_from_parent_cats: ['f9192b97-2255-48fb-bada-e2c521d8af5b'],
                  is_in_dominating_set: 'True',
                  label: 'Gith',
                  pagerank: 0.0009349918817885876,
                  'subtype': 'species',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/gith-species'}},
        {data: {community_id: 6,
                  id: 'b8cc45b6-90fc-49f4-9b3a-605ff010ca35',
                  idoms_from_parent_cats: ['d88f42c4-d3bb-4118-b7c1-5cc59cf296e7'],
                  is_in_dominating_set: 'False',
                  label: 'Insight Park',
                  pagerank: 0.0009680944612862324,
                  'subtype': 'landmark',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/insight-park-landmark'}},
        {data: {community_id: 4,
                  id: 'b95f6ab7-eaee-4864-8098-38086493fa03',
                  idoms_from_parent_cats: ['f9192b97-2255-48fb-bada-e2c521d8af5b'],
                  is_in_dominating_set: 'True',
                  label: 'Kobold',
                  pagerank: 0.0009349918817885876,
                  'subtype': 'species',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/kobold-species'}},
        {data: {community_id: 0,
                  id: 'bc7d7701-5fe4-4204-b8c7-094eaf73a793',
                  idoms_from_parent_cats: ['8eb263b4-447c-4fd3-9762-525921bea6a2'],
                  is_in_dominating_set: 'True',
                  label: 'Fairwald ',
                  pagerank: 0.0009349918817885876,
                  'subtype': 'person',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/fairwald--person'}},
        {data: {community_id: 4,
                  id: 'bd3ec55b-4bf6-445b-b610-dafc64706ed1',
                  idoms_from_parent_cats: ['f9192b97-2255-48fb-bada-e2c521d8af5b'],
                  is_in_dominating_set: 'True',
                  label: 'Genasi',
                  pagerank: 0.0009349918817885876,
                  'subtype': 'species',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/genasi-species'}},
        {data: {community_id: 6,
                  id: 'bdee66ef-09ef-4721-b764-49c64607075a',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: 'Seskergates',
                  pagerank: 0.0009680944612862324,
                  'subtype': 'landmark',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/seskergates-landmark'}},
        {data: {community_id: 6,
                  id: 'bece8fcf-dbc7-4650-93e9-50a6b5b45bbc',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'False',
                  label: 'Seatower of Balduran',
                  pagerank: 0.0009680944612862324,
                  'subtype': 'landmark',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/seatower-of-balduran-landmark'}},
        {data: {community_id: 6,
                  id: 'bf43c6b9-ef1b-425b-a23e-ceba0388be2b',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'False',
                  label: "Baldur's Mouth",
                  pagerank: 0.0009680944612862324,
                  'subtype': 'landmark',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/baldur-s-mouth-landmark'}},
        {data: {community_id: 5,
                  id: 'bf6e94a2-6a35-4c82-b6ad-e3f8777ecd90',
                  idoms_from_parent_cats: ['06bbb2e8-d9c4-4939-9503-986f0eae1ce1'],
                  is_in_dominating_set: 'True',
                  label: 'Dusthawk Hill',
                  pagerank: 0.0009349918817885876,
                  'subtype': 'landmark',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/dusthawk-hill-landmark'}},
        {data: {community_id: 8,
                  id: 'bf8850c4-c460-4538-950b-0c0b15b9cfb1',
                  idoms_from_parent_cats: ['3dc3c37e-b7f3-4f4b-8318-305068032941'],
                  is_in_dominating_set: 'True',
                  label: 'Dwarven Pantheon',
                  pagerank: 0.0009349918817885876,
                  'subtype': 'organization',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/dwarven-pantheon-organization'}},
        {data: {community_id: 1,
                  id: 'c122c8ad-d13e-43c1-a69c-7a0b67512b2c',
                  idoms_from_parent_cats: ['f9192b97-2255-48fb-bada-e2c521d8af5b',
                                             'a3fe07ba-a93f-44f9-bdda-ca84bc2294d0',
                                             '8eb263b4-447c-4fd3-9762-525921bea6a2',
                                             'f506393a-d938-4114-b2c7-14ecf347a07e',
                                             'c21883ef-edfd-4ced-9057-808f9d756bda',
                                             '18f8185c-5a62-4a36-89f9-b81d39e722f0'],
                  is_in_dominating_set: 'False',
                  label: 'Rondle Ploye',
                  pagerank: 0.002366550743186595,
                  'subtype': 'person',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/rondle-ploye-person'}},
        {data: {community_id: 0,
                  id: 'c1955421-8cf1-466c-9885-3dbd0276f8f6',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'False',
                  label: 'Hall of The Night',
                  pagerank: 0.0009782104744859945,
                  'subtype': 'landmark',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/hall-of-the-night-landmark'}},
        {data: {community_id: 0,
                  id: 'c3c27f86-0d67-47aa-b0db-72ee5ad66793',
                  idoms_from_parent_cats: ['8eb263b4-447c-4fd3-9762-525921bea6a2',
                                             '7193e1e0-d071-4bc2-a04c-70f0e45a7ae0'],
                  is_in_dominating_set: 'True',
                  label: 'Kuble',
                  pagerank: 0.001025673857226898,
                  'subtype': 'person',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/kuble-person'}},
        {data: {community_id: 6,
                  id: 'c658499e-b00c-453f-947b-2defcc6a5507',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: 'Harborside Hospital',
                  pagerank: 0.0012059430305458242,
                  'subtype': 'landmark',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/harborside-hospital-landmark'}},
        {data: {community_id: 11,
                  id: 'c67fe0ec-25dd-425a-ac37-af10a4d80463',
                  idoms_from_parent_cats: ['da085a72-69a2-4fc2-b6ad-f13a28275daa',
                                             'a3fe07ba-a93f-44f9-bdda-ca84bc2294d0',
                                             'f9192b97-2255-48fb-bada-e2c521d8af5b'],
                  is_in_dominating_set: 'False',
                  label: 'Elf',
                  pagerank: 0.0014385724306828663,
                  'subtype': 'species',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/elf-species'}},
        {data: {community_id: 6,
                  id: 'c68218e0-2a7c-440c-859e-5ff89bd0f13a',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'False',
                  label: "Felogyr's Fireworks",
                  pagerank: 0.0009680944612862324,
                  'subtype': 'landmark',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/felogyr-s-fireworks-landmark'}},
        {data: {community_id: 3,
                  id: 'c6f5f652-7adb-4a86-a890-0df99a657de2',
                  idoms_from_parent_cats: ['014be81e-265e-48c3-9e5d-2d6fe0d68158',
                                             'a3fe07ba-a93f-44f9-bdda-ca84bc2294d0'],
                  is_in_dominating_set: 'True',
                  label: 'Declan Harrison',
                  pagerank: 0.0015517148942182908,
                  'subtype': 'person',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/declan-harrison-person'}},
        {data: {community_id: 1,
                  id: 'c8bc376f-6e07-42c2-8abd-47ac965b62ba',
                  idoms_from_parent_cats: ['309b7567-01ed-4a3f-b2de-b6503a40e00a'],
                  is_in_dominating_set: 'False',
                  label: 'Calamity',
                  pagerank: 0.0026006211094100973,
                  'subtype': 'person',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/calamity-person'}},
        {data: {community_id: 0,
                  id: 'caa680a1-8f67-419a-a288-a047c9819749',
                  idoms_from_parent_cats: ['2a0c4087-0a56-4d77-8851-6d6d58be6159',
                                             '18f8185c-5a62-4a36-89f9-b81d39e722f0'],
                  is_in_dominating_set: 'True',
                  label: 'Outer City',
                  pagerank: 0.001116609251642017,
                  'subtype': 'settlement',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/outer-city-settlement'}},
        {data: {community_id: 0,
                  id: 'cb7cf108-f6a5-48a9-b9b1-37ae64f396a1',
                  idoms_from_parent_cats: ['d88f42c4-d3bb-4118-b7c1-5cc59cf296e7',
                                             'a3fe07ba-a93f-44f9-bdda-ca84bc2294d0'],
                  is_in_dominating_set: 'True',
                  label: 'Ch. 1b - The Tower New Tenant',
                  pagerank: 0.003049953644050177,
                  'subtype': 'plot',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/ch-1b---the-tower-new-tenant-article'}},
        {data: {community_id: 4,
                  id: 'cb976839-8c60-4b60-aadd-8a03c469644f',
                  idoms_from_parent_cats: ['f9192b97-2255-48fb-bada-e2c521d8af5b'],
                  is_in_dominating_set: 'True',
                  label: 'Half-orc',
                  pagerank: 0.0009349918817885876,
                  'subtype': 'species',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/half-orc-species'}},
        {data: {community_id: 3,
                  id: 'cdb8881e-1799-4640-a1d5-0e510f155adc',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: 'Archbell Ward',
                  pagerank: 0.0010487021209486845,
                  'subtype': 'settlement',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/archbell-ward-settlement'}},
        {data: {community_id: 7,
                  id: 'cdf853ea-0f2b-4a67-8de2-001d3f34c264',
                  idoms_from_parent_cats: ['2193f2f1-0c22-4ff9-bb43-5b100df458df'],
                  is_in_dominating_set: 'False',
                  label: 'Cilia',
                  pagerank: 0.0010939629604200135,
                  'subtype': 'person',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/cilia-person'}},
        {data: {community_id: 8,
                  id: 'd0db8d27-0c78-486f-ab96-1243baa12de3',
                  idoms_from_parent_cats: ['44c03cd5-51bf-436d-8fe3-1cfb6d5caec4',
                                             'a3fe07ba-a93f-44f9-bdda-ca84bc2294d0'],
                  is_in_dominating_set: 'True',
                  label: 'Human Pantheon',
                  pagerank: 0.0009349918817885876,
                  'subtype': 'organization',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/human-pantheon-organization'}},
        {data: {community_id: 0,
                  id: 'd1551235-1ba4-47e1-a46e-ee6be7099aed',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'False',
                  label: 'Citadel Streets',
                  pagerank: 0.0009782104744859945,
                  'subtype': 'settlement',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/citadel-streets-settlement'}},
        {data: {community_id: 4,
                  id: 'd17d9ff7-cbe0-449a-b0c8-283f14edb2eb',
                  idoms_from_parent_cats: ['f9192b97-2255-48fb-bada-e2c521d8af5b'],
                  is_in_dominating_set: 'True',
                  label: 'Triton',
                  pagerank: 0.0009349918817885876,
                  'subtype': 'species',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/triton-species'}},
        {data: {community_id: 0,
                  id: 'd1a46816-ff9f-49b1-a4d5-fdd4c241beb1',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'False',
                  label: 'Garynmor Stables',
                  pagerank: 0.002127792259228969,
                  'subtype': 'landmark',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/garynmor-stables-landmark'}},
        {data: {community_id: 3,
                  id: 'd1d68768-7675-47ed-ae4d-74c3033aa8f5',
                  idoms_from_parent_cats: ['014be81e-265e-48c3-9e5d-2d6fe0d68158'],
                  is_in_dominating_set: 'True',
                  label: 'Greder',
                  pagerank: 0.0009349918817885876,
                  'subtype': 'person',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/greder-person'}},
        {data: {community_id: 0,
                  id: 'd33e9076-67ee-4000-95ab-0434a405dd9d',
                  idoms_from_parent_cats: ['8751cf98-83be-45c4-9b6b-5549391cab1c'],
                  is_in_dominating_set: 'True',
                  label: 'Boys-to-Men Academy for Fighters',
                  pagerank: 0.0014441184468216317,
                  'subtype': 'organization',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/boys-to-men-academy-for-fighters-organization'}},
        {data: {community_id: 3,
                  id: 'd36bcf4f-d5d7-416f-a5c0-5a7984a13e04',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: 'Heath District',
                  pagerank: 0.0010487021209486845,
                  'subtype': 'settlement',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/heath-district-settlement'}},
        {data: {community_id: 9,
                  id: 'd3760408-517f-4395-880f-cc60e176213d',
                  idoms_from_parent_cats: ['f874731e-a939-40df-957d-38e52462bb35',
                                             '03b2cfe3-dad1-4419-b4a3-c02554e4dd6a',
                                             'fa4eb288-df1a-45c6-a922-daaea5c40c49'],
                  is_in_dominating_set: 'True',
                  label: 'Tommas Tankar',
                  pagerank: 0.0024381056879864624,
                  'subtype': 'person',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/tommas-tankar--person'}},
        {data: {community_id: 10,
                  id: 'd4669512-ed33-4a63-b454-8bb6687db48f',
                  idoms_from_parent_cats: ['25837647-b2ea-4bad-8b98-33015e65466a'],
                  is_in_dominating_set: 'True',
                  label: 'Homebrew Rules',
                  pagerank: 0.0009349918817885876,
                  'subtype': 'article',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/homebrew-rules-article'}},
        {data: {community_id: 6,
                  id: 'd4cbd322-f091-494e-bc0a-aab68e8c7a01',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'False',
                  label: 'Eastway Expeditions',
                  pagerank: 0.0009680944612862324,
                  'subtype': 'landmark',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/eastway-expeditions-landmark'}},
        {data: {community_id: 4,
                  id: 'd7387748-08a5-4fb3-95c5-9a1ac90ee689',
                  idoms_from_parent_cats: ['f9192b97-2255-48fb-bada-e2c521d8af5b'],
                  is_in_dominating_set: 'True',
                  label: 'Loxodon',
                  pagerank: 0.0009349918817885876,
                  'subtype': 'species',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/loxodon-species'}},
        {data: {community_id: 1,
                  id: 'd7deccc7-19aa-4ce9-bb82-e3caafc8159e',
                  idoms_from_parent_cats: ['f9192b97-2255-48fb-bada-e2c521d8af5b',
                                             'a3fe07ba-a93f-44f9-bdda-ca84bc2294d0',
                                             '8eb263b4-447c-4fd3-9762-525921bea6a2',
                                             'f506393a-d938-4114-b2c7-14ecf347a07e',
                                             'c21883ef-edfd-4ced-9057-808f9d756bda',
                                             '18f8185c-5a62-4a36-89f9-b81d39e722f0'],
                  is_in_dominating_set: 'False',
                  label: "The Night Mother's Unkindness",
                  pagerank: 0.006692390063640766,
                  'subtype': 'organization',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/the-night-mother-s-unkindness-organization'}},
        {data: {community_id: 0,
                  id: 'd88f42c4-d3bb-4118-b7c1-5cc59cf296e7',
                  idoms_from_parent_cats: ['f9192b97-2255-48fb-bada-e2c521d8af5b',
                                             'a3fe07ba-a93f-44f9-bdda-ca84bc2294d0',
                                             '8eb263b4-447c-4fd3-9762-525921bea6a2',
                                             'f506393a-d938-4114-b2c7-14ecf347a07e',
                                             'c21883ef-edfd-4ced-9057-808f9d756bda',
                                             '18f8185c-5a62-4a36-89f9-b81d39e722f0'],
                  is_in_dominating_set: 'False',
                  label: "Baldur's Gate",
                  pagerank: 0.005769003171441246,
                  'subtype': 'settlement',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/baldur-s-gate-settlement'}},
        {data: {community_id: 0,
                  id: 'd8bf8b7d-51e2-45d7-bd63-fe55c3cd5b91',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'False',
                  label: "Kuble's Gems and Gem Cutting",
                  pagerank: 0.001159574425362615,
                  'subtype': 'landmark',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/kuble-s-gems-and-gem-cutting-landmark'}},
        {data: {community_id: 2,
                  id: 'd8dba4f4-27e5-403a-a821-185b2dfce22e',
                  idoms_from_parent_cats: ['95008541-1608-41d1-bbcc-c770e07d27a4'],
                  is_in_dominating_set: 'True',
                  label: 'The Harpers',
                  pagerank: 0.0009349918817885876,
                  'subtype': 'organization',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/the-harpers-organization'}},
        {data: {community_id: 2,
                  id: 'd9d9a36a-5ab4-4e05-b603-65a53f6f6e39',
                  idoms_from_parent_cats: ['a3fe07ba-a93f-44f9-bdda-ca84bc2294d0'],
                  is_in_dominating_set: 'False',
                  label: 'The Spanners',
                  pagerank: 0.002555619146568707,
                  'subtype': 'organization',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/the-spanners-organization'}},
        {data: {community_id: 11,
                  id: 'da085a72-69a2-4fc2-b6ad-f13a28275daa',
                  idoms_from_parent_cats: ['2ae7db37-a3dd-4e5d-b033-d37c7ad1b971',
                                             '18f8185c-5a62-4a36-89f9-b81d39e722f0'],
                  is_in_dominating_set: 'True',
                  label: 'Giles',
                  pagerank: 0.0014802752335144195,
                  'subtype': 'person',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/giles-person'}},
        {data: {community_id: 1,
                  id: 'da201481-a2dc-4263-899b-e7eece4f09c5',
                  idoms_from_parent_cats: ['a3fe07ba-a93f-44f9-bdda-ca84bc2294d0',
                                             'd7deccc7-19aa-4ce9-bb82-e3caafc8159e'],
                  is_in_dominating_set: 'True',
                  label: 'Master Corvus',
                  pagerank: 0.0009349918817885876,
                  'subtype': 'rank',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/master-corvus-rank'}},
        {data: {community_id: 4,
                  id: 'daafc048-34c6-43b5-afc6-c012cf0dee3f',
                  idoms_from_parent_cats: ['f9192b97-2255-48fb-bada-e2c521d8af5b'],
                  is_in_dominating_set: 'True',
                  label: 'Goblin',
                  pagerank: 0.0009349918817885876,
                  'subtype': 'species',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/goblin-species'}},
        {data: {community_id: 3,
                  id: 'dc7e89c1-b92b-4a7b-88bd-a4a27867c44f',
                  idoms_from_parent_cats: ['c6f5f652-7adb-4a86-a890-0df99a657de2',
                                             'a3fe07ba-a93f-44f9-bdda-ca84bc2294d0'],
                  is_in_dominating_set: 'False',
                  label: 'The Rangers Guild of Gildila',
                  pagerank: 0.0015567450310714937,
                  'subtype': 'organization',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/the-rangers-guild-of-gildila-article'}},
        {data: {community_id: 4,
                  id: 'dcc84f10-72e0-482d-be60-f244abe97c89',
                  idoms_from_parent_cats: ['f9192b97-2255-48fb-bada-e2c521d8af5b'],
                  is_in_dominating_set: 'True',
                  label: 'Leonin',
                  pagerank: 0.0009349918817885876,
                  'subtype': 'species',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/leonin-species'}},
        {data: {community_id: 0,
                  id: 'dee18e15-3b52-4310-8767-4d93f3a8ddb3',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'False',
                  label: 'Heap Gate',
                  pagerank: 0.0009782104744859945,
                  'subtype': 'landmark',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/heap-gate-landmark'}},
        {data: {community_id: 0,
                  id: 'dffd9a85-06b6-43fd-a4e0-bf30f1c4e7d9',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'False',
                  label: "Wyrm's Crossing",
                  pagerank: 0.001189618426699998,
                  'subtype': 'settlement',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/wyrm-s-crossing-settlement'}},
        {data: {community_id: 1,
                  id: 'e0bba579-dd5a-45fa-b3e5-d2a90077fa1b',
                  idoms_from_parent_cats: ['f9192b97-2255-48fb-bada-e2c521d8af5b',
                                             'a3fe07ba-a93f-44f9-bdda-ca84bc2294d0',
                                             '8eb263b4-447c-4fd3-9762-525921bea6a2',
                                             'f506393a-d938-4114-b2c7-14ecf347a07e',
                                             'c21883ef-edfd-4ced-9057-808f9d756bda',
                                             '18f8185c-5a62-4a36-89f9-b81d39e722f0'],
                  is_in_dominating_set: 'True',
                  label: "Ronen'dal, Strength of the Night Mother",
                  pagerank: 0.0031613795238330617,
                  'subtype': 'person',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/ronen-dal2C-strength-of-the-night-mother-person-1'}},
        {data: {community_id: 9,
                  id: 'e113bba6-43bf-486d-a8fa-5017745e7af9',
                  idoms_from_parent_cats: ['68574ff8-cfeb-4433-abb7-1603d9a86fb6',
                                             '03b2cfe3-dad1-4419-b4a3-c02554e4dd6a',
                                             'fa4eb288-df1a-45c6-a922-daaea5c40c49'],
                  is_in_dominating_set: 'True',
                  label: 'Session 2: Facing Death Report',
                  pagerank: 0.0025313075401725386,
                  'subtype': 'report',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/session-23A-facing-death-report-report'}},
        {data: {community_id: 2,
                  id: 'e12cc565-6b06-4844-acc4-fa266c64b704',
                  idoms_from_parent_cats: ['8eb263b4-447c-4fd3-9762-525921bea6a2'],
                  is_in_dominating_set: 'False',
                  label: 'Torven Hammerfell',
                  pagerank: 0.0013882391006591734,
                  'subtype': 'person',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/torven-hammerfell-person'}},
        {data: {community_id: 9,
                  id: 'e144000c-eeca-4c6d-9644-470666441016',
                  idoms_from_parent_cats: ['e382a22d-2331-4e8d-b949-eb75e393fe0b'],
                  is_in_dominating_set: 'True',
                  label: 'The Underling',
                  pagerank: 0.0009349918817885876,
                  'subtype': 'article',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/the-underling-article'}},
        {data: {community_id: 5,
                  id: 'e17afbee-7c39-4e86-aaf7-d7acde5544f5',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: "A Contributor's Guide to The Leyden Nexus WorldAnvil",
                  pagerank: 0.0011493203204284736,
                  'subtype': 'article',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/a-contributor-s-guide-to-the-leyden-nexus-worldanvil-article'}},
        {data: {community_id: 0,
                  id: 'e1cc2fdd-2fae-4818-8222-49a280e888c6',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'False',
                  label: 'Temples District',
                  pagerank: 0.0009782104744859945,
                  'subtype': 'settlement',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/temples-district-settlement'}},
        {data: {community_id: 4,
                  id: 'e39f6124-f00d-4a6e-b1d9-35490cdf724b',
                  idoms_from_parent_cats: ['f9192b97-2255-48fb-bada-e2c521d8af5b'],
                  is_in_dominating_set: 'True',
                  label: 'Minotaur',
                  pagerank: 0.0009349918817885876,
                  'subtype': 'species',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/minotaur-species'}},
        {data: {community_id: 9,
                  id: 'e467091b-7493-4db0-a8c8-e2a27f41657f',
                  idoms_from_parent_cats: ['fa4eb288-df1a-45c6-a922-daaea5c40c49'],
                  is_in_dominating_set: 'True',
                  label: 'Rise of the Necronamcer',
                  pagerank: 0.0009349918817885876,
                  'subtype': 'plot',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/rise-of-the-necronamcer-plot'}},
        {data: {community_id: 1,
                  id: 'e4e7abc6-1766-4c75-a7ef-3505b43f0322',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: "Ch. 5 - The Summit of Dawn's Embrace",
                  pagerank: 0.0015797604058954483,
                  'subtype': 'plot',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/ch-5---the-summit-of-dawn-s-embrace-plot'}},
        {data: {community_id: 1,
                  id: 'e5e71cca-dfd2-4592-92d8-8ecf8ed9763d',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: 'Ch. 1a - A Chosen’s Restrictions',
                  pagerank: 0.0012321729031021422,
                  'subtype': 'plot',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/ch-1a---a-chosenE28099s-restrictions-plot'}},
        {data: {community_id: 0,
                  id: 'e64ef54e-4ba3-4e19-ba00-7fc93be4acae',
                  idoms_from_parent_cats: ['f9192b97-2255-48fb-bada-e2c521d8af5b',
                                             'a3fe07ba-a93f-44f9-bdda-ca84bc2294d0',
                                             '8eb263b4-447c-4fd3-9762-525921bea6a2',
                                             'f506393a-d938-4114-b2c7-14ecf347a07e',
                                             'c21883ef-edfd-4ced-9057-808f9d756bda',
                                             '18f8185c-5a62-4a36-89f9-b81d39e722f0'],
                  is_in_dominating_set: 'False',
                  label: 'Baldurian Purse Master',
                  pagerank: 0.001707021380341848,
                  'subtype': 'rank',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/baldurian-purse-master-rank'}},
        {data: {community_id: 10,
                  id: 'e6765349-cbe8-41a0-b16a-ce17e90f00b6',
                  idoms_from_parent_cats: ['25837647-b2ea-4bad-8b98-33015e65466a'],
                  is_in_dominating_set: 'True',
                  label: 'Awarding Experience',
                  pagerank: 0.0009349918817885876,
                  'subtype': 'article',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/awarding-experience-article'}},
        {data: {community_id: 3,
                  id: 'e79ea4dd-8556-446d-9086-475175c9af8e',
                  idoms_from_parent_cats: ['547a902c-1d91-4f6f-abfa-a527ccefa930',
                                             'f9192b97-2255-48fb-bada-e2c521d8af5b'],
                  is_in_dominating_set: 'True',
                  label: 'Shifter',
                  pagerank: 0.0019445685674580706,
                  'subtype': 'species',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/shifter-species'}},
        {data: {community_id: 0,
                  id: 'e8525532-1fdb-411f-a62e-db4cbf68cec4',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: 'Little Calimshan',
                  pagerank: 0.001189618426699998,
                  'subtype': 'settlement',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/little-calimshan-settlement'}},
        {data: {community_id: 1,
                  id: 'e8648ce2-c8d0-4e9e-bb44-50d6b7983965',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'False',
                  label: 'Ch. 3a - Commune with the Night Mother',
                  pagerank: 0.001830114443545032,
                  'subtype': 'plot',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/ch-3a---commune-with-the-night-mother-plot'}},
        {data: {community_id: 1,
                  id: 'e9d17a68-3295-47f3-a339-2246963f42e6',
                  idoms_from_parent_cats: ['f9192b97-2255-48fb-bada-e2c521d8af5b',
                                             'a3fe07ba-a93f-44f9-bdda-ca84bc2294d0',
                                             '8eb263b4-447c-4fd3-9762-525921bea6a2',
                                             'f506393a-d938-4114-b2c7-14ecf347a07e',
                                             'c21883ef-edfd-4ced-9057-808f9d756bda',
                                             '18f8185c-5a62-4a36-89f9-b81d39e722f0'],
                  is_in_dominating_set: 'False',
                  label: 'Moro',
                  pagerank: 0.0024427886732625546,
                  'subtype': 'person',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/moro-person'}},
        {data: {community_id: 0,
                  id: 'ea83a4c9-97e9-467a-8b3d-388bbdd94c42',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'False',
                  label: 'Stonyeyes',
                  pagerank: 0.001189618426699998,
                  'subtype': 'settlement',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/stonyeyes-settlement'}},
        {data: {community_id: 0,
                  id: 'ebc3408a-149c-4824-b7db-0a05802c343a',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'False',
                  label: 'Oasis Theater',
                  pagerank: 0.0019461748893755389,
                  'subtype': 'landmark',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/oasis-theater-landmark'}},
        {data: {community_id: 0,
                  id: 'ec6d2d72-a177-421e-b0ed-0b9440b52cf5',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'False',
                  label: 'Gond Gate',
                  pagerank: 0.0009782104744859945,
                  'subtype': 'landmark',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/gond-gate-landmark'}},
        {data: {community_id: 5,
                  id: 'ec7f10bb-6242-4f93-aaad-24f9dcc62ef1',
                  idoms_from_parent_cats: ['8a9f53bc-114f-4f41-9eb6-4ccb5d104921'],
                  is_in_dominating_set: 'False',
                  label: "Maalen'ar",
                  pagerank: 0.0015863278906752634,
                  'subtype': 'location',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/maalen-ar-article'}},
        {data: {community_id: 2,
                  id: 'ed0d3731-1686-410b-9808-1190b45173af',
                  idoms_from_parent_cats: ['093bf486-67c1-4cb1-b64d-e7b0b0cd3f01'],
                  is_in_dominating_set: 'False',
                  label: 'Istvan Gotly',
                  pagerank: 0.0014090793555780567,
                  'subtype': 'person',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/istvan-gotly-person'}},
        {data: {community_id: 6,
                  id: 'ed28910c-9809-45db-8e52-56f04793fc2d',
                  idoms_from_parent_cats: ['b8cc45b6-90fc-49f4-9b3a-605ff010ca35',
                                             '18f8185c-5a62-4a36-89f9-b81d39e722f0'],
                  is_in_dominating_set: 'True',
                  label: 'Lower City',
                  pagerank: 0.0012072912270803273,
                  'subtype': 'settlement',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/lower-city-settlement'}},
        {data: {community_id: 6,
                  id: 'ef34adc8-eb5a-43be-be34-f3da6b821173',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'False',
                  label: 'Elfsong Tavern',
                  pagerank: 0.0009680944612862324,
                  'subtype': 'landmark',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/elfsong-tavern-landmark'}},
        {data: {community_id: 0,
                  id: 'ef612b89-431c-4495-90cc-72448adc9f1a',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'False',
                  label: 'Watchful Shield',
                  pagerank: 0.0009782104744859945,
                  'subtype': 'landmark',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/watchful-shield-landmark'}},
        {data: {community_id: 1,
                  id: 'f1772b99-3cf3-407c-81d2-a523d23aeef2',
                  idoms_from_parent_cats: ['c21883ef-edfd-4ced-9057-808f9d756bda',
                                             '078031f7-5cbc-4b4f-92d0-00a04ea0fe3e'],
                  is_in_dominating_set: 'True',
                  label: 'Phillipitrous Jest',
                  pagerank: 0.0014952247131016097,
                  'subtype': 'person',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/phillipitrous-jest-person'}},
        {data: {community_id: 0,
                  id: 'f2031260-7b98-44e3-98cf-644c12d961bd',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'False',
                  label: 'Whitkeep',
                  pagerank: 0.001189618426699998,
                  'subtype': 'settlement',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/whitkeep-settlement'}},
        {data: {community_id: 3,
                  id: 'f2b6ef01-102c-4495-9bd8-594acec39630',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: "Scholar's Ward",
                  pagerank: 0.0010487021209486845,
                  'subtype': 'settlement',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/scholar-s-ward-settlement'}},
        {data: {community_id: 17,
                  id: 'f46ec508-bd91-47c1-bd89-aa90389c982d',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: 'Tyrant',
                  pagerank: 0.0009349918817885876,
                  'subtype': 'rank',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/tyrant-rank'}},
        {data: {community_id: 6,
                  id: 'f4dc7d17-0225-470e-bc40-23a610848493',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: "Smilin' Boar",
                  pagerank: 0.0009680944612862324,
                  'subtype': 'landmark',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/smilin--boar-landmark'}},
        {data: {community_id: 5,
                  id: 'f5287ca3-bb92-4ce7-a026-7f62d5f66ced',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: "A Player's Guide to The Leyden Nexus WorldAnvil",
                  pagerank: 0.0011493203204284736,
                  'subtype': 'article',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/a-player-s-guide-to-the-leyden-nexus-worldanvil-article'}},
        {data: {community_id: 0,
                  id: 'f7bc697e-fb9a-4d73-ad6f-52413cf03e80',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'False',
                  label: 'Bormul House',
                  pagerank: 0.0009782104744859945,
                  'subtype': 'landmark',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/bormul-house-landmark'}},
        {data: {community_id: 9,
                  id: 'f874731e-a939-40df-957d-38e52462bb35',
                  idoms_from_parent_cats: ['1f2298a7-1ad2-4725-8662-d4f4e7ada61c',
                                             '03b2cfe3-dad1-4419-b4a3-c02554e4dd6a',
                                             'fa4eb288-df1a-45c6-a922-daaea5c40c49'],
                  is_in_dominating_set: 'False',
                  label: 'Session 1: A Noble Request Report',
                  pagerank: 0.004642465711965695,
                  'subtype': 'report',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/session-13A-a-noble-request-report-report'}},
        {data: {community_id: 0,
                  id: 'f9f1dd3e-64a4-4a8f-bc4d-5d584dc70b1d',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: 'Blackgate',
                  pagerank: 0.001189618426699998,
                  'subtype': 'settlement',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/blackgate-settlement'}},
        {data: {community_id: 6,
                  id: 'faf7e6b1-afc4-4fe5-8b77-9bdbdcae893a',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'False',
                  label: 'Seatower District',
                  pagerank: 0.0009680944612862324,
                  'subtype': 'settlement',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/seatower-district-settlement'}},
        {data: {community_id: 6,
                  id: 'fd99f542-a8d8-4783-b98b-7ad0f480484a',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'False',
                  label: 'Sewer Keep',
                  pagerank: 0.0009680944612862324,
                  'subtype': 'landmark',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/sewer-keep-landmark'}},
        {data: {community_id: 3,
                  id: 'fe8bb495-1770-4356-af0d-d6f50643a37f',
                  idoms_from_parent_cats: [],
                  is_in_dominating_set: 'True',
                  label: 'Temple of Moro Gildila',
                  pagerank: 0.0015001651149663515,
                  'subtype': 'landmark',
                  type: 'article',
                  url: 'http://www.worldanvil.com/w/the-leyden-nexus-tannerw/a/temple-of-moro-gildila-landmark-1'}}]
       







        ,
        edges: [{
            data: {
                source: 'The Wide',
                target: '0508b003-b753-4871-a80f-a91767875180',
                'type': 'tag',
                weight: 1
            }
        },
        {
            data: {
                source: 'Bailiff',
                target: '0508b003-b753-4871-a80f-a91767875180',
                'type': 'tag',
                weight: 1
            }
        },
        {
            data: {
                source: 'BG-rank',
                target: '0508b003-b753-4871-a80f-a91767875180',
                'type': 'tag',
                weight: 1
            }
        },
        {
            data: {
                source: 'BG-rank',
                target: 'e64ef54e-4ba3-4e19-ba00-7fc93be4acae',
                'type': 'tag',
                weight: 1
            }
        },
        {
            data: {
                source: 'population',
                target: '05d5dd47-4bae-45df-8998-8eed28fbbd46',
                'type': 'tag',
                weight: 1
            }
        },
        {
            data: {
                source: 'city size',
                target: '05d5dd47-4bae-45df-8998-8eed28fbbd46',
                'type': 'tag',
                weight: 1
            }
        },
        {
            data: {
                source: 'density',
                target: '05d5dd47-4bae-45df-8998-8eed28fbbd46',
                'type': 'tag',
                weight: 1
            }
        },
        {
            data: {
                source: 'Magic',
                target: '093bf486-67c1-4cb1-b64d-e7b0b0cd3f01',
                'type': 'tag',
                weight: 1
            }
        },
        {
            data: {
                source: ' gems',
                target: '093bf486-67c1-4cb1-b64d-e7b0b0cd3f01',
                'type': 'tag',
                weight: 1
            }
        },
        {
            data: {
                source: 'leyden',
                target: '093bf486-67c1-4cb1-b64d-e7b0b0cd3f01',
                'type': 'tag',
                weight: 1
            }
        },
        {
            data: {
                source: 'nexus',
                target: '093bf486-67c1-4cb1-b64d-e7b0b0cd3f01',
                'type': 'tag',
                weight: 1
            }
        },
        {
            data: {
                source: 'spellcasting',
                target: '093bf486-67c1-4cb1-b64d-e7b0b0cd3f01',
                'type': 'tag',
                weight: 1
            }
        },
        {
            data: {
                source: 'focus',
                target: '093bf486-67c1-4cb1-b64d-e7b0b0cd3f01',
                'type': 'tag',
                weight: 1
            }
        },
        {
            data: {
                source: 'gem',
                target: '093bf486-67c1-4cb1-b64d-e7b0b0cd3f01',
                'type': 'tag',
                weight: 1
            }
        },
        {
            data: {
                source: 'touched',
                target: '093bf486-67c1-4cb1-b64d-e7b0b0cd3f01',
                'type': 'tag',
                weight: 1
            }
        },
        {
            data: {
                source: 'place-of-worship',
                target: '0affe09b-3246-4c32-8c93-9b0ae2027ce8',
                'type': 'tag',
                weight: 1
            }
        },
        {
            data: {
                source: 'BG-Gates',
                target: '13b3ff36-ec1d-4334-8ca0-7e3a46a84123',
                'type': 'tag',
                weight: 1
            }
        },
        {
            data: {
                source: 'BG-Gates',
                target: '4cfc5e47-e3df-422e-a22d-666358cfbabd',
                'type': 'tag',
                weight: 1
            }
        },
        {
            data: {
                source: 'BG-Gates',
                target: '52378476-f915-4d52-8879-d362780dd927',
                'type': 'tag',
                weight: 1
            }
        },
        {
            data: {
                source: 'BG-Gates',
                target: '6c034c72-1c98-4a12-a53f-deba52c838f9',
                'type': 'tag',
                weight: 1
            }
        },
        {
            data: {
                source: 'BG-Gates',
                target: '7c75258d-3582-452c-aef8-cf2d7bee4c2f',
                'type': 'tag',
                weight: 1
            }
        },
        {
            data: {
                source: 'BG-Gates',
                target: '7f251ce9-ed23-4bc8-919f-985f6338cfd8',
                'type': 'tag',
                weight: 1
            }
        },
        {
            data: {
                source: 'BG-Gates',
                target: 'a2b5d90c-cc68-4376-94c7-82b7361b1ab3',
                'type': 'tag',
                weight: 1
            }
        },
        {
            data: {
                source: 'BG-Gates',
                target: 'dee18e15-3b52-4310-8767-4d93f3a8ddb3',
                'type': 'tag',
                weight: 1
            }
        },
        {
            data: {
                source: 'BG-Gates',
                target: 'ec6d2d72-a177-421e-b0ed-0b9440b52cf5',
                'type': 'tag',
                weight: 1
            }
        },
        {
            data: {
                source: 'BG-Restaurant',
                target: '2e18c93d-3363-454e-84b1-1c39f6825eab',
                'type': 'tag',
                weight: 1
            }
        },
        {
            data: {
                source: 'BG-Restaurant',
                target: '4d356dae-400f-4fa5-a1b8-a0e1b05c5ce1',
                'type': 'tag',
                weight: 1
            }
        },
        {
            data: {
                source: 'BG-Restaurant',
                target: '857e7b81-58a7-4307-867b-480039b13655',
                'type': 'tag',
                weight: 1
            }
        },
        {
            data: {
                source: 'BG-Restaurant',
                target: 'f4dc7d17-0225-470e-bc40-23a610848493',
                'type': 'tag',
                weight: 1
            }
        },
        {
            data: {
                source: 'gem-rail-station',
                target: '424cc442-1219-420b-8e7f-cf8ca2bd8c75',
                'type': 'tag',
                weight: 1
            }
        },
        {
            data: {
                source: 'gem-rail-station',
                target: 'acf69050-78bc-4f79-844f-21575284bfb7',
                'type': 'tag',
                weight: 1
            }
        },
        {
            data: {
                source: 'greater-deity',
                target: '4e33f683-0426-48e2-9918-50d42e5d9226',
                'type': 'tag',
                weight: 1
            }
        },
        {
            data: {
                source: 'polytheistic',
                target: 'b4ad62f4-9deb-4746-86a8-5faa87e78da5',
                'type': 'tag',
                weight: 1
            }
        },
        {
            data: {
                source: 'Rules',
                target: 'd4669512-ed33-4a63-b454-8bb6687db48f',
                'type': 'tag',
                weight: 1
            }
        },
        {
            data: {
                source: ' Homebrew',
                target: 'd4669512-ed33-4a63-b454-8bb6687db48f',
                'type': 'tag',
                weight: 1
            }
        },
        {
            data: {
                source: 'weapon swapping',
                target: 'd4669512-ed33-4a63-b454-8bb6687db48f',
                'type': 'tag',
                weight: 1
            }
        },
        {
            data: {
                source: 'diagonals',
                target: 'd4669512-ed33-4a63-b454-8bb6687db48f',
                'type': 'tag',
                weight: 1
            }
        },
        {
            data: {
                source: 'diagonal movement',
                target: 'd4669512-ed33-4a63-b454-8bb6687db48f',
                'type': 'tag',
                weight: 1
            }
        },
        {
            data: {
                source: 'aerial combat',
                target: 'd4669512-ed33-4a63-b454-8bb6687db48f',
                'type': 'tag',
                weight: 1
            }
        },
        {
            data: {
                source: 'euclidean',
                target: 'd4669512-ed33-4a63-b454-8bb6687db48f',
                'type': 'tag',
                weight: 1
            }
        },
        {
            data: {
                source: 'extra attack',
                target: 'd4669512-ed33-4a63-b454-8bb6687db48f',
                'type': 'tag',
                weight: 1
            }
        },
        {
            data: {
                source: 'ready action',
                target: 'd4669512-ed33-4a63-b454-8bb6687db48f',
                'type': 'tag',
                weight: 1
            }
        },
        {
            data: {
                source: 'ready condition',
                target: 'd4669512-ed33-4a63-b454-8bb6687db48f',
                'type': 'tag',
                weight: 1
            }
        },
        {
            data: {
                source: 'ready',
                target: 'd4669512-ed33-4a63-b454-8bb6687db48f',
                'type': 'tag',
                weight: 1
            }
        },
        {
            data: {
                source: 'session-report',
                target: 'e113bba6-43bf-486d-a8fa-5017745e7af9',
                'type': 'tag',
                weight: 1
            }
        },
        {
            data: {
                source: "Baldur's Gate",
                target: 'e64ef54e-4ba3-4e19-ba00-7fc93be4acae',
                'type': 'tag',
                weight: 1
            }
        },
        {
            data: {
                source: 'taxes',
                target: 'e64ef54e-4ba3-4e19-ba00-7fc93be4acae',
                'type': 'tag',
                weight: 1
            }
        },
        {
            data: {
                source: 'finance',
                target: 'e64ef54e-4ba3-4e19-ba00-7fc93be4acae',
                'type': 'tag',
                weight: 1
            }
        },
        {
            data: {
                source: '0da03bac-54bb-4838-8a7e-5a0f8c20e72a',
                target: '01868e04-ee6d-43f7-a3a8-698cf7080f5e',
                weight: 1
            }
        },
        {
            data: {
                source: '2e6a1543-6c9d-4986-bfb0-42b9d16fa3c9',
                target: '06bbb2e8-d9c4-4939-9503-986f0eae1ce1',
                weight: 1
            }
        },
        {
            data: {
                source: '645835bc-dbb0-4844-bbe9-cee200f4f412',
                target: '06bbb2e8-d9c4-4939-9503-986f0eae1ce1',
                weight: 1
            }
        },
        {
            data: {
                source: '687b79e2-b062-4f75-8762-1f7b7d433454',
                target: '06bbb2e8-d9c4-4939-9503-986f0eae1ce1',
                weight: 1
            }
        },
        {
            data: {
                source: '7126b683-be1f-4040-a40f-c20246cf4ef5',
                target: '06bbb2e8-d9c4-4939-9503-986f0eae1ce1',
                weight: 1
            }
        },
        {
            data: {
                source: 'bf6e94a2-6a35-4c82-b6ad-e3f8777ecd90',
                target: '06bbb2e8-d9c4-4939-9503-986f0eae1ce1',
                weight: 1
            }
        },
        {
            data: {
                source: '4fea9216-77fb-4bc8-9a16-7caf59910429',
                target: '06bbb2e8-d9c4-4939-9503-986f0eae1ce1',
                weight: 1
            }
        },
        {
            data: {
                source: '3bd5d3ee-822e-4f52-b431-13031c9b3847',
                target: '0abdbd64-b8d2-4a60-8a55-d8ddf9232604',
                weight: 1
            }
        },
        {
            data: {
                source: '25837647-b2ea-4bad-8b98-33015e65466a',
                target: '0abdbd64-b8d2-4a60-8a55-d8ddf9232604',
                weight: 1
            }
        },
        {
            data: {
                source: '171d3bd8-83d1-4c74-8b8b-9f4e0ef82759',
                target: '0abdbd64-b8d2-4a60-8a55-d8ddf9232604',
                weight: 1
            }
        },
        {
            data: {
                source: '14ddfe78-6940-483c-8066-5e0075f0f673',
                target: '0d0ab841-8ff7-41b4-9144-d36c18c67475',
                weight: 1
            }
        },
        {
            data: {
                source: '10a66e51-a53b-40b4-9969-c421f13ad412',
                target: '0d0ab841-8ff7-41b4-9144-d36c18c67475',
                weight: 1
            }
        },
        {
            data: {
                source: '238e9b4d-e785-4837-85e1-44ca55967008',
                target: '0d188ed3-6f29-49f6-99bd-4c213a010d8a',
                weight: 1
            }
        },
        {
            data: {
                source: '943e87a6-7e91-4c9c-a9af-f196557808bb',
                target: '0d188ed3-6f29-49f6-99bd-4c213a010d8a',
                weight: 1
            }
        },
        {
            data: {
                source: '8c6a1339-328d-4784-b13e-31d7fa3e5a5f',
                target: '0e2e1fa7-d2cc-4f62-bbcc-97aed9d0b397',
                weight: 1
            }
        },
        {
            data: {
                source: '553cec9c-ff0c-4a79-8398-59a5535856f7',
                target: '0e2e1fa7-d2cc-4f62-bbcc-97aed9d0b397',
                weight: 1
            }
        },
        {
            data: {
                source: 'da085a72-69a2-4fc2-b6ad-f13a28275daa',
                target: '0e4d98a6-afd1-42f4-9042-fc1c6a80f0f3',
                weight: 1
            }
        },
        {
            data: {
                source: '54f7d604-b2b7-4ac4-bc96-fc169a366af7',
                target: '0e4d98a6-afd1-42f4-9042-fc1c6a80f0f3',
                weight: 1
            }
        },
        {
            data: {
                source: '95af41b4-5299-4de1-a462-bf07815b2585',
                target: '10a66e51-a53b-40b4-9969-c421f13ad412',
                weight: 1
            }
        },
        {
            data: {
                source: 'a21a8f12-6642-4ba0-a13a-8d787f461310',
                target: '14d0c9e7-2cbf-4857-acd3-0f69394403fc',
                weight: 1
            }
        },
        {
            data: {
                source: '44fe42f7-da24-4997-b337-481ad26b5207',
                target: '14d0c9e7-2cbf-4857-acd3-0f69394403fc',
                weight: 1
            }
        },
        {
            data: {
                source: 'a08595d9-a022-4b2e-8c33-7262a4a11f82',
                target: '15b49f54-25b3-41e3-bad7-665680a43b80',
                weight: 1
            }
        },
        {
            data: {
                source: '7b0024ac-6bbd-4146-8a5f-de918d34d3ab',
                target: '171d3bd8-83d1-4c74-8b8b-9f4e0ef82759',
                weight: 1
            }
        },
        {
            data: {
                source: '8751cf98-83be-45c4-9b6b-5549391cab1c',
                target: '18f8185c-5a62-4a36-89f9-b81d39e722f0',
                weight: 1
            }
        },
        {
            data: {
                source: 'aace67c9-7d36-445a-9876-e43936273fa9',
                target: '18f8185c-5a62-4a36-89f9-b81d39e722f0',
                weight: 1
            }
        },
        {
            data: {
                source: 'ae6a32a1-8424-45b3-9824-17702db8d62f',
                target: '18f8185c-5a62-4a36-89f9-b81d39e722f0',
                weight: 1
            }
        },
        {
            data: {
                source: '06bbb2e8-d9c4-4939-9503-986f0eae1ce1',
                target: '18f8185c-5a62-4a36-89f9-b81d39e722f0',
                weight: 1
            }
        },
        {
            data: {
                source: '4dd4b5fc-b3c1-4ceb-99fa-d4fb3128dc0a',
                target: '18f8185c-5a62-4a36-89f9-b81d39e722f0',
                weight: 1
            }
        },
        {
            data: {
                source: '6f7d200a-f37d-4ba2-a1ed-af6c498a1596',
                target: '2193f2f1-0c22-4ff9-bb43-5b100df458df',
                weight: 1
            }
        },
        {
            data: {
                source: 'cdf853ea-0f2b-4a67-8de2-001d3f34c264',
                target: '2193f2f1-0c22-4ff9-bb43-5b100df458df',
                weight: 1
            }
        },
        {
            data: {
                source: '077bce4a-05e0-428b-b1ee-ac61be011cbf',
                target: '21fb4997-bcf4-4828-afe9-640412f9242e',
                weight: 1
            }
        },
        {
            data: {
                source: 'd4669512-ed33-4a63-b454-8bb6687db48f',
                target: '25837647-b2ea-4bad-8b98-33015e65466a',
                weight: 1
            }
        },
        {
            data: {
                source: 'e6765349-cbe8-41a0-b16a-ce17e90f00b6',
                target: '25837647-b2ea-4bad-8b98-33015e65466a',
                weight: 1
            }
        },
        {
            data: {
                source: 'd9d9a36a-5ab4-4e05-b603-65a53f6f6e39',
                target: '25e76c20-1bbb-4dbb-8d64-0639cf098873',
                weight: 1
            }
        },
        {
            data: {
                source: '3c0a1268-6dab-4ed2-94ea-6cdf7d0313c8',
                target: '25e76c20-1bbb-4dbb-8d64-0639cf098873',
                weight: 1
            }
        },
        {
            data: {
                source: 'ed28910c-9809-45db-8e52-56f04793fc2d',
                target: '2887a5dc-f539-46f4-b709-8b651c14ddf1',
                weight: 1
            }
        },
        {
            data: {
                source: '220a3eea-826a-4163-8b97-7c05b4185b44',
                target: '309b7567-01ed-4a3f-b2de-b6503a40e00a',
                weight: 1
            }
        },
        {
            data: {
                source: '3cb46640-6821-4f97-8042-37ea06443059',
                target: '309b7567-01ed-4a3f-b2de-b6503a40e00a',
                weight: 1
            }
        },
        {
            data: {
                source: '44c03cd5-51bf-436d-8fe3-1cfb6d5caec4',
                target: '309b7567-01ed-4a3f-b2de-b6503a40e00a',
                weight: 1
            }
        },
        {
            data: {
                source: '75080b65-2527-4ca3-8b07-b5dc93611978',
                target: '309b7567-01ed-4a3f-b2de-b6503a40e00a',
                weight: 1
            }
        },
        {
            data: {
                source: '8552fae0-1c87-43f6-b0cb-81b5e9baa0e3',
                target: '309b7567-01ed-4a3f-b2de-b6503a40e00a',
                weight: 1
            }
        },
        {
            data: {
                source: 'd7deccc7-19aa-4ce9-bb82-e3caafc8159e',
                target: '309b7567-01ed-4a3f-b2de-b6503a40e00a',
                weight: 1
            }
        },
        {
            data: {
                source: 'da201481-a2dc-4263-899b-e7eece4f09c5',
                target: '309b7567-01ed-4a3f-b2de-b6503a40e00a',
                weight: 1
            }
        },
        {
            data: {
                source: 'ecb86c94-622b-4a62-9b85-e21ce82b4bfc',
                target: '309b7567-01ed-4a3f-b2de-b6503a40e00a',
                weight: 1
            }
        },
        {
            data: {
                source: 'dc7e89c1-b92b-4a7b-88bd-a4a27867c44f',
                target: '361f6100-eccc-4a9c-8914-26455780ddeb',
                weight: 1
            }
        },
        {
            data: {
                source: '8d66b580-6af4-4ea6-a0fb-c4a414a1911a',
                target: '361f6100-eccc-4a9c-8914-26455780ddeb',
                weight: 1
            }
        },
        {
            data: {
                source: '39b86545-81c4-4195-940a-0c80e883449f',
                target: '377b6172-1949-4d37-8878-a104ecf5dbd0',
                weight: 1
            }
        },
        {
            data: {
                source: '05d5dd47-4bae-45df-8998-8eed28fbbd46',
                target: '377b6172-1949-4d37-8878-a104ecf5dbd0',
                weight: 1
            }
        },
        {
            data: {
                source: '8a9f53bc-114f-4f41-9eb6-4ccb5d104921',
                target: '377b6172-1949-4d37-8878-a104ecf5dbd0',
                weight: 1
            }
        },
        {
            data: {
                source: '6e63da18-5cc7-4786-b516-01ebdb15a16a',
                target: '377b6172-1949-4d37-8878-a104ecf5dbd0',
                weight: 1
            }
        },
        {
            data: {
                source: 'ab2b0a90-94c1-4ff2-82fb-4fe1517426fa',
                target: '3a3556dd-1064-464d-845e-cc49535964a1',
                weight: 1
            }
        },
        {
            data: {
                source: 'ce8fa6c8-3435-4a34-b0b3-b52848090235',
                target: '3a3556dd-1064-464d-845e-cc49535964a1',
                weight: 1
            }
        },
        {
            data: {
                source: '72f693b7-c21e-4060-a0f9-36c21d5faac3',
                target: '3bc36745-bcb5-4d11-9b82-173bdd525d92',
                weight: 1
            }
        },
        {
            data: {
                source: '6dce918e-c6d4-4a12-a897-613742005656',
                target: '3bc36745-bcb5-4d11-9b82-173bdd525d92',
                weight: 1
            }
        },
        {
            data: {
                source: 'f9192b97-2255-48fb-bada-e2c521d8af5b',
                target: '3bd5d3ee-822e-4f52-b431-13031c9b3847',
                weight: 1
            }
        },
        {
            data: {
                source: '55311379-44cc-4d54-be8c-59942677fe67',
                target: '3bd5d3ee-822e-4f52-b431-13031c9b3847',
                weight: 1
            }
        },
        {
            data: {
                source: '9ce1b3ba-7bf2-4549-ad4b-a2dd9e70d41b',
                target: '3bd5d3ee-822e-4f52-b431-13031c9b3847',
                weight: 1
            }
        },
        {
            data: {
                source: 'aa0cc3c4-9697-409b-85d4-4139e70c829d',
                target: '3bd5d3ee-822e-4f52-b431-13031c9b3847',
                weight: 1
            }
        },
        {
            data: {
                source: '6c25af4a-9107-4120-8858-90e15d29240e',
                target: '3bd5d3ee-822e-4f52-b431-13031c9b3847',
                weight: 1
            }
        },
        {
            data: {
                source: 'e2fb3959-1f55-4e5f-9d5d-fea013e25be0',
                target: '3bd5d3ee-822e-4f52-b431-13031c9b3847',
                weight: 1
            }
        },
        {
            data: {
                source: 'bf8850c4-c460-4538-950b-0c0b15b9cfb1',
                target: '3dc3c37e-b7f3-4f4b-8318-305068032941',
                weight: 1
            }
        },
        {
            data: {
                source: '4e33f683-0426-48e2-9918-50d42e5d9226',
                target: '478573a8-e709-47f1-9e23-69e11d403521',
                weight: 1
            }
        },
        {
            data: {
                source: 'a5e8c4a6-7014-4162-aa56-350c22c971df',
                target: '478573a8-e709-47f1-9e23-69e11d403521',
                weight: 1
            }
        },
        {
            data: {
                source: '73965660-4803-455c-a6e8-027511996809',
                target: '478573a8-e709-47f1-9e23-69e11d403521',
                weight: 1
            }
        },
        {
            data: {
                source: '78b07367-1ccb-4c41-983f-f94fb491c5c3',
                target: '4dd4b5fc-b3c1-4ceb-99fa-d4fb3128dc0a',
                weight: 1
            }
        },
        {
            data: {
                source: '5b769580-a906-4588-a488-639369a771b8',
                target: '56d191a4-f254-4383-b5ad-f9dfa3b6cc55',
                weight: 1
            }
        },
        {
            data: {
                source: '844bd261-2e0b-4efc-81ee-cca98b09d27b',
                target: '56d191a4-f254-4383-b5ad-f9dfa3b6cc55',
                weight: 1
            }
        },
        {
            data: {
                source: '4d1da60c-56e2-437c-b597-bb01ab631f35',
                target: '56d191a4-f254-4383-b5ad-f9dfa3b6cc55',
                weight: 1
            }
        },
        {
            data: {
                source: 'c46e33d9-f514-4bf3-8add-1be25b5dcacf',
                target: '56d191a4-f254-4383-b5ad-f9dfa3b6cc55',
                weight: 1
            }
        },
        {
            data: {
                source: '9549d9a2-c01a-4dfd-9c2c-bf3a4731d55c',
                target: '56d191a4-f254-4383-b5ad-f9dfa3b6cc55',
                weight: 1
            }
        },
        {
            data: {
                source: '7826eb69-1d67-4b35-9574-97bd07ba9c25',
                target: '56d191a4-f254-4383-b5ad-f9dfa3b6cc55',
                weight: 1
            }
        },
        {
            data: {
                source: '093bf486-67c1-4cb1-b64d-e7b0b0cd3f01',
                target: '5a2a47f2-a93d-4ffd-a5cf-f2c71b89e124',
                weight: 1
            }
        },
        {
            data: {
                source: '34100a19-5477-4e91-805a-88b411e662ce',
                target: '5a2a47f2-a93d-4ffd-a5cf-f2c71b89e124',
                weight: 1
            }
        },
        {
            data: {
                source: '5e0a5b1f-7ada-4616-b8c1-b2685fe1768b',
                target: '5a2a47f2-a93d-4ffd-a5cf-f2c71b89e124',
                weight: 1
            }
        },
        {
            data: {
                source: '982f6644-e63c-4967-a185-9a244dc8bbf1',
                target: '5a2a47f2-a93d-4ffd-a5cf-f2c71b89e124',
                weight: 1
            }
        },
        {
            data: {
                source: '18f8185c-5a62-4a36-89f9-b81d39e722f0',
                target: '5ddf08f6-fa1e-46de-96fd-05beafd87fe7',
                weight: 1
            }
        },
        {
            data: {
                source: '864b40d3-70d3-4d81-b28b-5da341dc30e4',
                target: '5ddf08f6-fa1e-46de-96fd-05beafd87fe7',
                weight: 1
            }
        },
        {
            data: {
                source: '5342354a-8d76-44b6-9b4c-ba7020ded959',
                target: '5fc045cf-705c-41aa-b4dc-517a1bec5d52',
                weight: 1
            }
        },
        {
            data: {
                source: '3dc3c37e-b7f3-4f4b-8318-305068032941',
                target: '5fc045cf-705c-41aa-b4dc-517a1bec5d52',
                weight: 1
            }
        },
        {
            data: {
                source: 'f407c8fc-18e4-4745-8c71-442839f95e35',
                target: '5fc045cf-705c-41aa-b4dc-517a1bec5d52',
                weight: 1
            }
        },
        {
            data: {
                source: '11ff24b1-1378-4517-a9c5-148bf5a5d870',
                target: '5fc045cf-705c-41aa-b4dc-517a1bec5d52',
                weight: 1
            }
        },
        {
            data: {
                source: 'ab8b0496-e456-4472-a11e-31f0c2572621',
                target: '5fc045cf-705c-41aa-b4dc-517a1bec5d52',
                weight: 1
            }
        },
        {
            data: {
                source: '52e6a171-8893-434d-9f05-4b9c424e3363',
                target: '5fc045cf-705c-41aa-b4dc-517a1bec5d52',
                weight: 1
            }
        },
        {
            data: {
                source: '2ae7db37-a3dd-4e5d-b033-d37c7ad1b971',
                target: '65fb527e-4158-4239-9687-8c714eb92d1c',
                weight: 1
            }
        },
        {
            data: {
                source: '0e4d98a6-afd1-42f4-9042-fc1c6a80f0f3',
                target: '65fb527e-4158-4239-9687-8c714eb92d1c',
                weight: 1
            }
        },
        {
            data: {
                source: 'a81d9b3a-aa5c-4d0e-97d8-259acdf5b281',
                target: '6889ca60-afdc-4a7f-b68f-a5e3aeb6e13c',
                weight: 1
            }
        },
        {
            data: {
                source: '7a1b402c-c342-4dce-8924-bb30d69c72d4',
                target: '6889ca60-afdc-4a7f-b68f-a5e3aeb6e13c',
                weight: 1
            }
        },
        {
            data: {
                source: '9ec2ffdc-e5f5-494c-91ba-426faf71f090',
                target: '6b406091-f679-49fa-b44e-5f5a134a3705',
                weight: 1
            }
        },
        {
            data: {
                source: 'f881ed54-2426-49d4-a705-bdd724d9bca7',
                target: '6b406091-f679-49fa-b44e-5f5a134a3705',
                weight: 1
            }
        },
        {
            data: {
                source: '34d64bf2-9ff9-45c9-84bd-1d106730a5a7',
                target: '726a2e50-bfed-4d29-850f-9f70907c253d',
                weight: 1
            }
        },
        {
            data: {
                source: 'b4ad62f4-9deb-4746-86a8-5faa87e78da5',
                target: '74102638-9ae6-4676-9fc2-989e431a6aad',
                weight: 1
            }
        },
        {
            data: {
                source: 'e136dfdb-3842-49b2-bc9b-4f1fe4c2b8ac',
                target: '74102638-9ae6-4676-9fc2-989e431a6aad',
                weight: 1
            }
        },
        {
            data: {
                source: '7233f0fa-df2c-471d-a846-cfc1ff8e9f4c',
                target: '7593fa16-8ce3-472f-ad59-e924c392679e',
                weight: 1
            }
        },
        {
            data: {
                source: 'e113bba6-43bf-486d-a8fa-5017745e7af9',
                target: '7593fa16-8ce3-472f-ad59-e924c392679e',
                weight: 1
            }
        },
        {
            data: {
                source: 'f874731e-a939-40df-957d-38e52462bb35',
                target: '7593fa16-8ce3-472f-ad59-e924c392679e',
                weight: 1
            }
        },
        {
            data: {
                source: '329a0014-76e0-4c01-bf4e-2eaab9a80477',
                target: '76fa6a54-065b-4be0-9e1b-8948e8b68d8e',
                weight: 1
            }
        },
        {
            data: {
                source: '4b57c07b-f3f4-4e1b-925f-a719d07451aa',
                target: '76fa6a54-065b-4be0-9e1b-8948e8b68d8e',
                weight: 1
            }
        },
        {
            data: {
                source: '7193e1e0-d071-4bc2-a04c-70f0e45a7ae0',
                target: '76fa6a54-065b-4be0-9e1b-8948e8b68d8e',
                weight: 1
            }
        },
        {
            data: {
                source: 'a4496372-ab05-4892-afc7-a223f02b34cf',
                target: '76fa6a54-065b-4be0-9e1b-8948e8b68d8e',
                weight: 1
            }
        },
        {
            data: {
                source: '03b2cfe3-dad1-4419-b4a3-c02554e4dd6a',
                target: '803567bd-3056-4fae-8244-5ef2ca652e64',
                weight: 1
            }
        },
        {
            data: {
                source: '969f6dcf-75e3-4f25-b8cf-8ac586742f52',
                target: '803567bd-3056-4fae-8244-5ef2ca652e64',
                weight: 1
            }
        },
        {
            data: {
                source: '58087e56-e986-468c-875e-9643acfe6eb9',
                target: '808faaed-0d82-43aa-b1a1-059d95d8dbff',
                weight: 1
            }
        },
        {
            data: {
                source: 'f7c1bce2-773c-4d78-b918-ebf61688f603',
                target: '808faaed-0d82-43aa-b1a1-059d95d8dbff',
                weight: 1
            }
        },
        {
            data: {
                source: 'a1a46f2e-8628-4cb6-a00b-bcf395dfe005',
                target: '864b40d3-70d3-4d81-b28b-5da341dc30e4',
                weight: 1
            }
        },
        {
            data: {
                source: 'c5814f42-d54d-434e-a33f-5e89eb4055ae',
                target: '864b40d3-70d3-4d81-b28b-5da341dc30e4',
                weight: 1
            }
        },
        {
            data: {
                source: '15775ff9-568c-408d-8b4c-26059d620bc0',
                target: '89b9f719-53ac-4785-a7df-a193644899ec',
                weight: 1
            }
        },
        {
            data: {
                source: '2d0a798a-7058-4bde-8076-0b7bcf68c114',
                target: '89b9f719-53ac-4785-a7df-a193644899ec',
                weight: 1
            }
        },
        {
            data: {
                source: 'ec7f10bb-6242-4f93-aaad-24f9dcc62ef1',
                target: '8a9f53bc-114f-4f41-9eb6-4ccb5d104921',
                weight: 1
            }
        },
        {
            data: {
                source: '355bbf06-e575-485f-8153-9c6d7cc32d84',
                target: '8a9f53bc-114f-4f41-9eb6-4ccb5d104921',
                weight: 1
            }
        },
        {
            data: {
                source: '5ddf08f6-fa1e-46de-96fd-05beafd87fe7',
                target: '8a9f53bc-114f-4f41-9eb6-4ccb5d104921',
                weight: 1
            }
        },
        {
            data: {
                source: '9effb3c5-240e-40c9-af80-db4aad2c8e75',
                target: '8d66b580-6af4-4ea6-a0fb-c4a414a1911a',
                weight: 1
            }
        },
        {
            data: {
                source: '75a3c752-7b80-4bde-a0c3-cdcc1095e4cc',
                target: '8eb263b4-447c-4fd3-9762-525921bea6a2',
                weight: 1
            }
        },
        {
            data: {
                source: '23b7e4ac-f6ae-4cf8-b151-a19f2ce0d36f',
                target: '8eb263b4-447c-4fd3-9762-525921bea6a2',
                weight: 1
            }
        },
        {
            data: {
                source: 'bc7d7701-5fe4-4204-b8c7-094eaf73a793',
                target: '8eb263b4-447c-4fd3-9762-525921bea6a2',
                weight: 1
            }
        },
        {
            data: {
                source: '8070937b-aea5-4ec5-89b2-1663be72df97',
                target: '8eb263b4-447c-4fd3-9762-525921bea6a2',
                weight: 1
            }
        },
        {
            data: {
                source: 'c3c27f86-0d67-47aa-b0db-72ee5ad66793',
                target: '8eb263b4-447c-4fd3-9762-525921bea6a2',
                weight: 1
            }
        },
        {
            data: {
                source: 'b04727ad-eee7-4297-bbbe-c6dbda13da16',
                target: '8eb263b4-447c-4fd3-9762-525921bea6a2',
                weight: 1
            }
        },
        {
            data: {
                source: '0afa9137-5a58-4d67-aa34-4d5df91ebe78',
                target: '8eb263b4-447c-4fd3-9762-525921bea6a2',
                weight: 1
            }
        },
        {
            data: {
                source: '8ef096c4-bd3b-4baf-be2b-603a2d060754',
                target: '8eb263b4-447c-4fd3-9762-525921bea6a2',
                weight: 1
            }
        },
        {
            data: {
                source: 'e12cc565-6b06-4844-acc4-fa266c64b704',
                target: '8eb263b4-447c-4fd3-9762-525921bea6a2',
                weight: 1
            }
        },
        {
            data: {
                source: '79ea8b25-d8cf-4321-80a5-b30094ba88fe',
                target: '8eb263b4-447c-4fd3-9762-525921bea6a2',
                weight: 1
            }
        },
        {
            data: {
                source: 'ae3d1d8e-f1dc-4afb-b4c6-179818e9e8d7',
                target: '8eb263b4-447c-4fd3-9762-525921bea6a2',
                weight: 1
            }
        },
        {
            data: {
                source: '03bd9d1f-2d7f-40d1-89a2-6f75c85bfe3e',
                target: '91b796d8-8666-4ff8-9d89-8f787fef0bc6',
                weight: 1
            }
        },
        {
            data: {
                source: '1ae679c0-c890-4377-b8ac-7093d9d7f8e2',
                target: '91b796d8-8666-4ff8-9d89-8f787fef0bc6',
                weight: 1
            }
        },
        {
            data: {
                source: 'd8dba4f4-27e5-403a-a821-185b2dfce22e',
                target: '95008541-1608-41d1-bbcc-c770e07d27a4',
                weight: 1
            }
        },
        {
            data: {
                source: 'e77088f7-a57a-421d-90db-6c06b2d11b74',
                target: '95008541-1608-41d1-bbcc-c770e07d27a4',
                weight: 1
            }
        },
        {
            data: {
                source: '022ec78c-ee39-4db7-8212-aaea0a3c39a8',
                target: '9effb3c5-240e-40c9-af80-db4aad2c8e75',
                weight: 1
            }
        },
        {
            data: {
                source: 'c6f5f652-7adb-4a86-a890-0df99a657de2',
                target: '9effb3c5-240e-40c9-af80-db4aad2c8e75',
                weight: 1
            }
        },
        {
            data: {
                source: '8f0ed82e-1962-4478-b46e-4f009cf48de4',
                target: '9effb3c5-240e-40c9-af80-db4aad2c8e75',
                weight: 1
            }
        },
        {
            data: {
                source: 'a87c0eec-fe3e-4481-a45f-5afa40a3fc8a',
                target: 'a08595d9-a022-4b2e-8c33-7262a4a11f82',
                weight: 1
            }
        },
        {
            data: {
                source: '803567bd-3056-4fae-8244-5ef2ca652e64',
                target: 'a1a46f2e-8628-4cb6-a00b-bcf395dfe005',
                weight: 1
            }
        },
        {
            data: {
                source: '35dd21d4-eaf6-462a-ad6c-21c1b76b0323',
                target: 'a3fe07ba-a93f-44f9-bdda-ca84bc2294d0',
                weight: 1
            }
        },
        {
            data: {
                source: '5a2a47f2-a93d-4ffd-a5cf-f2c71b89e124',
                target: 'a3fe07ba-a93f-44f9-bdda-ca84bc2294d0',
                weight: 1
            }
        },
        {
            data: {
                source: 'ed7c9084-0b43-4e5b-9db6-d7c9b2a62a61',
                target: 'a3fe07ba-a93f-44f9-bdda-ca84bc2294d0',
                weight: 1
            }
        },
        {
            data: {
                source: 'af49353a-10f1-451f-ba53-22d00a32a8c0',
                target: 'a3fe07ba-a93f-44f9-bdda-ca84bc2294d0',
                weight: 1
            }
        },
        {
            data: {
                source: '56d191a4-f254-4383-b5ad-f9dfa3b6cc55',
                target: 'a3fe07ba-a93f-44f9-bdda-ca84bc2294d0',
                weight: 1
            }
        },
        {
            data: {
                source: '5fc045cf-705c-41aa-b4dc-517a1bec5d52',
                target: 'a3fe07ba-a93f-44f9-bdda-ca84bc2294d0',
                weight: 1
            }
        },
        {
            data: {
                source: 'c011adda-8d48-4741-99bf-ee7c4638e999',
                target: 'a3fe07ba-a93f-44f9-bdda-ca84bc2294d0',
                weight: 1
            }
        },
        {
            data: {
                source: 'dbfbd1a6-e34b-43f0-8d14-c3df14a8a748',
                target: 'a3fe07ba-a93f-44f9-bdda-ca84bc2294d0',
                weight: 1
            }
        },
        {
            data: {
                source: 'ba32f9c3-603f-4217-a3a1-7f1210471748',
                target: 'aace67c9-7d36-445a-9876-e43936273fa9',
                weight: 1
            }
        },
        {
            data: {
                source: '0d0ab841-8ff7-41b4-9144-d36c18c67475',
                target: 'aace67c9-7d36-445a-9876-e43936273fa9',
                weight: 1
            }
        },
        {
            data: {
                source: '89b9f719-53ac-4785-a7df-a193644899ec',
                target: 'aace67c9-7d36-445a-9876-e43936273fa9',
                weight: 1
            }
        },
        {
            data: {
                source: '65fb527e-4158-4239-9687-8c714eb92d1c',
                target: 'aace67c9-7d36-445a-9876-e43936273fa9',
                weight: 1
            }
        },
        {
            data: {
                source: 'd9f8b271-fae8-4107-857a-d9da664f3825',
                target: 'aace67c9-7d36-445a-9876-e43936273fa9',
                weight: 1
            }
        },
        {
            data: {
                source: 'd18e2b11-96aa-44ff-b2f7-37bfa61c9beb',
                target: 'aace67c9-7d36-445a-9876-e43936273fa9',
                weight: 1
            }
        },
        {
            data: {
                source: '0e2e1fa7-d2cc-4f62-bbcc-97aed9d0b397',
                target: 'aace67c9-7d36-445a-9876-e43936273fa9',
                weight: 1
            }
        },
        {
            data: {
                source: 'f8897033-c0f9-41ca-9be9-bcbef7ce536a',
                target: 'aace67c9-7d36-445a-9876-e43936273fa9',
                weight: 1
            }
        },
        {
            data: {
                source: 'd0db8d27-0c78-486f-ab96-1243baa12de3',
                target: 'ab8b0496-e456-4472-a11e-31f0c2572621',
                weight: 1
            }
        },
        {
            data: {
                source: '14d0c9e7-2cbf-4857-acd3-0f69394403fc',
                target: 'ab8b0496-e456-4472-a11e-31f0c2572621',
                weight: 1
            }
        },
        {
            data: {
                source: '309b7567-01ed-4a3f-b2de-b6503a40e00a',
                target: 'ab8b0496-e456-4472-a11e-31f0c2572621',
                weight: 1
            }
        },
        {
            data: {
                source: '74102638-9ae6-4676-9fc2-989e431a6aad',
                target: 'ab8b0496-e456-4472-a11e-31f0c2572621',
                weight: 1
            }
        },
        {
            data: {
                source: 'ed3d1db3-6227-410c-a0da-72cb852c254e',
                target: 'ab8b0496-e456-4472-a11e-31f0c2572621',
                weight: 1
            }
        },
        {
            data: {
                source: '808faaed-0d82-43aa-b1a1-059d95d8dbff',
                target: 'ab8b0496-e456-4472-a11e-31f0c2572621',
                weight: 1
            }
        },
        {
            data: {
                source: '6b406091-f679-49fa-b44e-5f5a134a3705',
                target: 'ab8b0496-e456-4472-a11e-31f0c2572621',
                weight: 1
            }
        },
        {
            data: {
                source: '424cc442-1219-420b-8e7f-cf8ca2bd8c75',
                target: 'ae6a32a1-8424-45b3-9824-17702db8d62f',
                weight: 1
            }
        },
        {
            data: {
                source: 'acf69050-78bc-4f79-844f-21575284bfb7',
                target: 'ae6a32a1-8424-45b3-9824-17702db8d62f',
                weight: 1
            }
        },
        {
            data: {
                source: '8f31407b-4022-4461-8a55-90393bbf7b1e',
                target: 'af49353a-10f1-451f-ba53-22d00a32a8c0',
                weight: 1
            }
        },
        {
            data: {
                source: '014be81e-265e-48c3-9e5d-2d6fe0d68158',
                target: 'ba32f9c3-603f-4217-a3a1-7f1210471748',
                weight: 1
            }
        },
        {
            data: {
                source: '3435e6cb-a1c4-464d-a8ae-c8247fdf5da5',
                target: 'ba32f9c3-603f-4217-a3a1-7f1210471748',
                weight: 1
            }
        },
        {
            data: {
                source: '21fb4997-bcf4-4828-afe9-640412f9242e',
                target: 'ba32f9c3-603f-4217-a3a1-7f1210471748',
                weight: 1
            }
        },
        {
            data: {
                source: '91b796d8-8666-4ff8-9d89-8f787fef0bc6',
                target: 'c011adda-8d48-4741-99bf-ee7c4638e999',
                weight: 1
            }
        },
        {
            data: {
                source: '3bc36745-bcb5-4d11-9b82-173bdd525d92',
                target: 'c011adda-8d48-4741-99bf-ee7c4638e999',
                weight: 1
            }
        },
        {
            data: {
                source: '0d188ed3-6f29-49f6-99bd-4c213a010d8a',
                target: 'c011adda-8d48-4741-99bf-ee7c4638e999',
                weight: 1
            }
        },
        {
            data: {
                source: '361f6100-eccc-4a9c-8914-26455780ddeb',
                target: 'c011adda-8d48-4741-99bf-ee7c4638e999',
                weight: 1
            }
        },
        {
            data: {
                source: '95008541-1608-41d1-bbcc-c770e07d27a4',
                target: 'c011adda-8d48-4741-99bf-ee7c4638e999',
                weight: 1
            }
        },
        {
            data: {
                source: 'd9e2d266-d168-4c77-8163-b36c40b362d0',
                target: 'c011adda-8d48-4741-99bf-ee7c4638e999',
                weight: 1
            }
        },
        {
            data: {
                source: '25e76c20-1bbb-4dbb-8d64-0639cf098873',
                target: 'c011adda-8d48-4741-99bf-ee7c4638e999',
                weight: 1
            }
        },
        {
            data: {
                source: '3a3556dd-1064-464d-845e-cc49535964a1',
                target: 'c011adda-8d48-4741-99bf-ee7c4638e999',
                weight: 1
            }
        },
        {
            data: {
                source: '181e4c8d-cb21-49e3-8ff4-1cd1d3293bbf',
                target: 'c21883ef-edfd-4ced-9057-808f9d756bda',
                weight: 1
            }
        },
        {
            data: {
                source: '48df75b0-177f-4e6b-ab5e-d9ba23a63d2c',
                target: 'c21883ef-edfd-4ced-9057-808f9d756bda',
                weight: 1
            }
        },
        {
            data: {
                source: '68574ff8-cfeb-4433-abb7-1603d9a86fb6',
                target: 'c21883ef-edfd-4ced-9057-808f9d756bda',
                weight: 1
            }
        },
        {
            data: {
                source: '69f87e0f-e2c3-45cf-ac25-6fcb834eb1b4',
                target: 'c21883ef-edfd-4ced-9057-808f9d756bda',
                weight: 1
            }
        },
        {
            data: {
                source: '9bdbbf36-9c34-427e-a3ea-a451df8216c4',
                target: 'c21883ef-edfd-4ced-9057-808f9d756bda',
                weight: 1
            }
        },
        {
            data: {
                source: 'f1772b99-3cf3-407c-81d2-a523d23aeef2',
                target: 'c21883ef-edfd-4ced-9057-808f9d756bda',
                weight: 1
            }
        },
        {
            data: {
                source: '1cbe8957-d506-481d-b7b0-bfcb75ef5192',
                target: 'c396b18c-aa26-4578-81e7-8bf2c0419332',
                weight: 1
            }
        },
        {
            data: {
                source: 'a1440768-7630-4a63-8d6a-42afb36b9dc9',
                target: 'c396b18c-aa26-4578-81e7-8bf2c0419332',
                weight: 1
            }
        },
        {
            data: {
                source: '61160e79-057f-4bfd-8355-51d1675b4050',
                target: 'c396b18c-aa26-4578-81e7-8bf2c0419332',
                weight: 1
            }
        },
        {
            data: {
                source: '15b49f54-25b3-41e3-bad7-665680a43b80',
                target: 'c5814f42-d54d-434e-a33f-5e89eb4055ae',
                weight: 1
            }
        },
        {
            data: {
                source: '61995c43-27e4-421e-b146-9ec4587d41e7',
                target: 'd18e2b11-96aa-44ff-b2f7-37bfa61c9beb',
                weight: 1
            }
        },
        {
            data: {
                source: '1307c198-ab2d-4888-b312-2e838bb52f8a',
                target: 'd18e2b11-96aa-44ff-b2f7-37bfa61c9beb',
                weight: 1
            }
        },
        {
            data: {
                source: '06c1acca-c436-42cc-9c44-d3ce14d19a85',
                target: 'd5a1d4e9-81d6-49cf-9249-d70626944fe8',
                weight: 1
            }
        },
        {
            data: {
                source: '3637da8e-6e77-4ad2-a388-769e1ac931dc',
                target: 'd5a1d4e9-81d6-49cf-9249-d70626944fe8',
                weight: 1
            }
        },
        {
            data: {
                source: '8abe03c6-c803-4bbf-9682-92049abb8d53',
                target: 'd9e2d266-d168-4c77-8163-b36c40b362d0',
                weight: 1
            }
        },
        {
            data: {
                source: '6889ca60-afdc-4a7f-b68f-a5e3aeb6e13c',
                target: 'd9e2d266-d168-4c77-8163-b36c40b362d0',
                weight: 1
            }
        },
        {
            data: {
                source: '48b1073b-c4d1-411b-b9bb-9fe389df84bd',
                target: 'd9f8b271-fae8-4107-857a-d9da664f3825',
                weight: 1
            }
        },
        {
            data: {
                source: '2193f2f1-0c22-4ff9-bb43-5b100df458df',
                target: 'd9f8b271-fae8-4107-857a-d9da664f3825',
                weight: 1
            }
        },
        {
            data: {
                source: 'd3a9adf6-9c14-4389-be08-2c8dc2952528',
                target: 'dbfbd1a6-e34b-43f0-8d14-c3df14a8a748',
                weight: 1
            }
        },
        {
            data: {
                source: '4f796835-3ee8-42bc-946c-eb59cf44889e',
                target: 'e2461c29-077e-4fd6-8404-935d1396048c',
                weight: 1
            }
        },
        {
            data: {
                source: 'f506393a-d938-4114-b2c7-14ecf347a07e',
                target: 'e2461c29-077e-4fd6-8404-935d1396048c',
                weight: 1
            }
        },
        {
            data: {
                source: 'fa4eb288-df1a-45c6-a922-daaea5c40c49',
                target: 'e2461c29-077e-4fd6-8404-935d1396048c',
                weight: 1
            }
        },
        {
            data: {
                source: '30dac3db-a2b3-4161-b11c-d74a55c0387e',
                target: 'e2fb3959-1f55-4e5f-9d5d-fea013e25be0',
                weight: 1
            }
        },
        {
            data: {
                source: '341aec9d-9726-41a5-84b2-c28b476623f5',
                target: 'e2fb3959-1f55-4e5f-9d5d-fea013e25be0',
                weight: 1
            }
        },
        {
            data: {
                source: '12824120-c343-4501-9f97-1f367569fea3',
                target: 'e2fb3959-1f55-4e5f-9d5d-fea013e25be0',
                weight: 1
            }
        },
        {
            data: {
                source: 'ea08641f-ebd9-42da-bfe3-7e6200fa8dbf',
                target: 'e2fb3959-1f55-4e5f-9d5d-fea013e25be0',
                weight: 1
            }
        },
        {
            data: {
                source: 'e144000c-eeca-4c6d-9644-470666441016',
                target: 'e382a22d-2331-4e8d-b949-eb75e393fe0b',
                weight: 1
            }
        },
        {
            data: {
                source: 'd3760408-517f-4395-880f-cc60e176213d',
                target: 'e382a22d-2331-4e8d-b949-eb75e393fe0b',
                weight: 1
            }
        },
        {
            data: {
                source: '1f2298a7-1ad2-4725-8662-d4f4e7ada61c',
                target: 'e382a22d-2331-4e8d-b949-eb75e393fe0b',
                weight: 1
            }
        },
        {
            data: {
                source: '945e2575-3b0a-43ef-b0f3-f5ec68e5016b',
                target: 'e382a22d-2331-4e8d-b949-eb75e393fe0b',
                weight: 1
            }
        },
        {
            data: {
                source: '60cd8d55-f4ec-474c-adca-675d8ae78394',
                target: 'ea08641f-ebd9-42da-bfe3-7e6200fa8dbf',
                weight: 1
            }
        },
        {
            data: {
                source: '7db79ff9-82b5-43b8-96a7-43e2abbf1b42',
                target: 'ecb86c94-622b-4a62-9b85-e21ce82b4bfc',
                weight: 1
            }
        },
        {
            data: {
                source: 'c122c8ad-d13e-43c1-a69c-7a0b67512b2c',
                target: 'ecb86c94-622b-4a62-9b85-e21ce82b4bfc',
                weight: 1
            }
        },
        {
            data: {
                source: '32c2a8cf-4588-4b74-b32f-de377e5dc31e',
                target: 'ecb86c94-622b-4a62-9b85-e21ce82b4bfc',
                weight: 1
            }
        },
        {
            data: {
                source: '3d0d7062-9397-4bd0-a3d5-f3bb0538c3f2',
                target: 'ecb86c94-622b-4a62-9b85-e21ce82b4bfc',
                weight: 1
            }
        },
        {
            data: {
                source: '3ee822f1-3432-4df1-92d5-3acaa8f48c45',
                target: 'ecb86c94-622b-4a62-9b85-e21ce82b4bfc',
                weight: 1
            }
        },
        {
            data: {
                source: '49301c65-06b9-4927-8b3c-a8bcaa7ac638',
                target: 'ecb86c94-622b-4a62-9b85-e21ce82b4bfc',
                weight: 1
            }
        },
        {
            data: {
                source: '7585bb54-b33d-4d63-ab0b-bde01248b475',
                target: 'ecb86c94-622b-4a62-9b85-e21ce82b4bfc',
                weight: 1
            }
        },
        {
            data: {
                source: '7bcfd68f-5920-423f-be89-9003841b384d',
                target: 'ecb86c94-622b-4a62-9b85-e21ce82b4bfc',
                weight: 1
            }
        },
        {
            data: {
                source: '86d7d728-7f68-4e9e-8319-6274cd1e3049',
                target: 'ecb86c94-622b-4a62-9b85-e21ce82b4bfc',
                weight: 1
            }
        },
        {
            data: {
                source: 'c8bc376f-6e07-42c2-8abd-47ac965b62ba',
                target: 'ecb86c94-622b-4a62-9b85-e21ce82b4bfc',
                weight: 1
            }
        },
        {
            data: {
                source: 'e0bba579-dd5a-45fa-b3e5-d2a90077fa1b',
                target: 'ecb86c94-622b-4a62-9b85-e21ce82b4bfc',
                weight: 1
            }
        },
        {
            data: {
                source: 'e9d17a68-3295-47f3-a339-2246963f42e6',
                target: 'ecb86c94-622b-4a62-9b85-e21ce82b4bfc',
                weight: 1
            }
        },
        {
            data: {
                source: 'b4cbcfbd-f487-4ecc-9e85-e89b9fd3b1f1',
                target: 'ed3d1db3-6227-410c-a0da-72cb852c254e',
                weight: 1
            }
        },
        {
            data: {
                source: 'b5f38b5d-62fc-4d8d-8cc6-e4eae91ba34e',
                target: 'ed3d1db3-6227-410c-a0da-72cb852c254e',
                weight: 1
            }
        },
        {
            data: {
                source: '43092fdf-5d85-408e-bf99-fe9ed835a839',
                target: 'ed7c9084-0b43-4e5b-9db6-d7c9b2a62a61',
                weight: 1
            }
        },
        {
            data: {
                source: 'a6cc845f-f349-4b2b-81f7-999502799889',
                target: 'f08ade4a-6087-4f41-8666-b2a4c0da24b9',
                weight: 1
            }
        },
        {
            data: {
                source: '478573a8-e709-47f1-9e23-69e11d403521',
                target: 'f407c8fc-18e4-4745-8c71-442839f95e35',
                weight: 1
            }
        },
        {
            data: {
                source: '078031f7-5cbc-4b4f-92d0-00a04ea0fe3e',
                target: 'f506393a-d938-4114-b2c7-14ecf347a07e',
                weight: 1
            }
        },
        {
            data: {
                source: '76fa6a54-065b-4be0-9e1b-8948e8b68d8e',
                target: 'f506393a-d938-4114-b2c7-14ecf347a07e',
                weight: 1
            }
        },
        {
            data: {
                source: 'c396b18c-aa26-4578-81e7-8bf2c0419332',
                target: 'f506393a-d938-4114-b2c7-14ecf347a07e',
                weight: 1
            }
        },
        {
            data: {
                source: 'caa680a1-8f67-419a-a288-a047c9819749',
                target: 'f616390d-2099-44a0-8850-bbe7213196d0',
                weight: 1
            }
        },
        {
            data: {
                source: 'd88f42c4-d3bb-4118-b7c1-5cc59cf296e7',
                target: 'f8897033-c0f9-41ca-9be9-bcbef7ce536a',
                weight: 1
            }
        },
        {
            data: {
                source: '392ed320-4d80-401a-9b9a-cc617023101f',
                target: 'f8897033-c0f9-41ca-9be9-bcbef7ce536a',
                weight: 1
            }
        },
        {
            data: {
                source: '2887a5dc-f539-46f4-b709-8b651c14ddf1',
                target: 'f8897033-c0f9-41ca-9be9-bcbef7ce536a',
                weight: 1
            }
        },
        {
            data: {
                source: 'f616390d-2099-44a0-8850-bbe7213196d0',
                target: 'f8897033-c0f9-41ca-9be9-bcbef7ce536a',
                weight: 1
            }
        },
        {
            data: {
                source: '726a2e50-bfed-4d29-850f-9f70907c253d',
                target: 'f8897033-c0f9-41ca-9be9-bcbef7ce536a',
                weight: 1
            }
        },
        {
            data: {
                source: 'b7b66633-ebf3-4a03-b501-8c257326c26d',
                target: 'f9192b97-2255-48fb-bada-e2c521d8af5b',
                weight: 1
            }
        },
        {
            data: {
                source: '09ffaf01-8e01-44c6-9ac4-e854566814ea',
                target: 'f9192b97-2255-48fb-bada-e2c521d8af5b',
                weight: 1
            }
        },
        {
            data: {
                source: 'b2d5c132-93ec-4480-a03a-0b48a5c45759',
                target: 'f9192b97-2255-48fb-bada-e2c521d8af5b',
                weight: 1
            }
        },
        {
            data: {
                source: '4b101ce9-3a7e-434b-be22-b276b21acb5d',
                target: 'f9192b97-2255-48fb-bada-e2c521d8af5b',
                weight: 1
            }
        },
        {
            data: {
                source: '558a25f8-e749-4c62-ba06-7635647e56bb',
                target: 'f9192b97-2255-48fb-bada-e2c521d8af5b',
                weight: 1
            }
        },
        {
            data: {
                source: '9276d6fd-b3b9-4147-bded-d80e67ac86d7',
                target: 'f9192b97-2255-48fb-bada-e2c521d8af5b',
                weight: 1
            }
        },
        {
            data: {
                source: 'c67fe0ec-25dd-425a-ac37-af10a4d80463',
                target: 'f9192b97-2255-48fb-bada-e2c521d8af5b',
                weight: 1
            }
        },
        {
            data: {
                source: '75ead13f-9e8d-482d-ba4d-8f5b63c41e53',
                target: 'f9192b97-2255-48fb-bada-e2c521d8af5b',
                weight: 1
            }
        },
        {
            data: {
                source: 'bd3ec55b-4bf6-445b-b610-dafc64706ed1',
                target: 'f9192b97-2255-48fb-bada-e2c521d8af5b',
                weight: 1
            }
        },
        {
            data: {
                source: 'b8692be0-0d7f-4077-bcb1-3178758a6991',
                target: 'f9192b97-2255-48fb-bada-e2c521d8af5b',
                weight: 1
            }
        },
        {
            data: {
                source: 'daafc048-34c6-43b5-afc6-c012cf0dee3f',
                target: 'f9192b97-2255-48fb-bada-e2c521d8af5b',
                weight: 1
            }
        },
        {
            data: {
                source: '26514314-d60c-4206-b6da-bf494cfd496c',
                target: 'f9192b97-2255-48fb-bada-e2c521d8af5b',
                weight: 1
            }
        },
        {
            data: {
                source: '229e0fd9-7288-4aa8-b7df-b5bd05606ec7',
                target: 'f9192b97-2255-48fb-bada-e2c521d8af5b',
                weight: 1
            }
        },
        {
            data: {
                source: 'cb976839-8c60-4b60-aadd-8a03c469644f',
                target: 'f9192b97-2255-48fb-bada-e2c521d8af5b',
                weight: 1
            }
        },
        {
            data: {
                source: 'a24e22fe-78f1-4693-8d28-db9e269a803b',
                target: 'f9192b97-2255-48fb-bada-e2c521d8af5b',
                weight: 1
            }
        },
        {
            data: {
                source: '05dc1477-72c0-4d5b-b16b-b0ed62aab470',
                target: 'f9192b97-2255-48fb-bada-e2c521d8af5b',
                weight: 1
            }
        },
        {
            data: {
                source: '2a2a30db-97a9-4bb3-9b45-0049bf6fd7ff',
                target: 'f9192b97-2255-48fb-bada-e2c521d8af5b',
                weight: 1
            }
        },
        {
            data: {
                source: '8f955305-f8db-4c06-a068-ea33aee262db',
                target: 'f9192b97-2255-48fb-bada-e2c521d8af5b',
                weight: 1
            }
        },
        {
            data: {
                source: 'b95f6ab7-eaee-4864-8098-38086493fa03',
                target: 'f9192b97-2255-48fb-bada-e2c521d8af5b',
                weight: 1
            }
        },
        {
            data: {
                source: 'dcc84f10-72e0-482d-be60-f244abe97c89',
                target: 'f9192b97-2255-48fb-bada-e2c521d8af5b',
                weight: 1
            }
        },
        {
            data: {
                source: 'ad3ebc68-9c24-412a-b505-142eb9795158',
                target: 'f9192b97-2255-48fb-bada-e2c521d8af5b',
                weight: 1
            }
        },
        {
            data: {
                source: 'd7387748-08a5-4fb3-95c5-9a1ac90ee689',
                target: 'f9192b97-2255-48fb-bada-e2c521d8af5b',
                weight: 1
            }
        },
        {
            data: {
                source: 'e39f6124-f00d-4a6e-b1d9-35490cdf724b',
                target: 'f9192b97-2255-48fb-bada-e2c521d8af5b',
                weight: 1
            }
        },
        {
            data: {
                source: '945b5ac2-e24a-49da-8412-20085528a3a9',
                target: 'f9192b97-2255-48fb-bada-e2c521d8af5b',
                weight: 1
            }
        },
        {
            data: {
                source: '8df345bb-2e69-45de-bc09-62a8c3e01c1c',
                target: 'f9192b97-2255-48fb-bada-e2c521d8af5b',
                weight: 1
            }
        },
        {
            data: {
                source: 'e79ea4dd-8556-446d-9086-475175c9af8e',
                target: 'f9192b97-2255-48fb-bada-e2c521d8af5b',
                weight: 1
            }
        },
        {
            data: {
                source: '4b3ef796-b4b6-4fef-9edf-ff892f083500',
                target: 'f9192b97-2255-48fb-bada-e2c521d8af5b',
                weight: 1
            }
        },
        {
            data: {
                source: '421187fd-99d3-4cdb-bd93-2d97e20fc508',
                target: 'f9192b97-2255-48fb-bada-e2c521d8af5b',
                weight: 1
            }
        },
        {
            data: {
                source: '9853b7af-c9cb-4f91-955d-553ef49167a9',
                target: 'f9192b97-2255-48fb-bada-e2c521d8af5b',
                weight: 1
            }
        },
        {
            data: {
                source: 'b6bce107-268a-45c9-b326-86140e5c76e0',
                target: 'f9192b97-2255-48fb-bada-e2c521d8af5b',
                weight: 1
            }
        },
        {
            data: {
                source: 'd17d9ff7-cbe0-449a-b0c8-283f14edb2eb',
                target: 'f9192b97-2255-48fb-bada-e2c521d8af5b',
                weight: 1
            }
        },
        {
            data: {
                source: '7c10e7a1-f3c2-4da1-a8cc-cb85581ef257',
                target: 'f9192b97-2255-48fb-bada-e2c521d8af5b',
                weight: 1
            }
        },
        {
            data: {
                source: 'a6db2c99-7673-4e92-92de-cd59063692bb',
                target: 'f9192b97-2255-48fb-bada-e2c521d8af5b',
                weight: 1
            }
        },
        {
            data: {
                source: 'e467091b-7493-4db0-a8c8-e2a27f41657f',
                target: 'fa4eb288-df1a-45c6-a922-daaea5c40c49',
                weight: 1
            }
        },
        {
            data: {
                source: '7593fa16-8ce3-472f-ad59-e924c392679e',
                target: 'fa4eb288-df1a-45c6-a922-daaea5c40c49',
                weight: 1
            }
        },
        {
            data: {
                source: 'e382a22d-2331-4e8d-b949-eb75e393fe0b',
                target: 'fa4eb288-df1a-45c6-a922-daaea5c40c49',
                weight: 1
            }
        },
        {
            data: {
                source: '014be81e-265e-48c3-9e5d-2d6fe0d68158',
                target: 'cdb8881e-1799-4640-a1d5-0e510f155adc',
                weight: 1
            }
        },
        {
            data: {
                source: '014be81e-265e-48c3-9e5d-2d6fe0d68158',
                target: '9aeb5db7-6f2f-414f-aa65-7ccaa095da6e',
                weight: 1
            }
        },
        {
            data: {
                source: '014be81e-265e-48c3-9e5d-2d6fe0d68158',
                target: '4ea193ca-720f-403d-81eb-45a644357674',
                weight: 1
            }
        },
        {
            data: {
                source: '014be81e-265e-48c3-9e5d-2d6fe0d68158',
                target: '87a728c8-6d99-4b4b-86a4-cae2e7719ad7',
                weight: 1
            }
        },
        {
            data: {
                source: '014be81e-265e-48c3-9e5d-2d6fe0d68158',
                target: '687571ce-f8dc-42fb-ad8a-5e2d17f6fcc3',
                weight: 1
            }
        },
        {
            data: {
                source: '014be81e-265e-48c3-9e5d-2d6fe0d68158',
                target: '5455d47c-5c8b-4c8d-9445-5edb86c50ea0',
                weight: 1
            }
        },
        {
            data: {
                source: '014be81e-265e-48c3-9e5d-2d6fe0d68158',
                target: 'd36bcf4f-d5d7-416f-a5c0-5a7984a13e04',
                weight: 1
            }
        },
        {
            data: {
                source: '014be81e-265e-48c3-9e5d-2d6fe0d68158',
                target: '876af611-e551-4975-b263-8203b16fb159',
                weight: 1
            }
        },
        {
            data: {
                source: '014be81e-265e-48c3-9e5d-2d6fe0d68158',
                target: '2e55c550-f65c-483a-a2e8-c4ac189fa976',
                weight: 1
            }
        },
        {
            data: {
                source: '014be81e-265e-48c3-9e5d-2d6fe0d68158',
                target: 'f2b6ef01-102c-4495-9bd8-594acec39630',
                weight: 1
            }
        },
        {
            data: {
                source: '014be81e-265e-48c3-9e5d-2d6fe0d68158',
                target: 'fe8bb495-1770-4356-af0d-d6f50643a37f',
                weight: 2
            }
        },
        {
            data: {
                source: '014be81e-265e-48c3-9e5d-2d6fe0d68158',
                target: 'b427eb80-c835-4093-af53-e1dea6664ba7',
                weight: 2
            }
        },
        {
            data: {
                source: '014be81e-265e-48c3-9e5d-2d6fe0d68158',
                target: 'a068db1b-fb03-402b-a344-9840e65b82a1',
                weight: 1
            }
        },
        {
            data: {
                source: '014be81e-265e-48c3-9e5d-2d6fe0d68158',
                target: '022ec78c-ee39-4db7-8212-aaea0a3c39a8',
                weight: 1
            }
        },
        {
            data: {
                source: '014be81e-265e-48c3-9e5d-2d6fe0d68158',
                target: 'c6f5f652-7adb-4a86-a890-0df99a657de2',
                weight: 1
            }
        },
        {
            data: {
                source: '014be81e-265e-48c3-9e5d-2d6fe0d68158',
                target: '7bcfd68f-5920-423f-be89-9003841b384d',
                weight: 1
            }
        },
        {
            data: {
                source: '014be81e-265e-48c3-9e5d-2d6fe0d68158',
                target: '8f0ed82e-1962-4478-b46e-4f009cf48de4',
                weight: 1
            }
        },
        {
            data: {
                source: '014be81e-265e-48c3-9e5d-2d6fe0d68158',
                target: '077bce4a-05e0-428b-b1ee-ac61be011cbf',
                weight: 1
            }
        },
        {
            data: {
                source: '014be81e-265e-48c3-9e5d-2d6fe0d68158',
                target: '3435e6cb-a1c4-464d-a8ae-c8247fdf5da5',
                weight: 1
            }
        },
        {
            data: {
                source: '014be81e-265e-48c3-9e5d-2d6fe0d68158',
                target: 'dc7e89c1-b92b-4a7b-88bd-a4a27867c44f',
                weight: 1
            }
        },
        {
            data: {
                source: '03b2cfe3-dad1-4419-b4a3-c02554e4dd6a',
                target: '8efc2076-6416-4017-a4ab-a8192013602d',
                weight: 2
            }
        },
        {
            data: {
                source: '03b2cfe3-dad1-4419-b4a3-c02554e4dd6a',
                target: 'd3760408-517f-4395-880f-cc60e176213d',
                weight: 1
            }
        },
        {
            data: {
                source: '03b2cfe3-dad1-4419-b4a3-c02554e4dd6a',
                target: 'f874731e-a939-40df-957d-38e52462bb35',
                weight: 1
            }
        },
        {
            data: {
                source: '03bd9d1f-2d7f-40d1-89a2-6f75c85bfe3e',
                target: '95af41b4-5299-4de1-a462-bf07815b2585',
                weight: 1
            }
        },
        {
            data: {
                source: '03bd9d1f-2d7f-40d1-89a2-6f75c85bfe3e',
                target: '61995c43-27e4-421e-b146-9ec4587d41e7',
                weight: 1
            }
        },
        {
            data: {
                source: '03bd9d1f-2d7f-40d1-89a2-6f75c85bfe3e',
                target: '7126b683-be1f-4040-a40f-c20246cf4ef5',
                weight: 1
            }
        },
        {
            data: {
                source: '0508b003-b753-4871-a80f-a91767875180',
                target: '7ec4d32a-7544-4d34-b890-bb5c54d7edce',
                weight: 1
            }
        },
        {
            data: {
                source: '0508b003-b753-4871-a80f-a91767875180',
                target: 'd88f42c4-d3bb-4118-b7c1-5cc59cf296e7',
                weight: 1
            }
        },
        {
            data: {
                source: '0508b003-b753-4871-a80f-a91767875180',
                target: '34d64bf2-9ff9-45c9-84bd-1d106730a5a7',
                weight: 1
            }
        },
        {
            data: {
                source: '0508b003-b753-4871-a80f-a91767875180',
                target: 'e64ef54e-4ba3-4e19-ba00-7fc93be4acae',
                weight: 1
            }
        },
        {
            data: {
                source: '077bce4a-05e0-428b-b1ee-ac61be011cbf',
                target: '014be81e-265e-48c3-9e5d-2d6fe0d68158',
                weight: 1
            }
        },
        {
            data: {
                source: '077bce4a-05e0-428b-b1ee-ac61be011cbf',
                target: '69f87e0f-e2c3-45cf-ac25-6fcb834eb1b4',
                weight: 2
            }
        },
        {
            data: {
                source: '077bce4a-05e0-428b-b1ee-ac61be011cbf',
                target: 'dc7e89c1-b92b-4a7b-88bd-a4a27867c44f',
                weight: 1
            }
        },
        {
            data: {
                source: '078031f7-5cbc-4b4f-92d0-00a04ea0fe3e',
                target: '990626ee-f14f-4151-91c1-44e4047e29ab',
                weight: 2
            }
        },
        {
            data: {
                source: '078031f7-5cbc-4b4f-92d0-00a04ea0fe3e',
                target: '5800677f-0020-432e-8ac5-cb93004f302f',
                weight: 2
            }
        },
        {
            data: {
                source: '078031f7-5cbc-4b4f-92d0-00a04ea0fe3e',
                target: '7f55cf94-78e0-4c00-9222-e405d600e979',
                weight: 2
            }
        },
        {
            data: {
                source: '078031f7-5cbc-4b4f-92d0-00a04ea0fe3e',
                target: '9c91d612-08c7-482b-a274-6a3208a0d7a5',
                weight: 2
            }
        },
        {
            data: {
                source: '078031f7-5cbc-4b4f-92d0-00a04ea0fe3e',
                target: 'e4e7abc6-1766-4c75-a7ef-3505b43f0322',
                weight: 2
            }
        },
        {
            data: {
                source: '078031f7-5cbc-4b4f-92d0-00a04ea0fe3e',
                target: '1b56d550-444d-4067-a34a-34778e2dda61',
                weight: 1
            }
        },
        {
            data: {
                source: '078031f7-5cbc-4b4f-92d0-00a04ea0fe3e',
                target: '3d0d7062-9397-4bd0-a3d5-f3bb0538c3f2',
                weight: 1
            }
        },
        {
            data: {
                source: '078031f7-5cbc-4b4f-92d0-00a04ea0fe3e',
                target: '54f7d604-b2b7-4ac4-bc96-fc169a366af7',
                weight: 1
            }
        },
        {
            data: {
                source: '078031f7-5cbc-4b4f-92d0-00a04ea0fe3e',
                target: '3ee822f1-3432-4df1-92d5-3acaa8f48c45',
                weight: 1
            }
        },
        {
            data: {
                source: '078031f7-5cbc-4b4f-92d0-00a04ea0fe3e',
                target: '86d7d728-7f68-4e9e-8319-6274cd1e3049',
                weight: 1
            }
        },
        {
            data: {
                source: '078031f7-5cbc-4b4f-92d0-00a04ea0fe3e',
                target: 'f1772b99-3cf3-407c-81d2-a523d23aeef2',
                weight: 1
            }
        },
        {
            data: {
                source: '078031f7-5cbc-4b4f-92d0-00a04ea0fe3e',
                target: '181e4c8d-cb21-49e3-8ff4-1cd1d3293bbf',
                weight: 1
            }
        },
        {
            data: {
                source: '078031f7-5cbc-4b4f-92d0-00a04ea0fe3e',
                target: 'e0bba579-dd5a-45fa-b3e5-d2a90077fa1b',
                weight: 1
            }
        },
        {
            data: {
                source: '078031f7-5cbc-4b4f-92d0-00a04ea0fe3e',
                target: '881c5607-f6e1-4313-9905-b3531c276f5e',
                weight: 1
            }
        },
        {
            data: {
                source: '078031f7-5cbc-4b4f-92d0-00a04ea0fe3e',
                target: '7585bb54-b33d-4d63-ab0b-bde01248b475',
                weight: 1
            }
        },
        {
            data: {
                source: '078031f7-5cbc-4b4f-92d0-00a04ea0fe3e',
                target: '44c03cd5-51bf-436d-8fe3-1cfb6d5caec4',
                weight: 1
            }
        },
        {
            data: {
                source: '078031f7-5cbc-4b4f-92d0-00a04ea0fe3e',
                target: '8552fae0-1c87-43f6-b0cb-81b5e9baa0e3',
                weight: 1
            }
        },
        {
            data: {
                source: '078031f7-5cbc-4b4f-92d0-00a04ea0fe3e',
                target: 'd7deccc7-19aa-4ce9-bb82-e3caafc8159e',
                weight: 1
            }
        },
        {
            data: {
                source: '078031f7-5cbc-4b4f-92d0-00a04ea0fe3e',
                target: '3cb46640-6821-4f97-8042-37ea06443059',
                weight: 1
            }
        },
        {
            data: {
                source: '078031f7-5cbc-4b4f-92d0-00a04ea0fe3e',
                target: 'd88f42c4-d3bb-4118-b7c1-5cc59cf296e7',
                weight: 1
            }
        },
        {
            data: {
                source: '078031f7-5cbc-4b4f-92d0-00a04ea0fe3e',
                target: '2ae7db37-a3dd-4e5d-b033-d37c7ad1b971',
                weight: 1
            }
        },
        {
            data: {
                source: '078031f7-5cbc-4b4f-92d0-00a04ea0fe3e',
                target: '5fa88ac0-d590-4453-8d66-05ae9ff01c02',
                weight: 1
            }
        },
        {
            data: {
                source: '093bf486-67c1-4cb1-b64d-e7b0b0cd3f01',
                target: 'e12cc565-6b06-4844-acc4-fa266c64b704',
                weight: 1
            }
        },
        {
            data: {
                source: '093bf486-67c1-4cb1-b64d-e7b0b0cd3f01',
                target: '43092fdf-5d85-408e-bf99-fe9ed835a839',
                weight: 1
            }
        },
        {
            data: {
                source: '093bf486-67c1-4cb1-b64d-e7b0b0cd3f01',
                target: '20e699f4-bc3e-4d0f-a98c-510c3e9c85dc',
                weight: 1
            }
        },
        {
            data: {
                source: '0da03bac-54bb-4838-8a7e-5a0f8c20e72a',
                target: 'e17afbee-7c39-4e86-aaf7-d7acde5544f5',
                weight: 1
            }
        },
        {
            data: {
                source: '0da03bac-54bb-4838-8a7e-5a0f8c20e72a',
                target: 'f5287ca3-bb92-4ce7-a026-7f62d5f66ced',
                weight: 1
            }
        },
        {
            data: {
                source: '0da03bac-54bb-4838-8a7e-5a0f8c20e72a',
                target: '20e699f4-bc3e-4d0f-a98c-510c3e9c85dc',
                weight: 1
            }
        },
        {
            data: {
                source: '0da03bac-54bb-4838-8a7e-5a0f8c20e72a',
                target: '81f899d5-0754-4ec9-9354-900fe8017b26',
                weight: 1
            }
        },
        {
            data: {
                source: '14ddfe78-6940-483c-8066-5e0075f0f673',
                target: '95af41b4-5299-4de1-a462-bf07815b2585',
                weight: 1
            }
        },
        {
            data: {
                source: '16bb79db-c4b7-4e3f-a550-b2732603d4e9',
                target: '0affe09b-3246-4c32-8c93-9b0ae2027ce8',
                weight: 1
            }
        },
        {
            data: {
                source: '181e4c8d-cb21-49e3-8ff4-1cd1d3293bbf',
                target: '078031f7-5cbc-4b4f-92d0-00a04ea0fe3e',
                weight: 1
            }
        },
        {
            data: {
                source: '1b56d550-444d-4067-a34a-34778e2dda61',
                target: '078031f7-5cbc-4b4f-92d0-00a04ea0fe3e',
                weight: 1
            }
        },
        {
            data: {
                source: '1f2298a7-1ad2-4725-8662-d4f4e7ada61c',
                target: 'f874731e-a939-40df-957d-38e52462bb35',
                weight: 1
            }
        },
        {
            data: {
                source: '1f2298a7-1ad2-4725-8662-d4f4e7ada61c',
                target: 'e113bba6-43bf-486d-a8fa-5017745e7af9',
                weight: 1
            }
        },
        {
            data: {
                source: '220a3eea-826a-4163-8b97-7c05b4185b44',
                target: 'c8bc376f-6e07-42c2-8abd-47ac965b62ba',
                weight: 1
            }
        },
        {
            data: {
                source: '229e0fd9-7288-4aa8-b7df-b5bd05606ec7',
                target: '7bcfd68f-5920-423f-be89-9003841b384d',
                weight: 1
            }
        },
        {
            data: {
                source: '238e9b4d-e785-4837-85e1-44ca55967008',
                target: '7126b683-be1f-4040-a40f-c20246cf4ef5',
                weight: 2
            }
        },
        {
            data: {
                source: '238e9b4d-e785-4837-85e1-44ca55967008',
                target: '8751cf98-83be-45c4-9b6b-5549391cab1c',
                weight: 1
            }
        },
        {
            data: {
                source: '23b7e4ac-f6ae-4cf8-b151-a19f2ce0d36f',
                target: '7193e1e0-d071-4bc2-a04c-70f0e45a7ae0',
                weight: 1
            }
        },
        {
            data: {
                source: '2a0c4087-0a56-4d77-8851-6d6d58be6159',
                target: 'd88f42c4-d3bb-4118-b7c1-5cc59cf296e7',
                weight: 2
            }
        },
        {
            data: {
                source: '2a2a30db-97a9-4bb3-9b45-0049bf6fd7ff',
                target: '022ec78c-ee39-4db7-8212-aaea0a3c39a8',
                weight: 1
            }
        },
        {
            data: {
                source: '2a2a30db-97a9-4bb3-9b45-0049bf6fd7ff',
                target: '49301c65-06b9-4927-8b3c-a8bcaa7ac638',
                weight: 1
            }
        },
        {
            data: {
                source: '2a2a30db-97a9-4bb3-9b45-0049bf6fd7ff',
                target: '7585bb54-b33d-4d63-ab0b-bde01248b475',
                weight: 1
            }
        },
        {
            data: {
                source: '2a2a30db-97a9-4bb3-9b45-0049bf6fd7ff',
                target: '7a1b402c-c342-4dce-8924-bb30d69c72d4',
                weight: 1
            }
        },
        {
            data: {
                source: '2a2a30db-97a9-4bb3-9b45-0049bf6fd7ff',
                target: '86d7d728-7f68-4e9e-8319-6274cd1e3049',
                weight: 1
            }
        },
        {
            data: {
                source: '2a2a30db-97a9-4bb3-9b45-0049bf6fd7ff',
                target: '95af41b4-5299-4de1-a462-bf07815b2585',
                weight: 1
            }
        },
        {
            data: {
                source: '2a2a30db-97a9-4bb3-9b45-0049bf6fd7ff',
                target: 'a81d9b3a-aa5c-4d0e-97d8-259acdf5b281',
                weight: 1
            }
        },
        {
            data: {
                source: '2a2a30db-97a9-4bb3-9b45-0049bf6fd7ff',
                target: 'c6f5f652-7adb-4a86-a890-0df99a657de2',
                weight: 1
            }
        },
        {
            data: {
                source: '2a2a30db-97a9-4bb3-9b45-0049bf6fd7ff',
                target: 'e0bba579-dd5a-45fa-b3e5-d2a90077fa1b',
                weight: 1
            }
        },
        {
            data: {
                source: '2a2a30db-97a9-4bb3-9b45-0049bf6fd7ff',
                target: 'ed0d3731-1686-410b-9808-1190b45173af',
                weight: 1
            }
        },
        {
            data: {
                source: '2ae7db37-a3dd-4e5d-b033-d37c7ad1b971',
                target: '8e13fe14-7227-4f32-b110-fd5c10f5e779',
                weight: 3
            }
        },
        {
            data: {
                source: '2ae7db37-a3dd-4e5d-b033-d37c7ad1b971',
                target: '9b28d784-3a0c-4091-901a-4833c234f421',
                weight: 3
            }
        },
        {
            data: {
                source: '2ae7db37-a3dd-4e5d-b033-d37c7ad1b971',
                target: '1d9f0970-b41a-48cc-ae80-e025173d8881',
                weight: 3
            }
        },
        {
            data: {
                source: '2ae7db37-a3dd-4e5d-b033-d37c7ad1b971',
                target: '1b56d550-444d-4067-a34a-34778e2dda61',
                weight: 1
            }
        },
        {
            data: {
                source: '2ae7db37-a3dd-4e5d-b033-d37c7ad1b971',
                target: 'da085a72-69a2-4fc2-b6ad-f13a28275daa',
                weight: 2
            }
        },
        {
            data: {
                source: '2ae7db37-a3dd-4e5d-b033-d37c7ad1b971',
                target: '881c5607-f6e1-4313-9905-b3531c276f5e',
                weight: 1
            }
        },
        {
            data: {
                source: '2ae7db37-a3dd-4e5d-b033-d37c7ad1b971',
                target: '078031f7-5cbc-4b4f-92d0-00a04ea0fe3e',
                weight: 1
            }
        },
        {
            data: {
                source: '2ae7db37-a3dd-4e5d-b033-d37c7ad1b971',
                target: '2a2a30db-97a9-4bb3-9b45-0049bf6fd7ff',
                weight: 1
            }
        },
        {
            data: {
                source: '2ae7db37-a3dd-4e5d-b033-d37c7ad1b971',
                target: 'c67fe0ec-25dd-425a-ac37-af10a4d80463',
                weight: 1
            }
        },
        {
            data: {
                source: '329a0014-76e0-4c01-bf4e-2eaab9a80477',
                target: '3ee822f1-3432-4df1-92d5-3acaa8f48c45',
                weight: 3
            }
        },
        {
            data: {
                source: '329a0014-76e0-4c01-bf4e-2eaab9a80477',
                target: 'c122c8ad-d13e-43c1-a69c-7a0b67512b2c',
                weight: 1
            }
        },
        {
            data: {
                source: '329a0014-76e0-4c01-bf4e-2eaab9a80477',
                target: 'd88f42c4-d3bb-4118-b7c1-5cc59cf296e7',
                weight: 2
            }
        },
        {
            data: {
                source: '329a0014-76e0-4c01-bf4e-2eaab9a80477',
                target: '964609fe-10d0-4eab-af64-5e4a1b6ccc9f',
                weight: 1
            }
        },
        {
            data: {
                source: '329a0014-76e0-4c01-bf4e-2eaab9a80477',
                target: '5e0a5b1f-7ada-4616-b8c1-b2685fe1768b',
                weight: 1
            }
        },
        {
            data: {
                source: '329a0014-76e0-4c01-bf4e-2eaab9a80477',
                target: '8552fae0-1c87-43f6-b0cb-81b5e9baa0e3',
                weight: 1
            }
        },
        {
            data: {
                source: '329a0014-76e0-4c01-bf4e-2eaab9a80477',
                target: '1b56d550-444d-4067-a34a-34778e2dda61',
                weight: 1
            }
        },
        {
            data: {
                source: '329a0014-76e0-4c01-bf4e-2eaab9a80477',
                target: '687b79e2-b062-4f75-8762-1f7b7d433454',
                weight: 1
            }
        },
        {
            data: {
                source: '34d64bf2-9ff9-45c9-84bd-1d106730a5a7',
                target: '52378476-f915-4d52-8879-d362780dd927',
                weight: 1
            }
        },
        {
            data: {
                source: '34d64bf2-9ff9-45c9-84bd-1d106730a5a7',
                target: '7f251ce9-ed23-4bc8-919f-985f6338cfd8',
                weight: 1
            }
        },
        {
            data: {
                source: '34d64bf2-9ff9-45c9-84bd-1d106730a5a7',
                target: 'f7bc697e-fb9a-4d73-ad6f-52413cf03e80',
                weight: 1
            }
        },
        {
            data: {
                source: '34d64bf2-9ff9-45c9-84bd-1d106730a5a7',
                target: '7c75258d-3582-452c-aef8-cf2d7bee4c2f',
                weight: 1
            }
        },
        {
            data: {
                source: '34d64bf2-9ff9-45c9-84bd-1d106730a5a7',
                target: 'd1551235-1ba4-47e1-a46e-ee6be7099aed',
                weight: 1
            }
        },
        {
            data: {
                source: '34d64bf2-9ff9-45c9-84bd-1d106730a5a7',
                target: '7336ef8a-eed6-4bc0-9f11-4479a5a7396a',
                weight: 1
            }
        },
        {
            data: {
                source: '34d64bf2-9ff9-45c9-84bd-1d106730a5a7',
                target: '24a61050-7a43-4cbd-bbb0-bc52c8ef3e8b',
                weight: 1
            }
        },
        {
            data: {
                source: '34d64bf2-9ff9-45c9-84bd-1d106730a5a7',
                target: 'ec6d2d72-a177-421e-b0ed-0b9440b52cf5',
                weight: 1
            }
        },
        {
            data: {
                source: '34d64bf2-9ff9-45c9-84bd-1d106730a5a7',
                target: 'c1955421-8cf1-466c-9885-3dbd0276f8f6',
                weight: 1
            }
        },
        {
            data: {
                source: '34d64bf2-9ff9-45c9-84bd-1d106730a5a7',
                target: '2e18c93d-3363-454e-84b1-1c39f6825eab',
                weight: 1
            }
        },
        {
            data: {
                source: '34d64bf2-9ff9-45c9-84bd-1d106730a5a7',
                target: 'dee18e15-3b52-4310-8767-4d93f3a8ddb3',
                weight: 1
            }
        },
        {
            data: {
                source: '34d64bf2-9ff9-45c9-84bd-1d106730a5a7',
                target: '314bc9b8-095d-47b1-9811-16e45e1bdd31',
                weight: 1
            }
        },
        {
            data: {
                source: '34d64bf2-9ff9-45c9-84bd-1d106730a5a7',
                target: '6789886c-3883-4df1-9001-65a1a7cea16a',
                weight: 1
            }
        },
        {
            data: {
                source: '34d64bf2-9ff9-45c9-84bd-1d106730a5a7',
                target: '281f0443-f5f4-4742-a993-8e3031550944',
                weight: 1
            }
        },
        {
            data: {
                source: '34d64bf2-9ff9-45c9-84bd-1d106730a5a7',
                target: 'd8bf8b7d-51e2-45d7-bd63-fe55c3cd5b91',
                weight: 1
            }
        },
        {
            data: {
                source: '34d64bf2-9ff9-45c9-84bd-1d106730a5a7',
                target: '79c9af5a-03b0-4eb7-a887-1b6ce9d36bef',
                weight: 1
            }
        },
        {
            data: {
                source: '34d64bf2-9ff9-45c9-84bd-1d106730a5a7',
                target: '6c034c72-1c98-4a12-a53f-deba52c838f9',
                weight: 1
            }
        },
        {
            data: {
                source: '34d64bf2-9ff9-45c9-84bd-1d106730a5a7',
                target: 'a1202d49-589b-4bfc-ae6c-f109fff5cbcb',
                weight: 1
            }
        },
        {
            data: {
                source: '34d64bf2-9ff9-45c9-84bd-1d106730a5a7',
                target: '5fa88ac0-d590-4453-8d66-05ae9ff01c02',
                weight: 2
            }
        },
        {
            data: {
                source: '34d64bf2-9ff9-45c9-84bd-1d106730a5a7',
                target: '3d6f0b72-4378-4511-9bae-7ba17d585ab3',
                weight: 1
            }
        },
        {
            data: {
                source: '34d64bf2-9ff9-45c9-84bd-1d106730a5a7',
                target: '7de9777f-9da6-4e3b-bd45-380c7789cbfc',
                weight: 1
            }
        },
        {
            data: {
                source: '34d64bf2-9ff9-45c9-84bd-1d106730a5a7',
                target: '4cfc5e47-e3df-422e-a22d-666358cfbabd',
                weight: 1
            }
        },
        {
            data: {
                source: '34d64bf2-9ff9-45c9-84bd-1d106730a5a7',
                target: 'e1cc2fdd-2fae-4818-8222-49a280e888c6',
                weight: 1
            }
        },
        {
            data: {
                source: '34d64bf2-9ff9-45c9-84bd-1d106730a5a7',
                target: '7ec4d32a-7544-4d34-b890-bb5c54d7edce',
                weight: 1
            }
        },
        {
            data: {
                source: '34d64bf2-9ff9-45c9-84bd-1d106730a5a7',
                target: 'b30c4d77-93b3-4fd8-9b97-1ce0ed588681',
                weight: 1
            }
        },
        {
            data: {
                source: '34d64bf2-9ff9-45c9-84bd-1d106730a5a7',
                target: '043efcdf-6c21-4957-9bbf-b1fefb68eb3d',
                weight: 1
            }
        },
        {
            data: {
                source: '34d64bf2-9ff9-45c9-84bd-1d106730a5a7',
                target: '6c1a7fcf-cf2c-484f-a580-16ba405771e9',
                weight: 1
            }
        },
        {
            data: {
                source: '34d64bf2-9ff9-45c9-84bd-1d106730a5a7',
                target: 'ef612b89-431c-4495-90cc-72448adc9f1a',
                weight: 1
            }
        },
        {
            data: {
                source: '3cb46640-6821-4f97-8042-37ea06443059',
                target: 'fe8bb495-1770-4356-af0d-d6f50643a37f',
                weight: 1
            }
        },
        {
            data: {
                source: '3cb46640-6821-4f97-8042-37ea06443059',
                target: '7bcfd68f-5920-423f-be89-9003841b384d',
                weight: 1
            }
        },
        {
            data: {
                source: '3cb46640-6821-4f97-8042-37ea06443059',
                target: 'e9d17a68-3295-47f3-a339-2246963f42e6',
                weight: 3
            }
        },
        {
            data: {
                source: '3cb46640-6821-4f97-8042-37ea06443059',
                target: '078031f7-5cbc-4b4f-92d0-00a04ea0fe3e',
                weight: 1
            }
        },
        {
            data: {
                source: '3cb46640-6821-4f97-8042-37ea06443059',
                target: '44c03cd5-51bf-436d-8fe3-1cfb6d5caec4',
                weight: 1
            }
        },
        {
            data: {
                source: '3d0d7062-9397-4bd0-a3d5-f3bb0538c3f2',
                target: '44c03cd5-51bf-436d-8fe3-1cfb6d5caec4',
                weight: 1
            }
        },
        {
            data: {
                source: '3d0d7062-9397-4bd0-a3d5-f3bb0538c3f2',
                target: '078031f7-5cbc-4b4f-92d0-00a04ea0fe3e',
                weight: 1
            }
        },
        {
            data: {
                source: '3d6f0b72-4378-4511-9bae-7ba17d585ab3',
                target: 'a81d9b3a-aa5c-4d0e-97d8-259acdf5b281',
                weight: 1
            }
        },
        {
            data: {
                source: '3d6f0b72-4378-4511-9bae-7ba17d585ab3',
                target: 'cb7cf108-f6a5-48a9-b9b1-37ae64f396a1',
                weight: 1
            }
        },
        {
            data: {
                source: '3ee822f1-3432-4df1-92d5-3acaa8f48c45',
                target: '5fa88ac0-d590-4453-8d66-05ae9ff01c02',
                weight: 1
            }
        },
        {
            data: {
                source: '3ee822f1-3432-4df1-92d5-3acaa8f48c45',
                target: 'd7deccc7-19aa-4ce9-bb82-e3caafc8159e',
                weight: 1
            }
        },
        {
            data: {
                source: '3ee822f1-3432-4df1-92d5-3acaa8f48c45',
                target: '990626ee-f14f-4151-91c1-44e4047e29ab',
                weight: 1
            }
        },
        {
            data: {
                source: '3ee822f1-3432-4df1-92d5-3acaa8f48c45',
                target: '078031f7-5cbc-4b4f-92d0-00a04ea0fe3e',
                weight: 1
            }
        },
        {
            data: {
                source: '3ee822f1-3432-4df1-92d5-3acaa8f48c45',
                target: '329a0014-76e0-4c01-bf4e-2eaab9a80477',
                weight: 1
            }
        },
        {
            data: {
                source: '44c03cd5-51bf-436d-8fe3-1cfb6d5caec4',
                target: '80cc0e6e-f11b-48f4-bb00-54d504029652',
                weight: 1
            }
        },
        {
            data: {
                source: '44c03cd5-51bf-436d-8fe3-1cfb6d5caec4',
                target: '220a3eea-826a-4163-8b97-7c05b4185b44',
                weight: 1
            }
        },
        {
            data: {
                source: '44c03cd5-51bf-436d-8fe3-1cfb6d5caec4',
                target: '8552fae0-1c87-43f6-b0cb-81b5e9baa0e3',
                weight: 6
            }
        },
        {
            data: {
                source: '44c03cd5-51bf-436d-8fe3-1cfb6d5caec4',
                target: 'd7deccc7-19aa-4ce9-bb82-e3caafc8159e',
                weight: 6
            }
        },
        {
            data: {
                source: '44c03cd5-51bf-436d-8fe3-1cfb6d5caec4',
                target: 'c8bc376f-6e07-42c2-8abd-47ac965b62ba',
                weight: 2
            }
        },
        {
            data: {
                source: '44c03cd5-51bf-436d-8fe3-1cfb6d5caec4',
                target: '49301c65-06b9-4927-8b3c-a8bcaa7ac638',
                weight: 2
            }
        },
        {
            data: {
                source: '44c03cd5-51bf-436d-8fe3-1cfb6d5caec4',
                target: '32c2a8cf-4588-4b74-b32f-de377e5dc31e',
                weight: 2
            }
        },
        {
            data: {
                source: '44c03cd5-51bf-436d-8fe3-1cfb6d5caec4',
                target: '078031f7-5cbc-4b4f-92d0-00a04ea0fe3e',
                weight: 1
            }
        },
        {
            data: {
                source: '44c03cd5-51bf-436d-8fe3-1cfb6d5caec4',
                target: '3d0d7062-9397-4bd0-a3d5-f3bb0538c3f2',
                weight: 1
            }
        },
        {
            data: {
                source: '44c03cd5-51bf-436d-8fe3-1cfb6d5caec4',
                target: '7585bb54-b33d-4d63-ab0b-bde01248b475',
                weight: 1
            }
        },
        {
            data: {
                source: '48b1073b-c4d1-411b-b9bb-9fe389df84bd',
                target: 'b84dd58b-51e0-424a-b2e6-cdf391f3eb48',
                weight: 1
            }
        },
        {
            data: {
                source: '48b1073b-c4d1-411b-b9bb-9fe389df84bd',
                target: 'aacf2b9c-a181-4dc5-afa3-a72f3004c306',
                weight: 1
            }
        },
        {
            data: {
                source: '48b1073b-c4d1-411b-b9bb-9fe389df84bd',
                target: '31356c83-6804-4403-864e-637f0296f4cb',
                weight: 1
            }
        },
        {
            data: {
                source: '48b1073b-c4d1-411b-b9bb-9fe389df84bd',
                target: 'cdf853ea-0f2b-4a67-8de2-001d3f34c264',
                weight: 1
            }
        },
        {
            data: {
                source: '4b57c07b-f3f4-4e1b-925f-a719d07451aa',
                target: '7db79ff9-82b5-43b8-96a7-43e2abbf1b42',
                weight: 1
            }
        },
        {
            data: {
                source: '4b57c07b-f3f4-4e1b-925f-a719d07451aa',
                target: 'c122c8ad-d13e-43c1-a69c-7a0b67512b2c',
                weight: 2
            }
        },
        {
            data: {
                source: '4b57c07b-f3f4-4e1b-925f-a719d07451aa',
                target: '7a1b402c-c342-4dce-8924-bb30d69c72d4',
                weight: 1
            }
        },
        {
            data: {
                source: '4b57c07b-f3f4-4e1b-925f-a719d07451aa',
                target: 'f1772b99-3cf3-407c-81d2-a523d23aeef2',
                weight: 1
            }
        },
        {
            data: {
                source: '4b57c07b-f3f4-4e1b-925f-a719d07451aa',
                target: 'd88f42c4-d3bb-4118-b7c1-5cc59cf296e7',
                weight: 1
            }
        },
        {
            data: {
                source: '4b57c07b-f3f4-4e1b-925f-a719d07451aa',
                target: '5fa88ac0-d590-4453-8d66-05ae9ff01c02',
                weight: 2
            }
        },
        {
            data: {
                source: '4b57c07b-f3f4-4e1b-925f-a719d07451aa',
                target: 'c658499e-b00c-453f-947b-2defcc6a5507',
                weight: 1
            }
        },
        {
            data: {
                source: '4e33f683-0426-48e2-9918-50d42e5d9226',
                target: 'a5e8c4a6-7014-4162-aa56-350c22c971df',
                weight: 1
            }
        },
        {
            data: {
                source: '547a902c-1d91-4f6f-abfa-a527ccefa930',
                target: 'e79ea4dd-8556-446d-9086-475175c9af8e',
                weight: 1
            }
        },
        {
            data: {
                source: '547a902c-1d91-4f6f-abfa-a527ccefa930',
                target: '8751cf98-83be-45c4-9b6b-5549391cab1c',
                weight: 1
            }
        },
        {
            data: {
                source: '547a902c-1d91-4f6f-abfa-a527ccefa930',
                target: '69f87e0f-e2c3-45cf-ac25-6fcb834eb1b4',
                weight: 1
            }
        },
        {
            data: {
                source: '54f7d604-b2b7-4ac4-bc96-fc169a366af7',
                target: '078031f7-5cbc-4b4f-92d0-00a04ea0fe3e',
                weight: 1
            }
        },
        {
            data: {
                source: '5fa88ac0-d590-4453-8d66-05ae9ff01c02',
                target: 'c122c8ad-d13e-43c1-a69c-7a0b67512b2c',
                weight: 1
            }
        },
        {
            data: {
                source: '5fa88ac0-d590-4453-8d66-05ae9ff01c02',
                target: '329a0014-76e0-4c01-bf4e-2eaab9a80477',
                weight: 1
            }
        },
        {
            data: {
                source: '5fa88ac0-d590-4453-8d66-05ae9ff01c02',
                target: '4b57c07b-f3f4-4e1b-925f-a719d07451aa',
                weight: 1
            }
        },
        {
            data: {
                source: '5fa88ac0-d590-4453-8d66-05ae9ff01c02',
                target: '990626ee-f14f-4151-91c1-44e4047e29ab',
                weight: 1
            }
        },
        {
            data: {
                source: '5fa88ac0-d590-4453-8d66-05ae9ff01c02',
                target: '078031f7-5cbc-4b4f-92d0-00a04ea0fe3e',
                weight: 1
            }
        },
        {
            data: {
                source: '61995c43-27e4-421e-b146-9ec4587d41e7',
                target: 'ed0d3731-1686-410b-9808-1190b45173af',
                weight: 1
            }
        },
        {
            data: {
                source: '61995c43-27e4-421e-b146-9ec4587d41e7',
                target: '03bd9d1f-2d7f-40d1-89a2-6f75c85bfe3e',
                weight: 1
            }
        },
        {
            data: {
                source: '68574ff8-cfeb-4433-abb7-1603d9a86fb6',
                target: 'e113bba6-43bf-486d-a8fa-5017745e7af9',
                weight: 1
            }
        },
        {
            data: {
                source: '687b79e2-b062-4f75-8762-1f7b7d433454',
                target: 'c8bc376f-6e07-42c2-8abd-47ac965b62ba',
                weight: 2
            }
        },
        {
            data: {
                source: '687b79e2-b062-4f75-8762-1f7b7d433454',
                target: '49301c65-06b9-4927-8b3c-a8bcaa7ac638',
                weight: 1
            }
        },
        {
            data: {
                source: '687b79e2-b062-4f75-8762-1f7b7d433454',
                target: '32c2a8cf-4588-4b74-b32f-de377e5dc31e',
                weight: 1
            }
        },
        {
            data: {
                source: '69f87e0f-e2c3-45cf-ac25-6fcb834eb1b4',
                target: '547a902c-1d91-4f6f-abfa-a527ccefa930',
                weight: 1
            }
        },
        {
            data: {
                source: '7193e1e0-d071-4bc2-a04c-70f0e45a7ae0',
                target: '23b7e4ac-f6ae-4cf8-b151-a19f2ce0d36f',
                weight: 2
            }
        },
        {
            data: {
                source: '7193e1e0-d071-4bc2-a04c-70f0e45a7ae0',
                target: 'c3c27f86-0d67-47aa-b0db-72ee5ad66793',
                weight: 1
            }
        },
        {
            data: {
                source: '7193e1e0-d071-4bc2-a04c-70f0e45a7ae0',
                target: 'd8bf8b7d-51e2-45d7-bd63-fe55c3cd5b91',
                weight: 2
            }
        },
        {
            data: {
                source: '7193e1e0-d071-4bc2-a04c-70f0e45a7ae0',
                target: 'a1202d49-589b-4bfc-ae6c-f109fff5cbcb',
                weight: 1
            }
        },
        {
            data: {
                source: '7193e1e0-d071-4bc2-a04c-70f0e45a7ae0',
                target: '69f87e0f-e2c3-45cf-ac25-6fcb834eb1b4',
                weight: 1
            }
        },
        {
            data: {
                source: '7193e1e0-d071-4bc2-a04c-70f0e45a7ae0',
                target: 'c6f5f652-7adb-4a86-a890-0df99a657de2',
                weight: 1
            }
        },
        {
            data: {
                source: '7193e1e0-d071-4bc2-a04c-70f0e45a7ae0',
                target: '3d6f0b72-4378-4511-9bae-7ba17d585ab3',
                weight: 1
            }
        },
        {
            data: {
                source: '7193e1e0-d071-4bc2-a04c-70f0e45a7ae0',
                target: 'a81d9b3a-aa5c-4d0e-97d8-259acdf5b281',
                weight: 1
            }
        },
        {
            data: {
                source: '7193e1e0-d071-4bc2-a04c-70f0e45a7ae0',
                target: '7a1b402c-c342-4dce-8924-bb30d69c72d4',
                weight: 2
            }
        },
        {
            data: {
                source: '7193e1e0-d071-4bc2-a04c-70f0e45a7ae0',
                target: 'd88f42c4-d3bb-4118-b7c1-5cc59cf296e7',
                weight: 1
            }
        },
        {
            data: {
                source: '7193e1e0-d071-4bc2-a04c-70f0e45a7ae0',
                target: 'ed28910c-9809-45db-8e52-56f04793fc2d',
                weight: 1
            }
        },
        {
            data: {
                source: '7193e1e0-d071-4bc2-a04c-70f0e45a7ae0',
                target: '238e9b4d-e785-4837-85e1-44ca55967008',
                weight: 1
            }
        },
        {
            data: {
                source: '7193e1e0-d071-4bc2-a04c-70f0e45a7ae0',
                target: '281f0443-f5f4-4742-a993-8e3031550944',
                weight: 1
            }
        },
        {
            data: {
                source: '7193e1e0-d071-4bc2-a04c-70f0e45a7ae0',
                target: '44c03cd5-51bf-436d-8fe3-1cfb6d5caec4',
                weight: 1
            }
        },
        {
            data: {
                source: '7193e1e0-d071-4bc2-a04c-70f0e45a7ae0',
                target: 'd7deccc7-19aa-4ce9-bb82-e3caafc8159e',
                weight: 1
            }
        },
        {
            data: {
                source: '7233f0fa-df2c-471d-a846-cfc1ff8e9f4c',
                target: '03b2cfe3-dad1-4419-b4a3-c02554e4dd6a',
                weight: 1
            }
        },
        {
            data: {
                source: '7233f0fa-df2c-471d-a846-cfc1ff8e9f4c',
                target: '68574ff8-cfeb-4433-abb7-1603d9a86fb6',
                weight: 2
            }
        },
        {
            data: {
                source: '75080b65-2527-4ca3-8b07-b5dc93611978',
                target: '3cb46640-6821-4f97-8042-37ea06443059',
                weight: 1
            }
        },
        {
            data: {
                source: '7585bb54-b33d-4d63-ab0b-bde01248b475',
                target: '44c03cd5-51bf-436d-8fe3-1cfb6d5caec4',
                weight: 1
            }
        },
        {
            data: {
                source: '7585bb54-b33d-4d63-ab0b-bde01248b475',
                target: 'd7deccc7-19aa-4ce9-bb82-e3caafc8159e',
                weight: 1
            }
        },
        {
            data: {
                source: '7585bb54-b33d-4d63-ab0b-bde01248b475',
                target: '078031f7-5cbc-4b4f-92d0-00a04ea0fe3e',
                weight: 1
            }
        },
        {
            data: {
                source: '7bcfd68f-5920-423f-be89-9003841b384d',
                target: '3cb46640-6821-4f97-8042-37ea06443059',
                weight: 1
            }
        },
        {
            data: {
                source: '7db79ff9-82b5-43b8-96a7-43e2abbf1b42',
                target: '4b57c07b-f3f4-4e1b-925f-a719d07451aa',
                weight: 1
            }
        },
        {
            data: {
                source: '7ec4d32a-7544-4d34-b890-bb5c54d7edce',
                target: '0508b003-b753-4871-a80f-a91767875180',
                weight: 1
            }
        },
        {
            data: {
                source: '7ec4d32a-7544-4d34-b890-bb5c54d7edce',
                target: '8751cf98-83be-45c4-9b6b-5549391cab1c',
                weight: 2
            }
        },
        {
            data: {
                source: '7f55cf94-78e0-4c00-9222-e405d600e979',
                target: 'e8648ce2-c8d0-4e9e-bb44-50d6b7983965',
                weight: 2
            }
        },
        {
            data: {
                source: '7f55cf94-78e0-4c00-9222-e405d600e979',
                target: 'cb7cf108-f6a5-48a9-b9b1-37ae64f396a1',
                weight: 1
            }
        },
        {
            data: {
                source: '80cc0e6e-f11b-48f4-bb00-54d504029652',
                target: 'd7deccc7-19aa-4ce9-bb82-e3caafc8159e',
                weight: 1
            }
        },
        {
            data: {
                source: '80cc0e6e-f11b-48f4-bb00-54d504029652',
                target: '8552fae0-1c87-43f6-b0cb-81b5e9baa0e3',
                weight: 1
            }
        },
        {
            data: {
                source: '81f899d5-0754-4ec9-9354-900fe8017b26',
                target: '0da03bac-54bb-4838-8a7e-5a0f8c20e72a',
                weight: 1
            }
        },
        {
            data: {
                source: '81f899d5-0754-4ec9-9354-900fe8017b26',
                target: 'ec7f10bb-6242-4f93-aaad-24f9dcc62ef1',
                weight: 2
            }
        },
        {
            data: {
                source: '8552fae0-1c87-43f6-b0cb-81b5e9baa0e3',
                target: '3d0d7062-9397-4bd0-a3d5-f3bb0538c3f2',
                weight: 2
            }
        },
        {
            data: {
                source: '8552fae0-1c87-43f6-b0cb-81b5e9baa0e3',
                target: '078031f7-5cbc-4b4f-92d0-00a04ea0fe3e',
                weight: 1
            }
        },
        {
            data: {
                source: '86d7d728-7f68-4e9e-8319-6274cd1e3049',
                target: '1b56d550-444d-4067-a34a-34778e2dda61',
                weight: 1
            }
        },
        {
            data: {
                source: '86d7d728-7f68-4e9e-8319-6274cd1e3049',
                target: 'd7deccc7-19aa-4ce9-bb82-e3caafc8159e',
                weight: 1
            }
        },
        {
            data: {
                source: '86d7d728-7f68-4e9e-8319-6274cd1e3049',
                target: '078031f7-5cbc-4b4f-92d0-00a04ea0fe3e',
                weight: 1
            }
        },
        {
            data: {
                source: '8751cf98-83be-45c4-9b6b-5549391cab1c',
                target: 'd88f42c4-d3bb-4118-b7c1-5cc59cf296e7',
                weight: 1
            }
        },
        {
            data: {
                source: '8751cf98-83be-45c4-9b6b-5549391cab1c',
                target: '2e6a1543-6c9d-4986-bfb0-42b9d16fa3c9',
                weight: 1
            }
        },
        {
            data: {
                source: '8751cf98-83be-45c4-9b6b-5549391cab1c',
                target: '2ae7db37-a3dd-4e5d-b033-d37c7ad1b971',
                weight: 1
            }
        },
        {
            data: {
                source: '8751cf98-83be-45c4-9b6b-5549391cab1c',
                target: '014be81e-265e-48c3-9e5d-2d6fe0d68158',
                weight: 1
            }
        },
        {
            data: {
                source: '8751cf98-83be-45c4-9b6b-5549391cab1c',
                target: '7126b683-be1f-4040-a40f-c20246cf4ef5',
                weight: 1
            }
        },
        {
            data: {
                source: '8751cf98-83be-45c4-9b6b-5549391cab1c',
                target: 'd33e9076-67ee-4000-95ab-0434a405dd9d',
                weight: 1
            }
        },
        {
            data: {
                source: '8751cf98-83be-45c4-9b6b-5549391cab1c',
                target: '547a902c-1d91-4f6f-abfa-a527ccefa930',
                weight: 1
            }
        },
        {
            data: {
                source: '881c5607-f6e1-4313-9905-b3531c276f5e',
                target: '078031f7-5cbc-4b4f-92d0-00a04ea0fe3e',
                weight: 1
            }
        },
        {
            data: {
                source: '881c5607-f6e1-4313-9905-b3531c276f5e',
                target: 'e0bba579-dd5a-45fa-b3e5-d2a90077fa1b',
                weight: 1
            }
        },
        {
            data: {
                source: '88e4a97f-8e06-4ce0-b96d-fb5a46d3405e',
                target: '2f1520b6-63b8-4436-891f-1cd586eabc57',
                weight: 1
            }
        },
        {
            data: {
                source: '8abe03c6-c803-4bbf-9682-92049abb8d53',
                target: '7a1b402c-c342-4dce-8924-bb30d69c72d4',
                weight: 1
            }
        },
        {
            data: {
                source: '8efc2076-6416-4017-a4ab-a8192013602d',
                target: 'f874731e-a939-40df-957d-38e52462bb35',
                weight: 1
            }
        },
        {
            data: {
                source: '8efc2076-6416-4017-a4ab-a8192013602d',
                target: '03b2cfe3-dad1-4419-b4a3-c02554e4dd6a',
                weight: 1
            }
        },
        {
            data: {
                source: '8f31407b-4022-4461-8a55-90393bbf7b1e',
                target: '8751cf98-83be-45c4-9b6b-5549391cab1c',
                weight: 1
            }
        },
        {
            data: {
                source: '9276d6fd-b3b9-4147-bded-d80e67ac86d7',
                target: '75a3c752-7b80-4bde-a0c3-cdcc1095e4cc',
                weight: 1
            }
        },
        {
            data: {
                source: '95af41b4-5299-4de1-a462-bf07815b2585',
                target: '03bd9d1f-2d7f-40d1-89a2-6f75c85bfe3e',
                weight: 1
            }
        },
        {
            data: {
                source: '982f6644-e63c-4967-a185-9a244dc8bbf1',
                target: 'd9d9a36a-5ab4-4e05-b603-65a53f6f6e39',
                weight: 4
            }
        },
        {
            data: {
                source: '990626ee-f14f-4151-91c1-44e4047e29ab',
                target: 'e5e71cca-dfd2-4592-92d8-8ecf8ed9763d',
                weight: 1
            }
        },
        {
            data: {
                source: '990626ee-f14f-4151-91c1-44e4047e29ab',
                target: 'cb7cf108-f6a5-48a9-b9b1-37ae64f396a1',
                weight: 1
            }
        },
        {
            data: {
                source: '990626ee-f14f-4151-91c1-44e4047e29ab',
                target: '3ee822f1-3432-4df1-92d5-3acaa8f48c45',
                weight: 3
            }
        },
        {
            data: {
                source: '990626ee-f14f-4151-91c1-44e4047e29ab',
                target: 'd7deccc7-19aa-4ce9-bb82-e3caafc8159e',
                weight: 2
            }
        },
        {
            data: {
                source: '990626ee-f14f-4151-91c1-44e4047e29ab',
                target: '5fa88ac0-d590-4453-8d66-05ae9ff01c02',
                weight: 1
            }
        },
        {
            data: {
                source: 'a4496372-ab05-4892-afc7-a223f02b34cf',
                target: '5fa88ac0-d590-4453-8d66-05ae9ff01c02',
                weight: 1
            }
        },
        {
            data: {
                source: 'a4496372-ab05-4892-afc7-a223f02b34cf',
                target: 'd7deccc7-19aa-4ce9-bb82-e3caafc8159e',
                weight: 1
            }
        },
        {
            data: {
                source: 'a4496372-ab05-4892-afc7-a223f02b34cf',
                target: '7a1b402c-c342-4dce-8924-bb30d69c72d4',
                weight: 1
            }
        },
        {
            data: {
                source: 'a5e8c4a6-7014-4162-aa56-350c22c971df',
                target: '4e33f683-0426-48e2-9918-50d42e5d9226',
                weight: 3
            }
        },
        {
            data: {
                source: 'a5e8c4a6-7014-4162-aa56-350c22c971df',
                target: 'c67fe0ec-25dd-425a-ac37-af10a4d80463',
                weight: 1
            }
        },
        {
            data: {
                source: 'b8cc45b6-90fc-49f4-9b3a-605ff010ca35',
                target: '19cc283f-eb67-4ce7-a308-dc0415b7260a',
                weight: 2
            }
        },
        {
            data: {
                source: 'b8cc45b6-90fc-49f4-9b3a-605ff010ca35',
                target: 'd88f42c4-d3bb-4118-b7c1-5cc59cf296e7',
                weight: 1
            }
        },
        {
            data: {
                source: 'c122c8ad-d13e-43c1-a69c-7a0b67512b2c',
                target: '329a0014-76e0-4c01-bf4e-2eaab9a80477',
                weight: 1
            }
        },
        {
            data: {
                source: 'c122c8ad-d13e-43c1-a69c-7a0b67512b2c',
                target: '4b57c07b-f3f4-4e1b-925f-a719d07451aa',
                weight: 1
            }
        },
        {
            data: {
                source: 'c3c27f86-0d67-47aa-b0db-72ee5ad66793',
                target: '7193e1e0-d071-4bc2-a04c-70f0e45a7ae0',
                weight: 1
            }
        },
        {
            data: {
                source: 'c67fe0ec-25dd-425a-ac37-af10a4d80463',
                target: '4e33f683-0426-48e2-9918-50d42e5d9226',
                weight: 1
            }
        },
        {
            data: {
                source: 'c67fe0ec-25dd-425a-ac37-af10a4d80463',
                target: 'da085a72-69a2-4fc2-b6ad-f13a28275daa',
                weight: 1
            }
        },
        {
            data: {
                source: 'c67fe0ec-25dd-425a-ac37-af10a4d80463',
                target: 'a5e8c4a6-7014-4162-aa56-350c22c971df',
                weight: 1
            }
        },
        {
            data: {
                source: 'c6f5f652-7adb-4a86-a890-0df99a657de2',
                target: '014be81e-265e-48c3-9e5d-2d6fe0d68158',
                weight: 2
            }
        },
        {
            data: {
                source: 'c6f5f652-7adb-4a86-a890-0df99a657de2',
                target: 'dc7e89c1-b92b-4a7b-88bd-a4a27867c44f',
                weight: 1
            }
        },
        {
            data: {
                source: 'c8bc376f-6e07-42c2-8abd-47ac965b62ba',
                target: '220a3eea-826a-4163-8b97-7c05b4185b44',
                weight: 2
            }
        },
        {
            data: {
                source: 'caa680a1-8f67-419a-a288-a047c9819749',
                target: 'f9f1dd3e-64a4-4a8f-bc4d-5d584dc70b1d',
                weight: 1
            }
        },
        {
            data: {
                source: 'caa680a1-8f67-419a-a288-a047c9819749',
                target: 'e8525532-1fdb-411f-a62e-db4cbf68cec4',
                weight: 1
            }
        },
        {
            data: {
                source: 'caa680a1-8f67-419a-a288-a047c9819749',
                target: '7bd24a37-28a7-47fd-8d33-0bda438936bc',
                weight: 1
            }
        },
        {
            data: {
                source: 'caa680a1-8f67-419a-a288-a047c9819749',
                target: '2a0c4087-0a56-4d77-8851-6d6d58be6159',
                weight: 1
            }
        },
        {
            data: {
                source: 'caa680a1-8f67-419a-a288-a047c9819749',
                target: '654c36b5-5fcc-4687-b87f-a446cab74789',
                weight: 1
            }
        },
        {
            data: {
                source: 'caa680a1-8f67-419a-a288-a047c9819749',
                target: '88e4a97f-8e06-4ce0-b96d-fb5a46d3405e',
                weight: 1
            }
        },
        {
            data: {
                source: 'caa680a1-8f67-419a-a288-a047c9819749',
                target: 'ea83a4c9-97e9-467a-8b3d-388bbdd94c42',
                weight: 1
            }
        },
        {
            data: {
                source: 'caa680a1-8f67-419a-a288-a047c9819749',
                target: '0a6c3046-9d46-450d-9c35-c866ffbe2acb',
                weight: 1
            }
        },
        {
            data: {
                source: 'caa680a1-8f67-419a-a288-a047c9819749',
                target: '16bb79db-c4b7-4e3f-a550-b2732603d4e9',
                weight: 2
            }
        },
        {
            data: {
                source: 'caa680a1-8f67-419a-a288-a047c9819749',
                target: 'f2031260-7b98-44e3-98cf-644c12d961bd',
                weight: 1
            }
        },
        {
            data: {
                source: 'caa680a1-8f67-419a-a288-a047c9819749',
                target: 'dffd9a85-06b6-43fd-a4e0-bf30f1c4e7d9',
                weight: 1
            }
        },
        {
            data: {
                source: 'cb7cf108-f6a5-48a9-b9b1-37ae64f396a1',
                target: 'd88f42c4-d3bb-4118-b7c1-5cc59cf296e7',
                weight: 1
            }
        },
        {
            data: {
                source: 'cb7cf108-f6a5-48a9-b9b1-37ae64f396a1',
                target: '3d6f0b72-4378-4511-9bae-7ba17d585ab3',
                weight: 2
            }
        },
        {
            data: {
                source: 'd0db8d27-0c78-486f-ab96-1243baa12de3',
                target: '44c03cd5-51bf-436d-8fe3-1cfb6d5caec4',
                weight: 1
            }
        },
        {
            data: {
                source: 'd0db8d27-0c78-486f-ab96-1243baa12de3',
                target: 'b4ad62f4-9deb-4746-86a8-5faa87e78da5',
                weight: 1
            }
        },
        {
            data: {
                source: 'd0db8d27-0c78-486f-ab96-1243baa12de3',
                target: 'b4cbcfbd-f487-4ecc-9e85-e89b9fd3b1f1',
                weight: 1
            }
        },
        {
            data: {
                source: 'd0db8d27-0c78-486f-ab96-1243baa12de3',
                target: '58087e56-e986-468c-875e-9643acfe6eb9',
                weight: 1
            }
        },
        {
            data: {
                source: 'd1d68768-7675-47ed-ae4d-74c3033aa8f5',
                target: '014be81e-265e-48c3-9e5d-2d6fe0d68158',
                weight: 1
            }
        },
        {
            data: {
                source: 'd33e9076-67ee-4000-95ab-0434a405dd9d',
                target: '8751cf98-83be-45c4-9b6b-5549391cab1c',
                weight: 2
            }
        },
        {
            data: {
                source: 'd3760408-517f-4395-880f-cc60e176213d',
                target: 'f874731e-a939-40df-957d-38e52462bb35',
                weight: 1
            }
        },
        {
            data: {
                source: 'd3760408-517f-4395-880f-cc60e176213d',
                target: '03b2cfe3-dad1-4419-b4a3-c02554e4dd6a',
                weight: 1
            }
        },
        {
            data: {
                source: 'd7deccc7-19aa-4ce9-bb82-e3caafc8159e',
                target: '3cb46640-6821-4f97-8042-37ea06443059',
                weight: 1
            }
        },
        {
            data: {
                source: 'd7deccc7-19aa-4ce9-bb82-e3caafc8159e',
                target: '5fa88ac0-d590-4453-8d66-05ae9ff01c02',
                weight: 1
            }
        },
        {
            data: {
                source: 'd7deccc7-19aa-4ce9-bb82-e3caafc8159e',
                target: '1b56d550-444d-4067-a34a-34778e2dda61',
                weight: 2
            }
        },
        {
            data: {
                source: 'd7deccc7-19aa-4ce9-bb82-e3caafc8159e',
                target: '3ee822f1-3432-4df1-92d5-3acaa8f48c45',
                weight: 2
            }
        },
        {
            data: {
                source: 'd7deccc7-19aa-4ce9-bb82-e3caafc8159e',
                target: '86d7d728-7f68-4e9e-8319-6274cd1e3049',
                weight: 3
            }
        },
        {
            data: {
                source: 'd7deccc7-19aa-4ce9-bb82-e3caafc8159e',
                target: 'c122c8ad-d13e-43c1-a69c-7a0b67512b2c',
                weight: 1
            }
        },
        {
            data: {
                source: 'd7deccc7-19aa-4ce9-bb82-e3caafc8159e',
                target: 'e0bba579-dd5a-45fa-b3e5-d2a90077fa1b',
                weight: 3
            }
        },
        {
            data: {
                source: 'd7deccc7-19aa-4ce9-bb82-e3caafc8159e',
                target: '881c5607-f6e1-4313-9905-b3531c276f5e',
                weight: 2
            }
        },
        {
            data: {
                source: 'd7deccc7-19aa-4ce9-bb82-e3caafc8159e',
                target: '7585bb54-b33d-4d63-ab0b-bde01248b475',
                weight: 3
            }
        },
        {
            data: {
                source: 'd7deccc7-19aa-4ce9-bb82-e3caafc8159e',
                target: 'e9d17a68-3295-47f3-a339-2246963f42e6',
                weight: 2
            }
        },
        {
            data: {
                source: 'd7deccc7-19aa-4ce9-bb82-e3caafc8159e',
                target: '990626ee-f14f-4151-91c1-44e4047e29ab',
                weight: 1
            }
        },
        {
            data: {
                source: 'd7deccc7-19aa-4ce9-bb82-e3caafc8159e',
                target: '078031f7-5cbc-4b4f-92d0-00a04ea0fe3e',
                weight: 1
            }
        },
        {
            data: {
                source: 'd88f42c4-d3bb-4118-b7c1-5cc59cf296e7',
                target: '0508b003-b753-4871-a80f-a91767875180',
                weight: 1
            }
        },
        {
            data: {
                source: 'd88f42c4-d3bb-4118-b7c1-5cc59cf296e7',
                target: 'e64ef54e-4ba3-4e19-ba00-7fc93be4acae',
                weight: 2
            }
        },
        {
            data: {
                source: 'd88f42c4-d3bb-4118-b7c1-5cc59cf296e7',
                target: 'f9f1dd3e-64a4-4a8f-bc4d-5d584dc70b1d',
                weight: 1
            }
        },
        {
            data: {
                source: 'd88f42c4-d3bb-4118-b7c1-5cc59cf296e7',
                target: 'd1a46816-ff9f-49b1-a4d5-fdd4c241beb1',
                weight: 1
            }
        },
        {
            data: {
                source: 'd88f42c4-d3bb-4118-b7c1-5cc59cf296e7',
                target: '281f0443-f5f4-4742-a993-8e3031550944',
                weight: 1
            }
        },
        {
            data: {
                source: 'd88f42c4-d3bb-4118-b7c1-5cc59cf296e7',
                target: 'e8525532-1fdb-411f-a62e-db4cbf68cec4',
                weight: 1
            }
        },
        {
            data: {
                source: 'd88f42c4-d3bb-4118-b7c1-5cc59cf296e7',
                target: 'ed28910c-9809-45db-8e52-56f04793fc2d',
                weight: 1
            }
        },
        {
            data: {
                source: 'd88f42c4-d3bb-4118-b7c1-5cc59cf296e7',
                target: '7bd24a37-28a7-47fd-8d33-0bda438936bc',
                weight: 1
            }
        },
        {
            data: {
                source: 'd88f42c4-d3bb-4118-b7c1-5cc59cf296e7',
                target: 'caa680a1-8f67-419a-a288-a047c9819749',
                weight: 1
            }
        },
        {
            data: {
                source: 'd88f42c4-d3bb-4118-b7c1-5cc59cf296e7',
                target: '2a0c4087-0a56-4d77-8851-6d6d58be6159',
                weight: 1
            }
        },
        {
            data: {
                source: 'd88f42c4-d3bb-4118-b7c1-5cc59cf296e7',
                target: '654c36b5-5fcc-4687-b87f-a446cab74789',
                weight: 1
            }
        },
        {
            data: {
                source: 'd88f42c4-d3bb-4118-b7c1-5cc59cf296e7',
                target: '90fba573-ba57-4d18-bd26-e34f94ea8c4d',
                weight: 1
            }
        },
        {
            data: {
                source: 'd88f42c4-d3bb-4118-b7c1-5cc59cf296e7',
                target: '88e4a97f-8e06-4ce0-b96d-fb5a46d3405e',
                weight: 1
            }
        },
        {
            data: {
                source: 'd88f42c4-d3bb-4118-b7c1-5cc59cf296e7',
                target: 'ea83a4c9-97e9-467a-8b3d-388bbdd94c42',
                weight: 1
            }
        },
        {
            data: {
                source: 'd88f42c4-d3bb-4118-b7c1-5cc59cf296e7',
                target: '7ec4d32a-7544-4d34-b890-bb5c54d7edce',
                weight: 1
            }
        },
        {
            data: {
                source: 'd88f42c4-d3bb-4118-b7c1-5cc59cf296e7',
                target: '0a6c3046-9d46-450d-9c35-c866ffbe2acb',
                weight: 1
            }
        },
        {
            data: {
                source: 'd88f42c4-d3bb-4118-b7c1-5cc59cf296e7',
                target: '34d64bf2-9ff9-45c9-84bd-1d106730a5a7',
                weight: 1
            }
        },
        {
            data: {
                source: 'd88f42c4-d3bb-4118-b7c1-5cc59cf296e7',
                target: 'f2031260-7b98-44e3-98cf-644c12d961bd',
                weight: 1
            }
        },
        {
            data: {
                source: 'd88f42c4-d3bb-4118-b7c1-5cc59cf296e7',
                target: 'dffd9a85-06b6-43fd-a4e0-bf30f1c4e7d9',
                weight: 1
            }
        },
        {
            data: {
                source: 'd88f42c4-d3bb-4118-b7c1-5cc59cf296e7',
                target: '238e9b4d-e785-4837-85e1-44ca55967008',
                weight: 1
            }
        },
        {
            data: {
                source: 'd88f42c4-d3bb-4118-b7c1-5cc59cf296e7',
                target: '329a0014-76e0-4c01-bf4e-2eaab9a80477',
                weight: 1
            }
        },
        {
            data: {
                source: 'd88f42c4-d3bb-4118-b7c1-5cc59cf296e7',
                target: '7193e1e0-d071-4bc2-a04c-70f0e45a7ae0',
                weight: 1
            }
        },
        {
            data: {
                source: 'd88f42c4-d3bb-4118-b7c1-5cc59cf296e7',
                target: '4b57c07b-f3f4-4e1b-925f-a719d07451aa',
                weight: 1
            }
        },
        {
            data: {
                source: 'd88f42c4-d3bb-4118-b7c1-5cc59cf296e7',
                target: 'cb7cf108-f6a5-48a9-b9b1-37ae64f396a1',
                weight: 1
            }
        },
        {
            data: {
                source: 'd88f42c4-d3bb-4118-b7c1-5cc59cf296e7',
                target: '078031f7-5cbc-4b4f-92d0-00a04ea0fe3e',
                weight: 1
            }
        },
        {
            data: {
                source: 'd9d9a36a-5ab4-4e05-b603-65a53f6f6e39',
                target: '982f6644-e63c-4967-a185-9a244dc8bbf1',
                weight: 2
            }
        },
        {
            data: {
                source: 'da085a72-69a2-4fc2-b6ad-f13a28275daa',
                target: '2ae7db37-a3dd-4e5d-b033-d37c7ad1b971',
                weight: 1
            }
        },
        {
            data: {
                source: 'da201481-a2dc-4263-899b-e7eece4f09c5',
                target: 'd7deccc7-19aa-4ce9-bb82-e3caafc8159e',
                weight: 1
            }
        },
        {
            data: {
                source: 'dc7e89c1-b92b-4a7b-88bd-a4a27867c44f',
                target: 'b427eb80-c835-4093-af53-e1dea6664ba7',
                weight: 1
            }
        },
        {
            data: {
                source: 'dc7e89c1-b92b-4a7b-88bd-a4a27867c44f',
                target: '022ec78c-ee39-4db7-8212-aaea0a3c39a8',
                weight: 2
            }
        },
        {
            data: {
                source: 'dc7e89c1-b92b-4a7b-88bd-a4a27867c44f',
                target: 'c6f5f652-7adb-4a86-a890-0df99a657de2',
                weight: 2
            }
        },
        {
            data: {
                source: 'dc7e89c1-b92b-4a7b-88bd-a4a27867c44f',
                target: '8f0ed82e-1962-4478-b46e-4f009cf48de4',
                weight: 2
            }
        },
        {
            data: {
                source: 'dffd9a85-06b6-43fd-a4e0-bf30f1c4e7d9',
                target: '057a115b-865e-48c9-8024-22f6a97d2dac',
                weight: 1
            }
        },
        {
            data: {
                source: 'dffd9a85-06b6-43fd-a4e0-bf30f1c4e7d9',
                target: '1b836b46-5cb5-4399-9f00-275db2efc687',
                weight: 1
            }
        },
        {
            data: {
                source: 'e0bba579-dd5a-45fa-b3e5-d2a90077fa1b',
                target: '881c5607-f6e1-4313-9905-b3531c276f5e',
                weight: 1
            }
        },
        {
            data: {
                source: 'e0bba579-dd5a-45fa-b3e5-d2a90077fa1b',
                target: 'd7deccc7-19aa-4ce9-bb82-e3caafc8159e',
                weight: 1
            }
        },
        {
            data: {
                source: 'e0bba579-dd5a-45fa-b3e5-d2a90077fa1b',
                target: '078031f7-5cbc-4b4f-92d0-00a04ea0fe3e',
                weight: 1
            }
        },
        {
            data: {
                source: 'e113bba6-43bf-486d-a8fa-5017745e7af9',
                target: '68574ff8-cfeb-4433-abb7-1603d9a86fb6',
                weight: 2
            }
        },
        {
            data: {
                source: 'e113bba6-43bf-486d-a8fa-5017745e7af9',
                target: '1f2298a7-1ad2-4725-8662-d4f4e7ada61c',
                weight: 8
            }
        },
        {
            data: {
                source: 'e113bba6-43bf-486d-a8fa-5017745e7af9',
                target: '03b2cfe3-dad1-4419-b4a3-c02554e4dd6a',
                weight: 3
            }
        },
        {
            data: {
                source: 'e113bba6-43bf-486d-a8fa-5017745e7af9',
                target: 'd3760408-517f-4395-880f-cc60e176213d',
                weight: 1
            }
        },
        {
            data: {
                source: 'e64ef54e-4ba3-4e19-ba00-7fc93be4acae',
                target: '0508b003-b753-4871-a80f-a91767875180',
                weight: 1
            }
        },
        {
            data: {
                source: 'e64ef54e-4ba3-4e19-ba00-7fc93be4acae',
                target: 'd88f42c4-d3bb-4118-b7c1-5cc59cf296e7',
                weight: 2
            }
        },
        {
            data: {
                source: 'e64ef54e-4ba3-4e19-ba00-7fc93be4acae',
                target: '238e9b4d-e785-4837-85e1-44ca55967008',
                weight: 1
            }
        },
        {
            data: {
                source: 'e79ea4dd-8556-446d-9086-475175c9af8e',
                target: '547a902c-1d91-4f6f-abfa-a527ccefa930',
                weight: 2
            }
        },
        {
            data: {
                source: 'e8525532-1fdb-411f-a62e-db4cbf68cec4',
                target: 'ebc3408a-149c-4824-b7db-0a05802c343a',
                weight: 1
            }
        },
        {
            data: {
                source: 'e9d17a68-3295-47f3-a339-2246963f42e6',
                target: 'd7deccc7-19aa-4ce9-bb82-e3caafc8159e',
                weight: 2
            }
        },
        {
            data: {
                source: 'e9d17a68-3295-47f3-a339-2246963f42e6',
                target: '3cb46640-6821-4f97-8042-37ea06443059',
                weight: 1
            }
        },
        {
            data: {
                source: 'ea83a4c9-97e9-467a-8b3d-388bbdd94c42',
                target: '9be05894-ee61-4f5d-b92a-824165e183fc',
                weight: 1
            }
        },
        {
            data: {
                source: 'ed0d3731-1686-410b-9808-1190b45173af',
                target: '093bf486-67c1-4cb1-b64d-e7b0b0cd3f01',
                weight: 1
            }
        },
        {
            data: {
                source: 'ed28910c-9809-45db-8e52-56f04793fc2d',
                target: 'bf43c6b9-ef1b-425b-a23e-ceba0388be2b',
                weight: 1
            }
        },
        {
            data: {
                source: 'ed28910c-9809-45db-8e52-56f04793fc2d',
                target: '13b3ff36-ec1d-4334-8ca0-7e3a46a84123',
                weight: 1
            }
        },
        {
            data: {
                source: 'ed28910c-9809-45db-8e52-56f04793fc2d',
                target: '5bfdbd26-6e7c-495e-b447-251686d9f2fd',
                weight: 1
            }
        },
        {
            data: {
                source: 'ed28910c-9809-45db-8e52-56f04793fc2d',
                target: '3eea0d33-3a47-420c-b693-8f52763852f8',
                weight: 1
            }
        },
        {
            data: {
                source: 'ed28910c-9809-45db-8e52-56f04793fc2d',
                target: '1df40517-e243-44ac-9606-562fba5588e5',
                weight: 1
            }
        },
        {
            data: {
                source: 'ed28910c-9809-45db-8e52-56f04793fc2d',
                target: '95de6c0b-f1d8-45a4-8319-cf64867b9c5d',
                weight: 1
            }
        },
        {
            data: {
                source: 'ed28910c-9809-45db-8e52-56f04793fc2d',
                target: '8b99cc1a-4852-4f54-b1ef-df896ae697c7',
                weight: 1
            }
        },
        {
            data: {
                source: 'ed28910c-9809-45db-8e52-56f04793fc2d',
                target: 'a2b5d90c-cc68-4376-94c7-82b7361b1ab3',
                weight: 1
            }
        },
        {
            data: {
                source: 'ed28910c-9809-45db-8e52-56f04793fc2d',
                target: '964609fe-10d0-4eab-af64-5e4a1b6ccc9f',
                weight: 1
            }
        },
        {
            data: {
                source: 'ed28910c-9809-45db-8e52-56f04793fc2d',
                target: '7f6bf64b-189c-4552-bd7c-459fd034ff07',
                weight: 1
            }
        },
        {
            data: {
                source: 'ed28910c-9809-45db-8e52-56f04793fc2d',
                target: 'd4cbd322-f091-494e-bc0a-aab68e8c7a01',
                weight: 1
            }
        },
        {
            data: {
                source: 'ed28910c-9809-45db-8e52-56f04793fc2d',
                target: 'ef34adc8-eb5a-43be-be34-f3da6b821173',
                weight: 1
            }
        },
        {
            data: {
                source: 'ed28910c-9809-45db-8e52-56f04793fc2d',
                target: 'c68218e0-2a7c-440c-859e-5ff89bd0f13a',
                weight: 1
            }
        },
        {
            data: {
                source: 'ed28910c-9809-45db-8e52-56f04793fc2d',
                target: '9e49806a-ef0d-40a3-9490-ebc0e2586024',
                weight: 1
            }
        },
        {
            data: {
                source: 'ed28910c-9809-45db-8e52-56f04793fc2d',
                target: 'c658499e-b00c-453f-947b-2defcc6a5507',
                weight: 1
            }
        },
        {
            data: {
                source: 'ed28910c-9809-45db-8e52-56f04793fc2d',
                target: '2272d30f-786c-48b7-ba11-51997d4fed8a',
                weight: 1
            }
        },
        {
            data: {
                source: 'ed28910c-9809-45db-8e52-56f04793fc2d',
                target: '1125a6d4-dff4-4e50-b5d8-83237bd02721',
                weight: 1
            }
        },
        {
            data: {
                source: 'ed28910c-9809-45db-8e52-56f04793fc2d',
                target: 'b8cc45b6-90fc-49f4-9b3a-605ff010ca35',
                weight: 1
            }
        },
        {
            data: {
                source: 'ed28910c-9809-45db-8e52-56f04793fc2d',
                target: '857e7b81-58a7-4307-867b-480039b13655',
                weight: 1
            }
        },
        {
            data: {
                source: 'ed28910c-9809-45db-8e52-56f04793fc2d',
                target: '4d356dae-400f-4fa5-a1b8-a0e1b05c5ce1',
                weight: 1
            }
        },
        {
            data: {
                source: 'ed28910c-9809-45db-8e52-56f04793fc2d',
                target: '363c70ed-c0c6-49e5-b07e-0e3fdeb870cd',
                weight: 1
            }
        },
        {
            data: {
                source: 'ed28910c-9809-45db-8e52-56f04793fc2d',
                target: 'faf7e6b1-afc4-4fe5-8b77-9bdbdcae893a',
                weight: 1
            }
        },
        {
            data: {
                source: 'ed28910c-9809-45db-8e52-56f04793fc2d',
                target: 'bece8fcf-dbc7-4650-93e9-50a6b5b45bbc',
                weight: 1
            }
        },
        {
            data: {
                source: 'ed28910c-9809-45db-8e52-56f04793fc2d',
                target: 'bdee66ef-09ef-4721-b764-49c64607075a',
                weight: 1
            }
        },
        {
            data: {
                source: 'ed28910c-9809-45db-8e52-56f04793fc2d',
                target: 'fd99f542-a8d8-4783-b98b-7ad0f480484a',
                weight: 1
            }
        },
        {
            data: {
                source: 'ed28910c-9809-45db-8e52-56f04793fc2d',
                target: '8adef028-bfea-4fe1-85d8-f0e0054e2db8',
                weight: 1
            }
        },
        {
            data: {
                source: 'ed28910c-9809-45db-8e52-56f04793fc2d',
                target: 'f4dc7d17-0225-470e-bc40-23a610848493',
                weight: 1
            }
        },
        {
            data: {
                source: 'ed28910c-9809-45db-8e52-56f04793fc2d',
                target: '90fba573-ba57-4d18-bd26-e34f94ea8c4d',
                weight: 1
            }
        },
        {
            data: {
                source: 'ed28910c-9809-45db-8e52-56f04793fc2d',
                target: '149b8db6-0a3f-4555-affc-9b1437b31f7e',
                weight: 1
            }
        },
        {
            data: {
                source: 'ed28910c-9809-45db-8e52-56f04793fc2d',
                target: 'ac675942-cd60-4434-85bf-73453c95562b',
                weight: 1
            }
        },
        {
            data: {
                source: 'f1772b99-3cf3-407c-81d2-a523d23aeef2',
                target: '078031f7-5cbc-4b4f-92d0-00a04ea0fe3e',
                weight: 1
            }
        },
        {
            data: {
                source: 'f874731e-a939-40df-957d-38e52462bb35',
                target: 'd3760408-517f-4395-880f-cc60e176213d',
                weight: 1
            }
        },
        {
            data: {
                source: 'f874731e-a939-40df-957d-38e52462bb35',
                target: '1f2298a7-1ad2-4725-8662-d4f4e7ada61c',
                weight: 2
            }
        },
        {
            data: {
                source: 'f874731e-a939-40df-957d-38e52462bb35',
                target: '03b2cfe3-dad1-4419-b4a3-c02554e4dd6a',
                weight: 2
            }
        },
        {
            data: {
                source: 'f874731e-a939-40df-957d-38e52462bb35',
                target: '8efc2076-6416-4017-a4ab-a8192013602d',
                weight: 1
            }
        },
        {
            data: {
                source: 'f9f1dd3e-64a4-4a8f-bc4d-5d584dc70b1d',
                target: 'd1a46816-ff9f-49b1-a4d5-fdd4c241beb1',
                weight: 1
            }
        }]







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
            },
            { // example command
                fillColor: 'rgba(200, 200, 200, 0.75)', // optional: custom background color for item
                content: 'Isolate Neighborhood', // html/text content to be displayed in the menu
                contentStyle: {}, // css key:value pairs to set the command's css in js if you want
                select: function (ele) { // a function to execute when the command is selected
                    IsolateNeighborhood(ele);
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

    const legend_item_style = {
        display: "inline-block",
        verticalAlign: "middle",
        margin: "0"
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
                    {/* <Tooltip
            open={tooltipOpen}
            onClose={handleTooltipClose}
            onOpen={handleTooltipOpen}
            style={{
              position: "absolute",
              left: `${tooltipPos.x}px`,
              top: `${tooltipPos.y}px`,
            }}
            title="Add">
            <Box
            style={{
              position: "absolute",
              left: `${tooltipPos.x}px`,
              top: `${tooltipPos.y}px`,
            }}>
            </Box>
          </Tooltip> */}
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
                        stylesheet={config.styleSheet}
                        cy={cy => {
                            if (myCy == null) {
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

                                    var layout_subgraph = cy.elements().not(':hidden').layout(graph_layout);

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
                                    var default_layout = cy.layout(graph_layout);
                                    default_layout.run();
                                }
                            }

                            myCyRef = cy;
                            console.log("myCyRef", myCyRef)
                            setMyCy(cy);

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

                                // handleTooltipOpen(this);
                            });

                            // var layer = cy.cyCanvas();
                            // var canvas = layer.getCanvas();
                            // var ctx = canvas.getContext('2d');

                            // cy.on("render cyCanvas.resize", function (evt) {
                            //   layer.resetTransform(ctx);
                            //   layer.clear(ctx);

                            //   ctx.font = "24px Helvetica";
                            //   ctx.fillStyle = "black";

                            //   // Draw fixed elements
                            //   ctx.fillText("This text follows the model", 0, 25);

                            //   // ctx.fillRect(0, 0, 100, 100); // Top left corner
                            //   layer.setTransform(ctx);

                            //   // Draw model elements
                            //   // cy.nodes().forEach(function(node) {
                            //   //   var pos = node.position();
                            //   //   ctx.fillRect(pos.x, pos.y, 100, 100); // At node position
                            //   // });
                            // });

                        }}
                        abc={console.log("myCyRef-after", myCyRef)}
                    />

                    <ul style={{
                        position: "absolute",
                        top: "75px",
                        left: "10px",
                        display: "inline-block",
                        listStyleType: "none",
                        padding: "0",
                        margin: "0"
                    }}>
                        <li>
                            <SquareSharpIcon style={legend_item_style}>
                            </SquareSharpIcon>
                            <h3 style={legend_item_style}>
                                Article
                            </h3>
                        </li>
                        <li>
                            <CircleIcon style={legend_item_style}>
                            </CircleIcon>
                            <h3 style={legend_item_style}>
                                Category
                            </h3>
                        </li>
                        <li>
                            <LabelSharpIcon style={legend_item_style}>
                            </LabelSharpIcon>
                            <h3 style={legend_item_style}>
                                Tag
                            </h3>
                        </li>
                        <li>
                            <HelpIcon style={legend_item_style}>
                            </HelpIcon>
                            <h3 style={legend_item_style}>
                                Tab and hold on graph vertices for menu options
                            </h3>
                        </li>
                    </ul>
                </div>
            </div>
        </>

    );
}


export default Graph