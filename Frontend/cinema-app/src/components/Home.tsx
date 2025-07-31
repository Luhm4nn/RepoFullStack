import React from 'react';
import { Box, Typography, Button, Card, CardContent, CardActions } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MovieIcon from '@mui/icons-material/Movie';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import EventSeatIcon from '@mui/icons-material/EventSeat';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: 'Ver Películas',
      description: 'Explora nuestra cartelera de películas disponibles',
      icon: <MovieIcon sx={{ fontSize: 40 }} />,
      action: () => navigate('/movies')
    },
    {
      title: 'Reservar Boletos',
      description: 'Reserva tus boletos de manera fácil y rápida',
      icon: <ConfirmationNumberIcon sx={{ fontSize: 40 }} />,
      action: () => console.log('Reservar boletos')
    },
    {
      title: 'Seleccionar Asientos',
      description: 'Elige los mejores asientos para tu función',
      icon: <EventSeatIcon sx={{ fontSize: 40 }} />,
      action: () => console.log('Seleccionar asientos')
    }
  ];

  return (
    <Box>
      <Typography variant="h3" component="h1" gutterBottom align="center">
        Bienvenido a Cinema App
      </Typography>
      <Typography variant="h6" component="p" gutterBottom align="center" color="text.secondary" sx={{ mb: 4 }}>
        Tu portal para disfrutar del mejor cine
      </Typography>
      
      <Box 
        sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
          gap: 4 
        }}
      >
        {features.map((feature, index) => (
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }} key={index}>
            <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
              <Box sx={{ mb: 2, color: 'primary.main' }}>
                {feature.icon}
              </Box>
              <Typography variant="h5" component="h2" gutterBottom>
                {feature.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {feature.description}
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
              <Button variant="contained" onClick={feature.action}>
                Explorar
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default Home;