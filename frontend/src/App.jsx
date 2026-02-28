import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import IDE from "./pages/IDE";
import Docs from "./pages/Docs";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<IDE />} />
        <Route path="/docs" element={<Docs />} />
      </Routes>
    </Router>
  );
}

export default App;
