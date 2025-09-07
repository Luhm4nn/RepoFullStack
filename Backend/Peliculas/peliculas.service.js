import { 
    getOne as getOneDB, 
    getAll as getAllDB, 
    createOne as createOneDB, 
    deleteOne as deleteOneDB, 
    updateOne as updateOneDB 
} from './peliculas.repository.js';

export const getAll = async () => {
    const peliculas = await getAllDB();
    return peliculas;
};

export const getOne = async (id) => {
    const pelicula = await getOneDB(id);
    return pelicula;
};

export const createOne = async (data) => {
    // TODO: Implementar validaciones de negocio aquí
    // Ejemplo: validar fechas de estreno, duración positiva, géneros válidos, etc.
    
    const newPelicula = await createOneDB(data);
    return newPelicula;
};

export const deleteOne = async (id) => {
    // TODO: Implementar validaciones de negocio aquí
    // Ejemplo: verificar que no tenga funciones programadas antes de eliminar
    
    const deletedPelicula = await deleteOneDB(id);
    return deletedPelicula;
};

export const updateOne = async (id, data) => {
    const peliculaExistente = await getOneDB(id);
    if (!peliculaExistente) {
        const error = new Error("Película no encontrada.");
        error.status = 404;
        throw error;
    }
    
    // TODO: Implementar validaciones de negocio aquí
    // Ejemplo: validar cambios de fecha de estreno vs funciones existentes, etc.
    
    const updatedPelicula = await updateOneDB(id, data);
    return updatedPelicula;
};