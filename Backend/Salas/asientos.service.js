import { 
    getOne as getOneDB, 
    getAll as getAllDB, 
    createOne as createOneDB, 
    deleteOne as deleteOneDB, 
    updateOne as updateOneDB 
} from './asientos.repository.js';

export const getAll = async () => {
    const asientos = await getAllDB();
    return asientos;
};

export const getOne = async (id) => {
    const asiento = await getOneDB(id);
    return asiento;
};

export const createOne = async (data) => {
    // TODO: Implementar validaciones de negocio aquí
    // Ejemplo: validar que no exista asiento en misma posición, validar sala, etc.
    
    const newAsiento = await createOneDB(data);
    return newAsiento;
};

export const deleteOne = async (id) => {
    // TODO: Implementar validaciones de negocio aquí
    // Ejemplo: verificar que no tenga reservas activas antes de eliminar
    
    const deletedAsiento = await deleteOneDB(id);
    return deletedAsiento;
};

export const updateOne = async (id, data) => {
    const asientoExistente = await getOneDB(id);
    if (!asientoExistente) {
        const error = new Error("Asiento no encontrado.");
        error.status = 404;
        throw error;
    }
    
    // TODO: Implementar validaciones de negocio aquí
    // Ejemplo: validar cambios de estado, verificar disponibilidad, etc.
    
    const updatedAsiento = await updateOneDB(id, data);
    return updatedAsiento;
};
