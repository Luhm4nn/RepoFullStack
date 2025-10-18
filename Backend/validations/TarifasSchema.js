import * as Yup from "yup";

const tarifasSchema = Yup.object().shape({
  descripcionTarifa: Yup.string()
    .required("La descripción es requerida")
    .min(3, "La descripción debe tener al menos 3 caracteres")
    .max(100, "La descripción no puede exceder 100 caracteres"),
  precio: Yup.number()
    .required("El precio es requerido")
    .positive("El precio debe ser un número positivo")
    .min(0.01, "El precio debe ser mayor a 0")
});

export default tarifasSchema;
export { tarifasSchema };