import { Film, Calendar, BarChart3, Armchair, Clock, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getPeliculasEnCartelera } from '../../../api/Peliculas.api';
import { getSalas } from '../../../api/Salas.api';
import { getFuncionesPublicas } from '../../../api/Funciones.api';
import { getLatestReservas } from '../../../api/Reservas.api';

const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalPeliculas: 0,
    totalSalas: 0,
    totalFunciones: 0,
    reservasHoy: 0
  });
  const [ultimasReservas, setUltimasReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingReservas, setLoadingReservas] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [peliculas, salas, funciones, reservas] = await Promise.all([
          getPeliculasEnCartelera(),
          getSalas(),
          getFuncionesPublicas(),
          getLatestReservas(4) // Traer las últimas 4 reservas
        ]);
        
        // Contar reservas de hoy
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        const reservasHoy = reservas.filter(reserva => {
          const fechaReserva = new Date(reserva.fechaHoraReserva);
          fechaReserva.setHours(0, 0, 0, 0);
          return fechaReserva.getTime() === hoy.getTime();
        }).length;

        setStats({
          totalPeliculas: peliculas.length,
          totalSalas: salas.length,
          totalFunciones: funciones.length,
          reservasHoy: reservasHoy
        });

        // Formatear reservas para mostrar
        const reservasFormateadas = reservas.map(reserva => ({
          id: `${reserva.idSala}-${reserva.DNI}`,
          pelicula: reserva.funcion?.pelicula?.nombrePelicula || 'Película no disponible',
          sala: reserva.funcion?.sala?.nombreSala || 'N/A',
          asientos: reserva.cantidadAsientos || 0,
          hora: new Date(reserva.funcion?.fechaHoraFuncion).toLocaleTimeString('es-AR', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          cliente: `Cliente ${reserva.DNI}`,
          fechaReserva: new Date(reserva.fechaHoraReserva)
        }));

        setUltimasReservas(reservasFormateadas);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
        setLoadingReservas(false);
      }
    };

    fetchDashboardData();
  }, []);

  const ocupacionSalas = [
    { sala: 'Sala 1', ocupacion: 85, capacidad: 120 },
    { sala: 'Sala 2', ocupacion: 92, capacidad: 150 },
    { sala: 'Sala 3', ocupacion: 67, capacidad: 100 },
    { sala: 'Sala 4', ocupacion: 45, capacidad: 80 }
  ];

  const menuItems = [
    {
      title: 'Películas',
      description: 'Gestionar películas en cartelera',
      icon: Film,
      link: '/Peliculas',
      gradient: 'from-purple-600 to-blue-600'
    },
    {
      title: 'Salas',
      description: 'Configurar salas y capacidad',
      icon: Armchair,
      link: '/Salas',
      gradient: 'from-green-600 to-teal-500'
    },
    {
      title: 'Funciones',
      description: 'Programar horarios de funciones',
      icon: Calendar,
      link: '/Funciones',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Reportes',
      description: 'Ver estadísticas y reportes',
      icon: BarChart3,
      link: '/admin/reportes',
      gradient: 'from-orange-500 to-red-600'
    }
  ];

  return (
    <div className="p-4 md:p-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Dashboard Admin</h1>
          <p className="text-gray-400 text-sm md:text-base">Bienvenido al panel de administración de Cutzy</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 md:p-6 hover:bg-white/10 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <Film className="w-6 h-6 md:w-8 md:h-8 text-purple-400" />
              {loading ? (
                <div className="animate-pulse bg-slate-700 h-8 w-12 rounded"></div>
              ) : (
                <span className="text-2xl md:text-3xl font-bold text-white">{stats.totalPeliculas}</span>
              )}
            </div>
            <p className="text-xs md:text-sm text-gray-300">Películas en cartelera</p>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 md:p-6 hover:bg-white/10 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <Armchair className="w-6 h-6 md:w-8 md:h-8 text-green-400" />
              {loading ? (
                <div className="animate-pulse bg-slate-700 h-8 w-12 rounded"></div>
              ) : (
                <span className="text-2xl md:text-3xl font-bold text-white">{stats.totalSalas}</span>
              )}
            </div>
            <p className="text-xs md:text-sm text-gray-300">Salas disponibles</p>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 md:p-6 hover:bg-white/10 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-6 h-6 md:w-8 md:h-8 text-blue-400" />
              {loading ? (
                <div className="animate-pulse bg-slate-700 h-8 w-12 rounded"></div>
              ) : (
                <span className="text-2xl md:text-3xl font-bold text-white">{stats.totalFunciones}</span>
              )}
            </div>
            <p className="text-xs md:text-sm text-gray-300">Funciones públicas</p>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 md:p-6 hover:bg-white/10 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-orange-400" />
              {loading ? (
                <div className="animate-pulse bg-slate-700 h-8 w-12 rounded"></div>
              ) : (
                <span className="text-2xl md:text-3xl font-bold text-white">{stats.reservasHoy}</span>
              )}
            </div>
            <p className="text-xs md:text-sm text-gray-300">Reservas hoy</p>
          </div>
        </div>

        {/* Menu Principal */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                onClick={() => window.location.href = item.link}
                className="bg-slate-800/50 hover:bg-white/10 border border-slate-700 rounded-lg p-4 md:p-6 text-left transition-all duration-200 group"
              >
                <div className={`w-12 h-12 md:w-14 md:h-14 bg-gradient-to-r ${item.gradient} rounded-lg flex items-center justify-center mb-3 md:mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-white mb-1 md:mb-2">{item.title}</h3>
                <p className="text-gray-400 text-xs md:text-sm">{item.description}</p>
              </button>
            );
          })}
        </div>

        {/* Sección de Ocupación y Reservas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Ocupación de Salas */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 md:p-6">
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-white">Ocupación de Salas</h2>
            </div>
            
            <div className="space-y-4">
              {ocupacionSalas.map((sala, index) => {
                const porcentaje = Math.round((sala.ocupacion / sala.capacidad) * 100);
                return (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white font-medium text-sm md:text-base">{sala.sala}</span>
                      <span className="text-gray-400 text-xs md:text-sm">
                        {sala.ocupacion}/{sala.capacidad} ({porcentaje}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2 md:h-3 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          porcentaje >= 80 ? 'bg-gradient-to-r from-orange-600 to-red-600' : 
                          porcentaje >= 50 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' : 
                          'bg-gradient-to-r from-green-600 to-teal-500'
                        }`}
                        style={{ width: `${porcentaje}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Últimas Reservas */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 md:p-6">
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-teal-500 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-white">Últimas Reservas</h2>
            </div>
            
            {loadingReservas ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-slate-700/50 rounded-lg p-4 animate-pulse">
                    <div className="h-4 bg-slate-600 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-slate-600 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : ultimasReservas.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                No hay reservas recientes
              </div>
            ) : (
              <div className="space-y-3 md:space-y-4">
                {ultimasReservas.map((reserva) => (
                  <div key={reserva.id} className="bg-slate-700/50 rounded-lg p-3 md:p-4 border border-slate-600 hover:border-slate-500 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="text-white font-semibold text-sm md:text-base">{reserva.pelicula}</h4>
                        <p className="text-gray-400 text-xs md:text-sm">{reserva.cliente}</p>
                      </div>
                      <span className="text-purple-400 font-mono text-xs md:text-sm">{reserva.hora}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs md:text-sm">
                      <span className="text-gray-400">Sala {reserva.sala}</span>
                      <span className="text-gray-300">{reserva.asientos} asientos</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;