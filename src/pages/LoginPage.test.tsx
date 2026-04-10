import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from './LoginPage';

const mockLogin = vi.fn();
const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ login: mockLogin }),
}));

const renderPage = () =>
  render(
    <MemoryRouter>
      <LoginPage />
    </MemoryRouter>
  );

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the login form', () => {
    renderPage();
    expect(screen.getByText('Iniciar sesión')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('admin')).toBeInTheDocument();
  });

  it('shows error when username is empty', async () => {
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: /ingresar/i }));
    expect(await screen.findByText('El usuario es obligatorio.')).toBeInTheDocument();
  });

  it('shows error when password is empty', async () => {
    renderPage();
    fireEvent.change(screen.getByPlaceholderText('admin'), {
      target: { value: 'juan' },
    });
    fireEvent.click(screen.getByRole('button', { name: /ingresar/i }));
    expect(await screen.findByText('La contraseña es obligatoria.')).toBeInTheDocument();
  });

  it('shows error when username has invalid characters', async () => {
    renderPage();
    fireEvent.change(screen.getByPlaceholderText('admin'), {
      target: { value: 'juan**' },
    });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /ingresar/i }));
    expect(
      await screen.findByText(/solo puede contener letras/i)
    ).toBeInTheDocument();
  });

  it('calls login and navigates to dashboard on success', async () => {
    mockLogin.mockResolvedValue(undefined);
    renderPage();
    fireEvent.change(screen.getByPlaceholderText('admin'), {
      target: { value: 'juan' },
    });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /ingresar/i }));
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/dashboard'));
  });

  it('shows error message on failed login', async () => {
    mockLogin.mockRejectedValue(new Error('Unauthorized'));
    renderPage();
    fireEvent.change(screen.getByPlaceholderText('admin'), {
      target: { value: 'juan' },
    });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), {
      target: { value: 'wrongpass' },
    });
    fireEvent.click(screen.getByRole('button', { name: /ingresar/i }));
    expect(
      await screen.findByText(/credenciales incorrectas/i)
    ).toBeInTheDocument();
  });
});
