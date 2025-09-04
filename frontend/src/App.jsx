import React from "react";
import { 
  createBrowserRouter, 
  RouterProvider,
  createRoutesFromElements,
  Route
} from "react-router-dom";
import Home from "./pages/Home";
import Lab from "./pages/Lab";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Home />} />
      <Route path="/lab" element={<Lab />} />
    </>
  ),
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true
    }
  }
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;