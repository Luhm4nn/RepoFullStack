import  prisma  from '../prisma/prisma.js';

export const getPeliculas = async (req, res) => {
  const peliculas = await prisma.pelicula.findMany();
  res.json(peliculas);
};

export const getPelicula = async (req, res) => {
  const { id } = req.params;
  const pelicula = await prisma.pelicula.findUnique({
    where: { id: parseInt(id) }
  });
  res.json(pelicula);
};

export const createPelicula = async (req, res) => {
  const { titulo, genero, duracion } = req.body;
  const nueva = await prisma.pelicula.create({
    data: { titulo, genero, duracion: parseInt(duracion) }
  });
  res.status(201).json(nueva);
};

export const deletePelicula = async (req, res) => {
  const { id } = req.params;
  await prisma.pelicula.delete({
    where: { id: parseInt(id) }
  });
  res.status(204).end();
};

export const updatePelicula = async (req, res) => {
  const { id } = req.params;
  const { titulo, genero, duracion } = req.body;
  const actualizada = await prisma.pelicula.update({
    where: { id: parseInt(id) },
    data: { titulo, genero, duracion: parseInt(duracion) }
  });
  res.json(actualizada);
};
