import React, { useState } from "react";
  
export const cyContext = React.createContext();
export const ContextProvider = ({ children }) => {
    const [items, setItems] = useState(null);
  
    return (
        <cyContext.Provider value={{ items, setItems }}>
            {children}
        </cyContext.Provider>
    );
};