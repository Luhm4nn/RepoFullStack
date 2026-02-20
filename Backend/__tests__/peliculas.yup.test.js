import { peliculaSchema } from '../validations/PeliculasSchema.js';

describe('peliculaSchema Yup validation', () => {
  it('valida un objeto válido', async () => {
    const valid = {
      nombrePelicula: 'Test',
      director: 'Director',
      generoPelicula: 'ACCION',
      duracion: 120,
      fechaEstreno: '2024-01-01',
      sinopsis: 'Una sinopsis',
      trailerURL: 'https://youtube.com/test',
    };
    await expect(peliculaSchema.isValid(valid)).resolves.toBe(true);
  });

  it('falla si falta nombrePelicula', async () => {
    const invalid = {
      director: 'Director',
      generoPelicula: 'ACCION',
      duracion: 120,
    };
    await expect(peliculaSchema.isValid(invalid)).resolves.toBe(false);
  });

  it('falla si duración es negativa', async () => {
    const invalid = {
      nombrePelicula: 'Test',
      director: 'Director',
      generoPelicula: 'ACCION',
      duracion: -5,
    };
    await expect(peliculaSchema.isValid(invalid)).resolves.toBe(false);
  });
});
