import * as Yup from "yup";

const peliculaSchema = Yup.object({
  nombrePelicula: Yup.string()
    .required("El nombre de la película es obligatorio")
    .min(2, "Debe tener al menos 2 caracteres"),
  duracion: Yup.number()
    .required("La duración es obligatoria")
    .min(1, "La duración debe ser al menos 1 minuto"),
  generoPelicula: Yup.string()
    .required("El género es obligatorio")
    .min(2, "Debe tener al menos 2 caracteres"),
  director: Yup.string().min(2, "Debe tener al menos 2 caracteres"),
  fechaEstreno: Yup.date().nullable(),
  sinopsis: Yup.string().max(
    500,
    "La sinopsis no puede exceder los 500 caracteres"
  ),
  trailerURL: Yup.string().url("Debe ser una URL válida"),
  portada: Yup.mixed().test(
    "fileSize",
    "El archivo es demasiado grande",
    (value) => {
      if (!value) return true;
      const maxSize = 2 * 1024 * 1024;
      return value.size <= maxSize;
    }
  ),
  MPAA: Yup.string().oneOf(
    ["G", "PG", "PG-13", "R", "NC-17"],
    "Debe ser una clasificación válida"
  ),
});

export default peliculaSchema;
