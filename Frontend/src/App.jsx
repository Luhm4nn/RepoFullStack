import React from "react"
import { Routes, Route } from "react-router-dom"
import MainPage from "./pages/MainPage"
import NotFound from "./pages/NotFound"

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="*" element={<NotFound/>} />
    </Routes>
  )
}

export default App