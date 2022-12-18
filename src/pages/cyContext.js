import React, { useState } from "react";
  
export const cyContext = React.createContext();
export const ContextProvider = ({ children }) => {
    const [myCy, setMyCy] = useState(null);
    const [myTooltip, setMyTooltip] = useState({
        open: false,
        x: 0,
        y: 0
    });
  
    return (
        <cyContext.Provider value={{ myCy, setMyCy,myTooltip, setMyTooltip }}>
            {children}
        </cyContext.Provider>
    );
};