import { 
    getOne as getOneDB, 
    getAll as getAllDB, 
    createOne as createOneDB, 
    deleteOne as deleteOneDB, 
    updateOne as updateOneDB 
} from './usuarios.repository.js';

export const getAll = async () => {
    const usuarios = await getAllDB();
    return usuarios;
};

export const getOne = async (id) => {
    const usuario = await getOneDB(id);
    return usuario;
};

export const createOne = async (data) => {
    // TODO: Implementar validaciones de negocio aquí
    // Ejemplo: validar formato de email, DNI único, etc.

    const newUsuario = await createOneDB(data);
    return newUsuario;
};

export const deleteOne = async (id) => {
    // TODO: Implementar validaciones de negocio aquí
    // Ejemplo: verificar que no tenga reservas activas antes de eliminar

    const deletedUsuario = await deleteOneDB(id);
    return deletedUsuario;
};

export const updateOne = async (id, data) => {
    const usuarioExistente = await getOneDB(id);
    if (!usuarioExistente) {
        const error = new Error("Usuario no encontrado.");
        error.status = 404;
        throw error;
    }
    
    // TODO: Implementar validaciones de negocio aquí
    // Ejemplo: validar cambios de email, verificar unicidad, etc.

    const updatedUsuario = await updateOneDB(id, data);
    return updatedUsuario;
};
