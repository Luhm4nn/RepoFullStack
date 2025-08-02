## Diego Lezcano

## Emiliano Luhmann

## Resueltas

- En los CRUDS Reserva y Asiento Reseva, como manejar las rutas, pasarlo por body o hacer que, por ejemplo, la reserva dependa
  del Cliente y la Funcion en routes, y esta de la Sala y Pelicula y asi sucesivamente.
- Con lo de arriba, deberia cambiar los gets por ej de Funcion, y obtendria para cada sala y pelicula, sus determinadas funciones, o las reservas
  de una determinada funcion, y no todas las reservas, o quizas las activas. Usar el criterio como si fuese de entidad debil como en asientos
  de una sala?
- Tema Claves primarias y problema con la fecha del momento en fechaHoraReserva.
- Que pasa si yo modifico un atributo que esta referenciado en otro lado como FK. Ejemplo: le modifico el DNI a un cliente, esto
  no debería modificarlo en sus reservas? Luego si intento esto, no me deja y creo que ese es el problema.
