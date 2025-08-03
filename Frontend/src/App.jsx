import { Routes, Route } from "react-router-dom"
import MainPage from "./pages/MainPage"
import NotFound from "./pages/NotFound"
import NavbarPrueba from "./components/NavbarPrueba"
import PeliculasPage from "./pages/PeliculasPage"
import ConfiguracionPage from "./pages/ConfiguracionPage"
import FuncionesPage from "./pages/FuncionesPage"
import SalasPage from "./pages/SalasPage"


function App() {
  return (
    <>
    <div className="min-h-screen bg-gray-700 font-montserrat">
      <NavbarPrueba />
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