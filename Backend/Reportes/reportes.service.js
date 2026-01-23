import * as reportesRepository from './reportes.repository.js';

export const getDashboardStats = async () => {
  return await reportesRepository.getDashboardStats();
};

export const getVentasMensuales = async () => {
  const reservas = await reportesRepository.getReservasAnuales();

  // Generate last 12 months labels
  const now = new Date();
  const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const categories = [];
  const ventasPorMes = Array(12).fill(0);
  const ingresosPorMes = Array(12).fill(0);

  // Build month labels for last 12 months
  for (let i = 11; i >= 0; i--) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
    categories.push(monthNames[monthDate.getMonth()]);
  }

  // Group reservations by month index (0-11 where 0 is oldest, 11 is current)
  reservas.forEach(reserva => {
    const reservaDate = new Date(reserva.fechaHoraReserva);
    const monthsDiff = (now.getFullYear() - reservaDate.getFullYear()) * 12 + (now.getMonth() - reservaDate.getMonth());
    const monthIndex = 11 - monthsDiff; // Reverse index: oldest at 0, newest at 11
    
    if (monthIndex >= 0 && monthIndex < 12) {
      ventasPorMes[monthIndex] += 1;
      ingresosPorMes[monthIndex] += Number(reserva.total);
    }
  });

  return {
    series: [
      {
        name: 'Ventas (Tickets)',
        data: ventasPorMes
      },
      {
        name: 'Ingresos ($)',
        data: ingresosPorMes
      }
    ],
    categories
  };
};


export const getAsistenciaReservas = async () => {
    const reservas = await reportesRepository.getAsistenciaReservas();

    // Generate last 12 months labels
    const now = new Date();
    const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const categories = [];
    const asistidasPorMes = Array(12).fill(0);
    const noAsistidasPorMes = Array(12).fill(0);

    // Build month labels for last 12 months
    for (let i = 11; i >= 0; i--) {
        const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
        categories.push(monthNames[monthDate.getMonth()]);
    }

    // Group reservations by month index (0-11 where 0 is oldest, 11 is current)
    reservas.forEach(reserva => {
        const reservaDate = new Date(reserva.fechaHoraReserva);
        const monthsDiff = (now.getFullYear() - reservaDate.getFullYear()) * 12 + (now.getMonth() - reservaDate.getMonth());
        const monthIndex = 11 - monthsDiff; // Reverse index: oldest at 0, newest at 11
        
        if (monthIndex >= 0 && monthIndex < 12) {
            if (reserva.estado === 'ASISTIDA') {
                asistidasPorMes[monthIndex] += 1;
            } else if (reserva.estado === 'NO_ASISTIDA') {
                noAsistidasPorMes[monthIndex] += 1;
            }
        }
    });

    return {
        series: [
            {
                name: 'Asistidas',
                data: asistidasPorMes
            },
            {
                name: 'No Asistidas',
                data: noAsistidasPorMes
            }
        ],
        categories
    };
};

export const getOcupacionSalas = async () => {
    const ocupacionRaw = await reportesRepository.getOcupacionRaw();

    const data = ocupacionRaw.map(o => {
        const capacity = Number(o.capacidadPorFuncion) * Number(o.cantidadFunciones || 1);
        const sold = Number(o.totalAsientosVendidos);
        const percentage = capacity > 0 ? ((sold / capacity) * 100).toFixed(1) : 0;
        
        return {
            name: o.nombreSala,
            y: Number(percentage),
            sold: sold,
            capacity: capacity
        };
    });

    return {
        series: data.map(d => d.y),
        labels: data.map(d => d.name)
    };
};
