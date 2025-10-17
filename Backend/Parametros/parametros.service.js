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
    const newParametro = await createOneDB(data);
    return newParametro;
};

export const deleteOne = async (id) => {
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
    const updatedParametro = await updateOneDB(id, data);
    return updatedParametro;
};
