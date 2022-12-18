import React, { useState } from "react";
import * as config from '../GraphConfig';
  
export const cyContext = React.createContext();
export const ContextProvider = ({ children }) => {
    const [myCy, setMyCy] = useState(null);
    const [graph_layout, setGraph_layout] = useState(config.layout_dagre);
    // const [myTooltip, setMyTooltip] = useState({
    //     open: false,
    //     x: 0,
    //     y: 0
    // });
  
    return (
        <cyContext.Provider value={{ myCy, setMyCy, graph_layout, setGraph_layout}}>
            {children}
        </cyContext.Provider>
    );
};