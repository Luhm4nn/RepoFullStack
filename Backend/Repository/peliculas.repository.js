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

export { getOne, getAll };