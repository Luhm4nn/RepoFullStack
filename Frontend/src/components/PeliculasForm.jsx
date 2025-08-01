import { Formik, Form, Field, ErrorMessage } from "formik";
import peliculaSchema from "../validations/PeliculasSchema";


export default function PeliculasForm({ onSubmit }) {
  return (
    <Formik
      initialValues={{ nombrePelicula: "", duracion: "", generoPelicula: "", director: "", fechaEstreno: "", sinopsis: "", trailerURL: "", portada: "", MPAA: "" }}
      validationSchema={peliculaSchema}
      onSubmit={(values, { resetForm }) => {
        onSubmit(values); 
        resetForm(); 
      }}
    >
      {({ isSubmitting }) => (
        <Form >
          <label>Nombre de la Película</label>
          <Field name="nombrePelicula" placeholder="Ej. Star Wars" />
          <ErrorMessage name="nombrePelicula" component="span" style={{ color: "red", fontSize: "12px" }} />

          <label>Director</label>
          <Field name="director" placeholder="Ej. Christopher Nolan" />
          <ErrorMessage name="director" component="span" style={{ color: "red", fontSize: "12px" }} />

          <label>Año</label>
          <Field name="anio" type="number" placeholder="Ej. 2010" />
          <ErrorMessage name="anio" component="span" style={{ color: "red", fontSize: "12px" }} />

          <button type="submit" disabled={isSubmitting}>Guardar</button>
        </Form>
      )}
    </Formik>
  );
}
