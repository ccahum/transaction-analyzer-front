import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import RegisterPage from './RegisterPage';

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
      <RegisterPage />
    </MemoryRouter>
  );

const fillForm = (username: string, password: string, confirmPassword: string) => {
  const passwordInputs = screen.getAllByPlaceholderText('••••••••');
  fireEvent.change(screen.getByPlaceholderText('Ej: juan123'), {
    target: { value: username },
  });
  fireEvent.change(passwordInputs[0], { target: { value: password } });
  fireEvent.change(passwordInputs[1], { target: { value: confirmPassword } });
};

describe('RegisterPage - validación de formulario', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the register form', () => {
    renderPage();
    expect(screen.getByRole('heading', { name: 'Crear cuenta' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ej: juan123')).toBeInTheDocument();
  });

  it('shows error when username is empty', async () => {
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: /crear cuenta/i }));
    expect(await screen.findByText('El usuario es obligatorio.')).toBeInTheDocument();
  });

  it('shows error when password is empty', async () => {
    renderPage();
    fillForm('juan', '', '');
    fireEvent.click(screen.getByRole('button', { name: /crear cuenta/i }));
    expect(await screen.findByText('La contraseña es obligatoria.')).toBeInTheDocument();
  });

  it('shows error when confirm password is empty', async () => {
    renderPage();
    fillForm('juan', 'password123', '');
    fireEvent.click(screen.getByRole('button', { name: /crear cuenta/i }));
    expect(await screen.findByText('Debes confirmar la contraseña.')).toBeInTheDocument();
  });

  it('shows error when username is shorter than 3 characters', async () => {
    renderPage();
    fillForm('ab', 'password123', 'password123');
    fireEvent.click(screen.getByRole('button', { name: /crear cuenta/i }));
    expect(await screen.findByText(/entre 3 y 20 caracteres/i)).toBeInTheDocument();
  });

  it('shows error when username has invalid characters', async () => {
    renderPage();
    fillForm('juan**', 'password123', 'password123');
    fireEvent.click(screen.getByRole('button', { name: /crear cuenta/i }));
    expect(await screen.findByText(/solo puede contener letras/i)).toBeInTheDocument();
  });

  it('shows error when password is shorter than 6 characters', async () => {
    renderPage();
    fillForm('juan', '123', '123');
    fireEvent.click(screen.getByRole('button', { name: /crear cuenta/i }));
    expect(await screen.findByText(/al menos 6 caracteres/i)).toBeInTheDocument();
  });

  it('shows error when passwords do not match', async () => {
    renderPage();
    fillForm('juan', 'password123', 'different456');
    fireEvent.click(screen.getByRole('button', { name: /crear cuenta/i }));
    expect(await screen.findByText(/no coinciden/i)).toBeInTheDocument();
  });
});
