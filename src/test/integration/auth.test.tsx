import { describe, it, expect, vi, Mock } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';
import Page from '@/app/page';
import Messages from '@/app/messages/page'
import { AuthProvider } from '@/context/AuthContext';
import { MemoryRouterProvider } from "next-router-mock/MemoryRouterProvider";

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

describe('Authentication and Messages Flow', () => {
  it('should login and display messages', async () => {
    const mockRouter = {
      pathname: "/",
      push: vi.fn(),

    };
    (useRouter as Mock).mockReturnValue(mockRouter);

    render(
      <AuthProvider>
        <Page />
      </AuthProvider>, { wrapper: MemoryRouterProvider }
    );

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole('button', { name: /sign in/i });

    await userEvent.type(emailInput, 'test@email.com');
    await userEvent.type(passwordInput, 'not_test');
    await userEvent.click(loginButton);

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/messages');
    },{timeout:5000});
    mockRouter.pathname = "/messages";
    render(
        <AuthProvider>
          < Messages/>
        </AuthProvider>, { wrapper: MemoryRouterProvider }
    );

    await waitFor(() => {
      const messages = screen.getAllByText("user2@email.com");
      expect(messages).toHaveLength(2);
    },{timeout:5000});

    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByText('World')).toBeInTheDocument();
  }, {timeout:15000});
}); 