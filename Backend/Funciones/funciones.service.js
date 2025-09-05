import {getOneDB, getAllDB, createOneDB, deleteOneDB, updateOneDB, getFuncionesBySala} from './funciones.repository.js';
import { getOne as getParametroRepository } from '../Parametros/parametros.repository.js';
import { getOne as getPeliculaRepository } from '../Peliculas/peliculas.repository.js';   

export const getAll = async () => {
    const funciones = await getAllDB();
    return funciones;
};

export const getOne = async (id) => {
    const funcion = await getOneDB(id);
    return funcion;
};

export const createOne = async (data) => {
    const solapamiento = await verificarSolapamientos(data);
    if (solapamiento) {
        return solapamiento;
    }
    const newFuncion = await createOneDB(data);
    return newFuncion;
};

export const deleteOne = async (id) => {
    const deletedFuncion = await deleteOneDB(id);
    return deletedFuncion;
};

export const updateOne = async (id, data) => {
    const funcionExistente = await getOneDB(id);
    if (!funcionExistente) {
        const error = new Error("Función no encontrada.");
        error.status = 404;
        throw error;
    }
    
    // Si se está cambiando la fecha/hora o la sala, verificar solapamientos
    if (data.fechaHoraFuncion || data.idSala || data.idPelicula) {
        const datosParaValidar = {
            idSala: data.idSala || funcionExistente.idSala,
            fechaHoraFuncion: data.fechaHoraFuncion || funcionExistente.fechaHoraFuncion,
            idPelicula: data.idPelicula || funcionExistente.idPelicula
        };
        console.log("Función existente:", funcionExistente);
        console.log("Datos para validar solapamientos:", datosParaValidar);
        const solapamiento = await verificarSolapamientos(datosParaValidar, funcionExistente);
        if (solapamiento) {
            return solapamiento;
        }
    }
    
    const updatedFuncion = await updateOneDB(id, data);
    return updatedFuncion;
};

const verificarSolapamientos = async (nuevaFuncion, funcionExistente = null) => {
    const parametroLimpieza = await getParametroRepository(1);
    if (!parametroLimpieza) {
        const error = new Error("Parámetro de tiempo de limpieza no encontrado.");
        error.status = 404;
        throw error;
    }

    const tiempoLimpieza = parseInt(parametroLimpieza.valor, 10);
    const nuevaPelicula = await getPeliculaRepository(nuevaFuncion.idPelicula);
    if (!nuevaPelicula) {
        const error = new Error("Película no encontrada.");
        error.status = 404;
        throw error;
    }

    const duracionNuevaPelicula = parseInt(nuevaPelicula.duracion, 10);
    const funcionesMismaSala = await getFuncionesBySala(nuevaFuncion.idSala);
    const funcionesFiltradas = funcionesMismaSala.filter(f => 
        !(funcionExistente && 
          f.idSala === funcionExistente.idSala && 
          f.fechaHoraFuncion.getTime() === new Date(funcionExistente.fechaHoraFuncion).getTime())
    );

    const nuevaFechaInicio = new Date(nuevaFuncion.fechaHoraFuncion);
    const nuevaFechaFin = new Date(nuevaFechaInicio.getTime() + (duracionNuevaPelicula * 60000)); 
    
    for (const funcionExistenteSala of funcionesFiltradas) {
        const fechaExistenteInicio = new Date(funcionExistenteSala.fechaHoraFuncion);

        // Obtener duración de la película existente
        const peliculaExistente = await getPeliculaRepository(funcionExistenteSala.idPelicula);
        const duracionExistente = parseInt(peliculaExistente.duracion, 10);
        const fechaExistenteFin = new Date(fechaExistenteInicio.getTime() + (duracionExistente * 60000));
        
        // Verificar solapamiento considerando tiempo de limpieza
        const finExistenteMasLimpieza = new Date(fechaExistenteFin.getTime() + (tiempoLimpieza * 60000));
        const finNuevaMasLimpieza = new Date(nuevaFechaFin.getTime() + (tiempoLimpieza * 60000));
        
        console.log("=== Verificando solapamiento ===");
        console.log("Nueva función:");
        console.log("  Inicio:", nuevaFechaInicio);
        console.log("  Fin:", nuevaFechaFin);
        console.log("  Fin + limpieza:", finNuevaMasLimpieza);
        console.log("Función existente:");
        console.log("  Inicio:", fechaExistenteInicio);
        console.log("  Fin:", fechaExistenteFin);
        console.log("  Fin + limpieza:", finExistenteMasLimpieza);
        console.log("Duración nueva película:", duracionNuevaPelicula, "min");
        console.log("Duración película existente:", duracionExistente, "min");
        console.log("Tiempo de limpieza:", tiempoLimpieza, "min");
        
        // Verificar si hay solapamiento
        const haySolapamiento = (
            (nuevaFechaInicio < finExistenteMasLimpieza && nuevaFechaFin > fechaExistenteInicio) ||
            (fechaExistenteInicio < finNuevaMasLimpieza && fechaExistenteFin > nuevaFechaInicio)
        );
        
        console.log("¿Hay solapamiento?", haySolapamiento);
        console.log("================================");
        
        if (haySolapamiento) {
            const error = new Error(
                `La función se solapa con otra función existente. Se requieren ${tiempoLimpieza} minutos de tiempo de limpieza entre funciones.`
            );
            error.status = 409;
            error.name = "Solapamiento";
            return error;
        }
    }
    
    // Si llegamos aquí, no hay solapamientos
    return null;
};