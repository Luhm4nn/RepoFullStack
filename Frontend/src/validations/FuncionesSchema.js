import * as Yup from 'yup';

const funcionesSchema = Yup.object().shape({
  idSala: Yup.string()
    .required('La sala es obligatoria'),
  
  idPelicula: Yup.string()
    .required('La película es obligatoria'),
  
  fechaHoraFuncion: Yup.string()
    .required('La fecha y hora son obligatorias')
    .test('fecha-futura', 'La fecha debe ser futura', function(value) {
      if (!value) return false;
      const fechaFuncion = new Date(value);
      const ahora = new Date();
      return fechaFuncion > ahora;
    })
});

export default funcionesSchema;