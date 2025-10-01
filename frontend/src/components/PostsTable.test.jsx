import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import PostsTable from './PostsTable';

describe('PostsTable', () => {
  it('shows a row for each item provided', () => {
    const rows = [
      { name: 'Ana', postCount: 3 },
      { name: 'Pedro', postCount: 1 },
    ];

    render(<PostsTable rows={rows} />);

    expect(screen.getByText('Usuario')).toBeInTheDocument();
    expect(screen.getAllByTestId('posts-row')).toHaveLength(2);
    expect(screen.getByText('Ana')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('shows empty message when no rows are provided', () => {
    render(<PostsTable rows={[]} emptyMessage="Sin resultados" />);

    expect(screen.getByText('Sin resultados')).toBeInTheDocument();
  });
});
