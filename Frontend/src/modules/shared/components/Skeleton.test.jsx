import { render, screen } from '@testing-library/react';
import { Skeleton, TableSkeleton, CardSkeleton, TextSkeleton, CircleSkeleton } from './Skeleton';

describe('Skeleton', () => {
  it('renderiza con props por defecto', () => {
    render(<Skeleton />);
    const skeleton = screen.getByRole('presentation', { hidden: true });
    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveClass('animate-pulse');
  });

  it('renderiza con variante circle', () => {
    render(<Skeleton variant="circle" />);
    const skeleton = screen.getByRole('presentation', { hidden: true });
    expect(skeleton).toHaveClass('rounded-full');
  });

  it('acepta className adicional', () => {
    render(<Skeleton className="mi-clase" />);
    const skeleton = screen.getByRole('presentation', { hidden: true });
    expect(skeleton).toHaveClass('mi-clase');
  });
});

describe('CircleSkeleton', () => {
  it('renderiza un skeleton circular con tamaño custom', () => {
    render(<CircleSkeleton size="w-12 h-12" />);
    const skeleton = screen.getByRole('presentation', { hidden: true });
    expect(skeleton).toHaveClass('rounded-full');
    expect(skeleton).toHaveClass('w-12');
    expect(skeleton).toHaveClass('h-12');
  });
});
