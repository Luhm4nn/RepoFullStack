import { Formik, Form, Field, ErrorMessage } from "formik";
import { Button, Label, TextInput, Textarea, Select } from "flowbite-react";
import peliculaSchema from "../validations/PeliculasSchema";

export default function PeliculasForm({ onSubmit }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Agregar Nueva Película</h2>
      
      <Formik
        initialValues={{ 
          nombrePelicula: "", 
          duracion: "", 
          generoPelicula: "", 
          director: "", 
          fechaEstreno: "", 
          sinopsis: "", 
          trailerURL: "", 
          portada: "", 
          MPAA: "" 
        }}
        validationSchema={peliculaSchema}
        onSubmit={(values, { resetForm, setSubmitting }) => {
          onSubmit(values); 
          resetForm(); 
          setSubmitting(false);
        }}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nombre de la Película */}
              <div>
                <Label htmlFor="nombrePelicula" value="Nombre de la Película *" />
                <Field
                  as={TextInput}
                  name="nombrePelicula"
                  placeholder="Ej. Avengers: Endgame"
                  required
                />
                <ErrorMessage name="nombrePelicula" component="span" className="text-red-500 text-sm" />
              </div>

              {/* Director */}
              <div>
                <Label htmlFor="director" value="Director *" />
                <Field
                  as={TextInput}
                  name="director"
                  placeholder="Ej. Christopher Nolan"
                  required
                />
                <ErrorMessage name="director" component="span" className="text-red-500 text-sm" />
              </div>

              {/* Género */}
              <div>
                <Label htmlFor="generoPelicula" value="Género *" />
                <Field as={Select} name="generoPelicula" required>
                  <option value="">Selecciona un género</option>
                  <option value="Accion">Acción</option>
                  <option value="Drama">Drama</option>
                  <option value="Comedia">Comedia</option>
                  <option value="Terror">Terror</option>
                  <option value="Ciencia Ficcion">Ciencia Ficción</option>
                  <option value="Romance">Romance</option>
                  <option value="Thriller">Thriller</option>
                  <option value="Aventura">Aventura</option>
                  <option value="Animacion">Animación</option>
                  <option value="Documental">Documental</option>
                </Field>
                <ErrorMessage name="generoPelicula" component="span" className="text-red-500 text-sm" />
              </div>

              {/* Duración */}
              <div>
                <Label htmlFor="duracion" value="Duración (minutos) *" />
                <Field
                  as={TextInput}
                  name="duracion"
                  type="number"
                  placeholder="120"
                  required
                />
                <ErrorMessage name="duracion" component="span" className="text-red-500 text-sm" />
              </div>

              {/* Fecha de Estreno */}
              <div>
                <Label htmlFor="fechaEstreno" value="Fecha de Estreno" />
                <Field
                  as={TextInput}
                  name="fechaEstreno"
                  type="date"
                />
                <ErrorMessage name="fechaEstreno" component="span" className="text-red-500 text-sm" />
              </div>

              {/* Clasificación MPAA */}
              <div>
                <Label htmlFor="MPAA" value="Clasificación MPAA" />
                <Field as={Select} name="MPAA">
                  <option value="">Selecciona clasificación</option>
                  <option value="G">G - Audiencia General</option>
                  <option value="PG">PG - Se sugiere supervisión</option>
                  <option value="PG-13">PG-13 - Mayores de 13 años</option>
                  <option value="R">R - Restringida</option>
                  <option value="NC-17">NC-17 - Solo adultos</option>
                </Field>
                <ErrorMessage name="MPAA" component="span" className="text-red-500 text-sm" />
              </div>
            </div>

            {/* Sinopsis */}
            <div>
              <Label htmlFor="sinopsis" value="Sinopsis" />
              <Field
                as={Textarea}
                name="sinopsis"
                placeholder="Descripción de la película..."
                rows={4}
              />
              <ErrorMessage name="sinopsis" component="span" className="text-red-500 text-sm" />
            </div>

            {/* URL del Trailer */}
            <div>
              <Label htmlFor="trailerURL" value="URL del Trailer" />
              <Field
                as={TextInput}
                name="trailerURL"
                placeholder="https://youtube.com/watch?v=..."
              />
              <ErrorMessage name="trailerURL" component="span" className="text-red-500 text-sm" />
            </div>

            {/* URL de la Portada */}
            <div>
              <Label htmlFor="portada" value="URL de la Portada" />
              <Field
                as={TextInput}
                name="portada"
                placeholder="https://imagen.com/poster.jpg"
              />
              <ErrorMessage name="portada" component="span" className="text-red-500 text-sm" />
            </div>

            {/* Botones */}
            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={isSubmitting} color="blue">
                {isSubmitting ? "Guardando..." : "Guardar Película"}
              </Button>
              <Button type="button" color="gray" onClick={() => window.location.reload()}>
                Cancelar
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}