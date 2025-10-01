import { 
    getOne as getOneDB, 
    getAll as getAllDB, 
    createOne as createOneDB, 
    deleteOne as deleteOneDB, 
    updateOne as updateOneDB, 
    getAllEnCartelera as getAllEnCarteleraDB
} from './peliculas.repository.js';
import { getFuncionesByPeliculaId } from '../Funciones/funciones.service.js';
import { formatDateForBackendMessage } from '../utils/dateFormater.js';
import { cloudinary } from '../config/cloudinary.js';


export const getAll = async () => {
    const peliculas = await getAllDB();
    return peliculas;
};

export const getOne = async (id) => {
    const pelicula = await getOneDB(id);
    return pelicula;
};

export const createOne = async (data) => {
    // TODO: Implementar validaciones de negocio aquí (Valibot)
    // Ejemplo: validar fechas de estreno, duración positiva, géneros válidos, etc.

    const movieDataToCreate = {
        ...data,
        duracion: data.duracion ? parseInt(data.duracion, 10) : 0,
    };
    
    const newPelicula = await createOneDB(movieDataToCreate);
    return newPelicula;
};

export const deleteOne = async (id) => {
    const peliculaExistente = await getOneDB(id);
    
    // Si tiene póster en Cloudinary se elimina también
    if (peliculaExistente?.portadaPublicId) {
        try {
            await cloudinary.uploader.destroy(peliculaExistente.portadaPublicId);
            console.log('Póster eliminado de Cloudinary:', peliculaExistente.portadaPublicId);
        } catch (error) {
            console.error('Error eliminando póster de Cloudinary:', error);
        }
    }
    
    // Implementar validaciones de negocio aquí
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

    const errorValidations = await validationsEstreno({ id, ...data });
    if(errorValidations){
        return errorValidations;
    }

    // Si se subió un nuevo póster y existe uno anterior, eliminar el anterior
    if (data.portada && peliculaExistente.portadaPublicId) {
        try {
            await cloudinary.uploader.destroy(peliculaExistente.portadaPublicId);
            console.log('Póster anterior eliminado de Cloudinary:', peliculaExistente.portadaPublicId);
        } catch (error) {
            console.error('Error eliminando póster anterior de Cloudinary:', error);
        }
    }

    const movieDataToUpdate = {
        ...data,
        duracion: data.duracion ? parseInt(data.duracion, 10) : 0,
    };
    
    const updatedPelicula = await updateOneDB(id, movieDataToUpdate);
    return updatedPelicula;
};

export const getAllEnCartelera = async () => {
    const peliculas = await getAllEnCarteleraDB();
    return peliculas;
};

async function validationsEstreno (data) {
    const fechaNueva = new Date(data.fechaEstreno);
    const funciones = await getFuncionesByPeliculaId(data.id);
    if (funciones && funciones.length > 0) {
        for (const funcion of funciones) {
            if (new Date(funcion.fechaHoraFuncion) < fechaNueva) {
                const fechaEstrenoFormateada = formatDateForBackendMessage(fechaNueva);
                const error = new Error(`No se puede cambiar la fecha de estreno al ${fechaEstrenoFormateada} porque ya hay funciones programadas anteriormente.`);
                error.status = 400;
                error.name = "FECHA_ESTRENO";
                return error;
            }
        }
    }
    return null;
}