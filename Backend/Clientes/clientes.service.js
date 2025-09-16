import { 
    getOne as getOneDB, 
    getAll as getAllDB, 
    createOne as createOneDB, 
    deleteOne as deleteOneDB, 
    updateOne as updateOneDB 
} from './clientes.repository.js';

export const getAll = async () => {
    const clientes = await getAllDB();
    return clientes;
};

export const getOne = async (id) => {
    const cliente = await getOneDB(id);
    return cliente;
};

export const createOne = async (data) => {
    // TODO: Implementar validaciones de negocio aquí
    // Ejemplo: validar formato de email, DNI único, etc.
    
    const newCliente = await createOneDB(data);
    return newCliente;
};

export const deleteOne = async (id) => {
    // TODO: Implementar validaciones de negocio aquí
    // Ejemplo: verificar que no tenga reservas activas antes de eliminar
    
    const deletedCliente = await deleteOneDB(id);
    return deletedCliente;
};

export const updateOne = async (id, data) => {
    const clienteExistente = await getOneDB(id);
    if (!clienteExistente) {
        const error = new Error("Cliente no encontrado.");
        error.status = 404;
        throw error;
    }
    
    // TODO: Implementar validaciones de negocio aquí
    // Ejemplo: validar cambios de email, verificar unicidad, etc.
    
    const updatedCliente = await updateOneDB(id, data);
    return updatedCliente;
};
