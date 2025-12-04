import * as Yup from "yup";

// Schema para crear salas (requiere todos los campos)
const salasSchema = Yup.object().shape({
  nombreSala: Yup.string()
    .min(1, "Mínimo 1 caracter")
    .max(45, "Máximo 45 caracteres")
    .required("El nombre de la sala es requerido"),

  ubicacion: Yup.string()
    .oneOf(["Ala Derecha", "Ala Izquierda", "Planta Baja", "Sótano", "Primer Piso"], "Ubicación inválida")
    .required("La ubicación es requerida"),

  filas: Yup.number()
    .positive("Debe ser un número positivo")
    .integer("Debe ser un número entero")
    .min(1, "Mínimo 1 fila")
    .max(25, "Máximo 25 filas")
    .required("La cantidad de filas es requerida"),
  asientosPorFila: Yup.number()
    .positive("Debe ser un número positivo")
    .integer("Debe ser un número entero")
    .min(1, "Mínimo 1 asiento por fila")
    .max(25, "Máximo 25 asientos por fila")
    .required("La cantidad de asientos por fila es requerida"),

  vipSeats: Yup.array()
    .of(Yup.string())
    .default([])
    .notRequired()
});

// Schema para actualizar salas (solo nombre, ubicación y vipSeats son opcionales)
const salasUpdateSchema = Yup.object().shape({
  nombreSala: Yup.string()
    .min(1, "Mínimo 1 caracter")
    .max(45, "Máximo 45 caracteres"),

  ubicacion: Yup.string()
    .oneOf(["Ala Derecha", "Ala Izquierda", "Planta Baja", "Sótano", "Primer Piso"], "Ubicación inválida"),

  vipSeats: Yup.array()
    .of(Yup.string())
    .default([])
});

export default salasSchema;
export { salasSchema, salasUpdateSchema };
