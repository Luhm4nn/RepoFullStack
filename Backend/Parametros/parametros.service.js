import { 
    getOne as getOneDB, 
    getAll as getAllDB, 
    createOne as createOneDB, 
    deleteOne as deleteOneDB, 
    updateOne as updateOneDB 
} from './parametros.repository.js';

export const getAll = async () => {
    const parametros = await getAllDB();
    return parametros;
};

export const getOne = async (id) => {
    const parametro = await getOneDB(id);
    return parametro;
};

export const createOne = async (data) => {
    // TODO: Implementar validaciones de negocio aquí
    // Ejemplo: validar tipo de parámetro, formato del valor, etc.
    
    const newParametro = await createOneDB(data);
    return newParametro;
};

export const deleteOne = async (id) => {
    // TODO: Implementar validaciones de negocio aquí
    // Ejemplo: verificar que no sea un parámetro crítico del sistema
    
    const deletedParametro = await deleteOneDB(id);
    return deletedParametro;
};

export const updateOne = async (id, data) => {
    const parametroExistente = await getOneDB(id);
    if (!parametroExistente) {
        const error = new Error("Parámetro no encontrado.");
        error.status = 404;
        throw error;
    }
    
    // TODO: Implementar validaciones de negocio aquí
    // Ejemplo: validar rangos de valores, impacto en el sistema, etc.
    
    const updatedParametro = await updateOneDB(id, data);
    return updatedParametro;
};
