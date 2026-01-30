import { render, screen } from '@testing-library/react';
import { Spinner, ButtonSpinner } from './Spinner';

describe('Spinner', () => {
  it('renderiza con tamaño y variante por defecto', () => {
    render(<Spinner />);
    const spinner = screen.getByRole('status', { name: /cargando/i });
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('w-8 h-8 border-3');
    expect(spinner).toHaveClass('border-purple-600');
  });

  it('renderiza con tamaño y variante custom', () => {
    render(<Spinner size="lg" variant="success" />);
    const spinner = screen.getByRole('status', { name: /cargando/i });
    expect(spinner).toHaveClass('w-12 h-12 border-4');
    expect(spinner).toHaveClass('border-green-500');
  });

  it('acepta className adicional', () => {
    render(<Spinner className="mi-clase" />);
    const spinner = screen.getByRole('status', { name: /cargando/i });
    expect(spinner).toHaveClass('mi-clase');
  });
});

describe('ButtonSpinner', () => {
  it('renderiza un Spinner con variante white', () => {
    render(<ButtonSpinner />);
    const spinner = screen.getByRole('status', { name: /cargando/i });
    expect(spinner).toHaveClass('border-white');
  });
});
