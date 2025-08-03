import { Routes, Route } from "react-router-dom"
import MainPage from "./pages/MainPage"
import NotFound from "./pages/NotFound"
import Navbar from "./components/navbar"
import PeliculasPage from "./pages/PeliculasPage"
import ConfiguracionPage from "./pages/ConfiguracionPage"
import FuncionesPage from "./pages/FuncionesPage"
import SalasPage from "./pages/SalasPage"


function App() {
  return (
    <>
    <div className="min-h-screen bg-gray-700">
      <Navbar />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/Peliculas" element={<PeliculasPage />} />
        <Route path="/Configuracion" element={<ConfiguracionPage />} />
        <Route path="/Funciones" element={<FuncionesPage />} />
        <Route path="/Salas" element={<SalasPage />} />
      </Routes>
    </div>
    </>
  )
}

export default App