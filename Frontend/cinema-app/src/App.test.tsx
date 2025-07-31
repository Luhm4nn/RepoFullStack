import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders cinema app title', () => {
  render(<App />);
  const titleElement = screen.getByText(/Bienvenido a Cinema App/i);
  expect(titleElement).toBeInTheDocument();
});

test('renders navigation features', () => {
  render(<App />);
  const moviesFeature = screen.getByText(/Ver Películas/i);
  const ticketsFeature = screen.getByText(/Reservar Boletos/i);
  const seatsFeature = screen.getByText(/Seleccionar Asientos/i);
  
  expect(moviesFeature).toBeInTheDocument();
  expect(ticketsFeature).toBeInTheDocument();
  expect(seatsFeature).toBeInTheDocument();
});
