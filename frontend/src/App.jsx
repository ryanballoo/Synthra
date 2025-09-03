import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Lab from "./pages/Lab";

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route points to Lab */}
        <Route path="/" element={<Lab />} />
      </Routes>
    </Router>
  );
}

export default App;