import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import App from './App';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('App', () => {
  it('loads data and allows filtering', async () => {
    const user = userEvent.setup();

    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => [
        { name: 'Ana', postCount: 4 },
        { name: 'Pedro', postCount: 2 },
        { name: 'Maria', postCount: 1 },
      ],
    });

    render(<App />);

    expect(screen.getByText(/Cargando posts/)).toBeInTheDocument();

    await waitFor(() => expect(screen.getAllByTestId('posts-row')).toHaveLength(3));

    const input = screen.getByLabelText(/Filtrar por nombre/);
    await user.type(input, 'pe');

    expect(screen.getAllByTestId('posts-row')).toHaveLength(1);
    expect(screen.getByText('Pedro')).toBeInTheDocument();
  });

  it('shows an error message when the request fails', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      json: async () => ({}),
    });
    vi.spyOn(console, 'error').mockImplementation(() => {});

    render(<App />);

    await waitFor(() =>
      expect(screen.getByText('No se pudieron cargar los datos. Inténtalo nuevamente.')).toBeInTheDocument(),
    );
  });
});
