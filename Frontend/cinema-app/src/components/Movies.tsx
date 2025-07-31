import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  CardMedia, 
  Button,
  CircularProgress,
  Alert
} from '@mui/material';
import axios from 'axios';

interface Movie {
  id: number;
  titulo: string;
  director: string;
  genero: string;
  duracion: number;
  clasificacion: string;
  descripcion?: string;
}

const Movies: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        // Intentar conectar con el backend
        const response = await axios.get('http://localhost:3001/api/peliculas');
        setMovies(response.data);
        setError(null);
      } catch (err) {
        console.log('Backend no disponible, usando datos de ejemplo');
        // Si el backend no está disponible, usar datos de ejemplo
        setMovies([
          {
            id: 1,
            titulo: 'Avatar: El Camino del Agua',
            director: 'James Cameron',
            genero: 'Ciencia Ficción',
            duracion: 192,
            clasificacion: 'PG-13',
            descripcion: 'Secuela de Avatar donde Jake Sully vive con su nueva familia en el planeta de Pandora.'
          },
          {
            id: 2,
            titulo: 'Top Gun: Maverick',
            director: 'Joseph Kosinski',
            genero: 'Acción',
            duracion: 130,
            clasificacion: 'PG-13',
            descripcion: 'Pete "Maverick" Mitchell regresa después de más de 30 años de servicio como uno de los mejores aviadores de la Marina.'
          },
          {
            id: 3,
            titulo: 'Spider-Man: No Way Home',
            director: 'Jon Watts',
            genero: 'Superhéroes',
            duracion: 148,
            clasificacion: 'PG-13',
            descripcion: 'Peter Parker busca la ayuda de Doctor Strange para hacer que todos olviden la identidad de Spider-Man.'
          }
        ]);
        setError('Conectando con datos de ejemplo (backend no disponible)');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Cartelera de Películas
      </Typography>
      
      {error && (
        <Alert severity="info" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
          gap: 3
        }}
      >
        {movies.map((movie) => (
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }} key={movie.id}>
            <CardMedia
              component="div"
              sx={{
                height: 200,
                backgroundColor: 'grey.200',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Typography variant="h6" color="text.secondary">
                Poster de {movie.titulo}
              </Typography>
            </CardMedia>
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h6" component="h2" gutterBottom>
                {movie.titulo}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Director: {movie.director}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Género: {movie.genero}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Duración: {movie.duracion} min
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Clasificación: {movie.clasificacion}
              </Typography>
              {movie.descripcion && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {movie.descripcion}
                </Typography>
              )}
            </CardContent>
            <Box sx={{ p: 2 }}>
              <Button variant="contained" fullWidth>
                Ver Horarios
              </Button>
            </Box>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default Movies;