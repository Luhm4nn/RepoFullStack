import {
    getOneDB, 
    getAllDB, 
    createOneDB, 
    deleteOneDB,
    updateOneDB, 
    getFuncionesBySala, 
    getFuncionesByPelicula, 
    getActiveFuncionesBD,
    getPublicFuncionesBD, 
    getInactiveFuncionesBD, 
    getFuncionesSemanaDB } from './funciones.repository.js';
import { getOne as getParametroRepository } from '../Parametros/parametros.repository.js';
import { getOne as getPeliculaRepository } from '../Peliculas/peliculas.repository.js';
import { formatDateForBackendMessage } from '../utils/dateFormater.js';   


export const getAll = async () => {
    const funciones = await getAllDB();
    return funciones;
};

export const getOne = async (id) => {
    const funcion = await getOneDB(id);
    return funcion;
};

export const getActiveFunciones = async () => {
    const funciones = await getActiveFuncionesBD();
    return funciones;
};

export const getInactiveFunciones = async () => {
    const funciones = await getInactiveFuncionesBD();
    return funciones;
};

export const getPublicFunciones = async () => {
    const funciones = await getPublicFuncionesBD();
    return funciones;
}

export const createOne = async (data) => {
    const solapamiento = await verificarSolapamientos(data);
    const estrenoProblem = await verificarFechaDeEstreno(data);
    if (solapamiento) {
        return solapamiento;
    }
    if (estrenoProblem) {
        return estrenoProblem;
    }
    const newFuncion = await createOneDB(data);
    return newFuncion;
};

export const deleteOne = async (id) => {
    const funcion = await getOneDB(id);
    if (!funcion) {
        const error = new Error("Función no encontrada.");
        error.status = 404;
        throw error;
    }
    
    if (funcion.estado !== 'Privada' && funcion.estado !== 'Inactiva') {
        const error = new Error("Solo se pueden eliminar funciones privadas o inactivas.");
        error.status = 403;
        throw error;
    }
    
    const deletedFuncion = await deleteOneDB(id);
    return deletedFuncion;
};

export const getFuncionesByPeliculaId = async (idPelicula) => {
    const funciones = await getFuncionesByPelicula(idPelicula);
    return funciones;
};

export const updateOne = async (id, data) => {
    const funcionExistente = await getOneDB(id);
    if (!funcionExistente) {
        const error = new Error("Función no encontrada.");
        error.status = 404;
        throw error;
    }
    
        // Validations for update
    if (data.estado) {
        if (data.estado !== 'Privada' && data.estado !== 'Publica' && data.estado !== 'Inactiva') {
            const error = new Error("Estado inválido. Solo se permiten: Privada, Publica, Inactiva.");
            error.status = 400;
            throw error;
        }
    } else if (funcionExistente.estado !== "Privada") {
        const error = new Error("No se puede actualizar una función pública o inactiva, excepto para cambiar su estado.");
        error.status = 403;
        throw error;
    }
    
     // if Date, Sala or Pelicula is being changed, check for overlaps
    if (data.fechaHoraFuncion || data.idSala || data.idPelicula) {
        const datosParaValidar = {
            idSala: data.idSala || funcionExistente.idSala,
            fechaHoraFuncion: data.fechaHoraFuncion || funcionExistente.fechaHoraFuncion,
            idPelicula: data.idPelicula || funcionExistente.idPelicula
        };
        const solapamiento = await verificarSolapamientos(datosParaValidar, funcionExistente);
        const estrenoProblem = await verificarFechaDeEstreno(datosParaValidar, funcionExistente);
        if (solapamiento) {
            return solapamiento;
        }
        if (estrenoProblem) {
            return estrenoProblem;
        }
    }
    
    const updatedFuncion = await updateOneDB(id, data);
    return updatedFuncion;
};

export const getFuncionesByPeliculaAndFechaService = async (idPelicula, fecha) => {
    if (fecha === 'semana') {
        const hoy = new Date();
        const sieteDiasDespues = new Date();
        sieteDiasDespues.setDate(hoy.getDate() + 7);
        const funciones = await getFuncionesSemanaDB(
            idPelicula,
            hoy,
            sieteDiasDespues
        );
        return funciones;
    }
    const fechaFormateada = fecha; 
    const funciones = await getFuncionesByPeliculaAndFecha(idPelicula, fechaFormateada);
    return funciones;
};
// validation functions

const verificarFechaDeEstreno = async (nuevaFuncion, funcionExistente = null) => {
    const pelicula = await getPeliculaRepository(nuevaFuncion.idPelicula);
    if (!pelicula) {
        const error = new Error("Película no encontrada.");
        error.status = 404;
        throw error;
    }

    const fechaEstreno = new Date(pelicula.fechaEstreno);
    const fechaFinNueva = new Date(nuevaFuncion.fechaHoraFuncion);
    fechaFinNueva.setMinutes(fechaFinNueva.getMinutes() + parseInt(pelicula.duracion, 10));

    if (fechaFinNueva < fechaEstreno) {
        const fechaEstrenoFormateada = formatDateForBackendMessage(fechaEstreno);
        const error = new Error(`La película "${pelicula.nombrePelicula}" se estrena el ${fechaEstrenoFormateada}. La función no puede programarse antes del estreno de la película.`);
        error.status = 400;
        error.name = "FECHA_ESTRENO_INVALIDA";
        return error;
    }

    return null;
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
        
        // Verificar si hay solapamiento
        const haySolapamiento = (
            (nuevaFechaInicio < finExistenteMasLimpieza && nuevaFechaFin > fechaExistenteInicio) ||
            (fechaExistenteInicio < finNuevaMasLimpieza && fechaExistenteFin > nuevaFechaInicio)
        );        
        
        if (haySolapamiento) {
            const error = new Error(
                `La función se solapa con otra función existente. Se requieren ${tiempoLimpieza} minutos de tiempo de limpieza entre funciones.`
            );
            error.status = 409;
            error.name = "SOLAPAMIENTO_FUNCIONES";
            return error;
        }
    }
    
    // Si llegamos aquí, no hay solapamientos
    return null;
};