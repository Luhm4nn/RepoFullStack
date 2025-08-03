import * as Yup from "yup";

const salasSchema = Yup.object().shape({
  ubicacion: Yup.string()
    .oneOf(["Ala Derecha", "Ala Izquierda", "Planta Baja", "Sótano", "Primer Piso"], "Ubicación inválida")
    .required("La ubicación es requerida"),
  
  filas: Yup.number()
    .positive("Debe ser un número positivo")
    .integer("Debe ser un número entero")
    .min(1, "Mínimo 1 fila")
    .max(100, "Máximo 100 filas")
    .required("La cantidad de filas es requerida"),
  
  asientosPorFila: Yup.number()
    .positive("Debe ser un número positivo")
    .integer("Debe ser un número entero")
    .min(1, "Mínimo 1 asiento por fila")
    .max(100, "Máximo 100 asientos por fila")
    .required("La cantidad de asientos por fila es requerida"),
});

export default salasSchema;