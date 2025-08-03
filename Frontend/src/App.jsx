import { Routes, Route } from "react-router-dom"
import MainPage from "./pages/MainPage"
import NotFound from "./pages/NotFound"
import AdminNavbar from "./components/AdminNavbar"
import PeliculasPage from "./pages/PeliculasPage"
import ConfiguracionPage from "./pages/ConfiguracionPage"
import FuncionesPage from "./pages/FuncionesPage"
import SalasPage from "./pages/SalasPage"
import FooterComp from "./components/FooterComp"
import Terminos from "./pages/Terminos"
import Privacity from "./pages/Privacity"
import AboutMe from "./pages/AboutMe"
import FAQ from "./pages/FAQ"


function App() {
  return (
    <>
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 font-montserrat">
      <AdminNavbar  />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/Peliculas" element={<PeliculasPage />} />
        <Route path="/Configuracion" element={<ConfiguracionPage />} />
        <Route path="/Funciones" element={<FuncionesPage />} />
        <Route path="/Salas" element={<SalasPage />} />
        <Route path="/Terminos" element={<Terminos/>} />
        <Route path="/Privacity" element={<Privacity/>} />
        <Route path="/AboutMe" element={<AboutMe/>} />
        <Route path="/FAQ" element={<FAQ/>} />
      </Routes>
      <FooterComp />
    </div>
    </>
  )
}

export default App