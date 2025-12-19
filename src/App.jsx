import { BrowserRouter, Routes, Route } from "react-router-dom"  // Importing BrowserRouter for routing
import { Home } from "./pages/Home"              // Importing Home component
import { NotFound } from "./pages/NotFound"      // Importing NotFound component

function App() {  // Main App component
  

  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />                  {/* Route for Home component */}
        <Route path="*" element={<NotFound />} />           {/* Route for NotFound component */}
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
