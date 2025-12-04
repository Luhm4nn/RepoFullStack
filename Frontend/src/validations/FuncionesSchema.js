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
    .test('hora-valida', 'La hora debe estar entre las 08:00 y las 23:59', function(value) {
      if (!value) return false;
      const fecha = new Date(value);
      const horas = fecha.getHours();
      const minutos = fecha.getMinutes();
      
      // Verificar que esté entre 8:00 y 23:59
      if (horas < 8) return false;
      if (horas > 23) return false;
      if (horas === 23 && minutos > 59) return false;
      
      return true;
    })
});

export default funcionesSchema;
export { funcionesSchema };
