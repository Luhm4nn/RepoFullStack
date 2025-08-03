import * as Yup from "yup";

const peliculaSchema = Yup.object().shape({
  nombrePelicula: Yup.string()
    .min(2, "Muy corto")
    .max(100, "Muy largo")
    .required("El nombre es requerido"),
  
  director: Yup.string()
    .min(2, "Muy corto")
    .max(50, "Muy largo")
    .required("El director es requerido"),
  
  generoPelicula: Yup.string()
    .required("El género es requerido"),
  
  duracion: Yup.number()
    .positive("Debe ser un número positivo")
    .integer("Debe ser un número entero")
    .min(1, "Mínimo 1 minuto")
    .max(500, "Máximo 500 minutos")
    .required("La duración es requerida"),
  
  fechaEstreno: Yup.date()
    .nullable(),
  
  sinopsis: Yup.string()
    .max(1000, "Máximo 1000 caracteres"),
  
  trailerURL: Yup.string()
    .url("Debe ser una URL válida")
    .nullable(),
  
  portada: Yup.string()
    .url("Debe ser una URL válida")
    .nullable(),
  
  MPAA: Yup.string()
    .oneOf(["G", "PG", "PG-13", "R", "NC-17"], "Clasificación inválida")
    .nullable()
});

export default peliculaSchema;