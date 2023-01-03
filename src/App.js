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

import React from "react";
import { HashRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './pages';
import IFrameTest from './pages/iframetest';

function App() {
  return (
    <Router>
    <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/iframetest' element={<IFrameTest />} />
    </Routes>
    </Router>
  );
}

export default App;