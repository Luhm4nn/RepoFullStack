import prisma from "../Prisma/prisma.js";

// Repository for Peliculas


async function getAll() {
    const peliculas = await prisma.pelicula.findMany();
    return peliculas;
}

async function getOne(id) {
    const pelicula = await prisma.pelicula.findUnique({
    where: {
    idPelicula: parseInt(id, 10), 
    },
});
return pelicula;
} 

async function createOne(data) {
    const newPelicula = await prisma.pelicula.create({
        data: {
            nombrePelicula: data.nombrePelicula,
            duracion: data.duracion,
            generoPelicula: data.generoPelicula,
            director: data.director,
            fechaEstreno: data.fechaEstreno,
            sinopsis: data.sinopsis,
            trailerURL: data.trailerURL,
            portada: data.portada,
            MPAA: data.MPAA,
        },
    });
    console.log("Nueva película creada:", newPelicula);
    return newPelicula;
}

async function deleteOne(id) {
    try {
         const peliculaEliminada = await prisma.pelicula.delete({
    where: {
        idPelicula: parseInt(id, 10),
    },
    });
    console.log(peliculaEliminada); 
    } catch (error) {
        if (error.code === 'P2025') {
            console.error("Error: Película no encontrada para eliminar.");//Error de Prisma para "Registro no encontrado"
            return null; // Película no encontrada
        }
        throw error;
    }
}

async function updateOne(id, data) {
    try {
            const updatedPelicula = await prisma.pelicula.update({
        where: {
            idPelicula: parseInt(id, 10),
        },
        data: {
            nombrePelicula: data.nombrePelicula,
            duracion: data.duracion,
            generoPelicula: data.generoPelicula,
            director: data.director,
            fechaEstreno: data.fechaEstreno,
            sinopsis: data.sinopsis,
            trailerURL: data.trailerURL,
            portada: data.portada,
            MPAA: data.MPAA,
        },
    });
    console.log("Película actualizada:");
    return updatedPelicula;  
    } catch (error) {
        if (error.code === 'P2025') {
            console.error("Error: Película no encontrada para actualizar.");
        }     
    }

}  

export { getOne, getAll, createOne, deleteOne , updateOne};