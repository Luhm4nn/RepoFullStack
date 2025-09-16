import * as Yup from "yup";
const salasEditSchema = Yup.object().shape({
  ubicacion: Yup.string()
    .oneOf(["Ala Derecha", "Ala Izquierda", "Planta Baja", "Sótano", "Primer Piso"], "Ubicación inválida")
    .required("La ubicación es requerida"),
});

export default salasEditSchema;