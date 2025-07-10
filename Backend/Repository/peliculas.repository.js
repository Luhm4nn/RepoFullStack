import prisma from "../prisma/prisma.js";

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
            fechaEstreno: null, // Assuming fechaEstreno is not provided in data
            sinopsis: data.sinopsis,
            trailerURL: data.trailerURL,
            portada: data.portada,
            MPAA: data.MPAA,
        },
    });
    console.log("Nueva película creada:", newPelicula);
    return newPelicula;
}

export { getOne, getAll, createOne };