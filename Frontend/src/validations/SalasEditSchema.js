import * as Yup from "yup";
const salasEditSchema = Yup.object().shape({
  nombreSala: Yup.string()
    .min(1, "Mínimo 1 caracter")
    .max(45, "Máximo 45 caracteres")
    .required("El nombre de la sala es requerido")
    .test("unique", "El nombre de sala ya existe", async function (value) {
      if (!value) return true;
      const exists = await checkSalaExists(value);
      return !exists;
    }),
  
  ubicacion: Yup.string()
    .oneOf(["Ala Derecha", "Ala Izquierda", "Planta Baja", "Sótano", "Primer Piso"], "Ubicación inválida")
    .required("La ubicación es requerida"),
});

export default salasEditSchema;