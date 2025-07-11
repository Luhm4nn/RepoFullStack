import prisma from "../Prisma/prisma.js";

// Repository for Salas

async function getAll() {
    const salas = await prisma.sala.findMany();
    return salas;
}

async function getOne(id) {
    const sala = await prisma.sala.findUnique({
    where: {
    idSala: parseInt(id, 10), 
    },
});
return sala;
} 

async function createOne(data) {
    const newSala = await prisma.sala.create({
        data: {
            ubicacion: data.ubicacion,
            capacidad: data.capacidad,
        },
    });
    console.log("Nueva sala creada.", newSala);
    return newSala;
}

async function deleteOne(id) {
    try {
         const deletedSala = await prisma.sala.delete({
    where: {
        idSala: parseInt(id, 10),
    },
    });
    console.log("Sala eliminada");
    return deletedSala;
    } catch (error) {
        if (error.code === 'P2025') {
            console.error("Error: Sala no encontrada para eliminar.");//Error de Prisma para "Registro no encontrado"
            return null; // Sala no encontrada
        }
        throw error;
    }
}

async function updateOne(id, data) {
    try {
            const updatedSala = await prisma.sala.update({
        where: {
            idSala: parseInt(id, 10),
        },
        data: {
            ubicacion: data.ubicacion,
            capacidad: data.capacidad,
        },
    });
    console.log("Sala actualizada:");
    return updatedSala;  
    } catch (error) {
        if (error.code === 'P2025') {
            console.error("Error: Sala no encontrada para actualizar.");
        }     
    }

}  

export { getOne, getAll, createOne, deleteOne , updateOne};