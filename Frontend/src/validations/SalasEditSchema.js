import * as Yup from "yup";
const salasEditSchema = Yup.object().shape({
  ubicacion: Yup.string().required("La ubicación es requerida"),
});

export default salasEditSchema;