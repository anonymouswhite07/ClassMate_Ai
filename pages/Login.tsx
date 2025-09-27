import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Dummy authentication for demo purposes
    if (email === 'user@example.com' && password === 'password') {
      localStorage.setItem('isAuthenticated', 'true');
      navigate('/');
    } else {
      setError('Invalid credentials. Hint: user@example.com / password');
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden">
        <main className="flex flex-1 items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 rounded-xl bg-[var(--background)]/80 p-10 backdrop-blur-sm border border-[var(--accent)] shadow-2xl shadow-[var(--accent)]/20">
                <div>
                    <h2 className="text-center text-3xl font-bold tracking-tight text-[var(--text-primary)]">
                        Welcome Back
                    </h2>
                    <p className="mt-2 text-center text-sm text-[var(--text-secondary)]">
                        Enter your credentials to access your account.
                    </p>
                </div>
                <form onSubmit={handleLogin} className="mt-8 space-y-6">
                    <div className="space-y-4 rounded-lg">
                        <div>
                            <label className="sr-only" htmlFor="email-address">Email address</label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="form-input"
                                placeholder="Email address (user@example.com)"
                            />
                        </div>
                        <div>
                            <label className="sr-only" htmlFor="password">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="form-input"
                                placeholder="Password (password)"
                            />
                        </div>
                    </div>
                    {error && <p className="text-sm text-red-500 text-center">{error}</p>}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 rounded border-[var(--accent)] bg-transparent text-[var(--accent)] focus:ring-[var(--accent)] focus:ring-offset-[var(--background)]"/>
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-[var(--text-secondary)]"> Remember me </label>
                        </div>
                        <div className="text-sm">
                            <a href="#" className="link"> Forgot your password? </a>
                        </div>
                    </div>
                    <div>
                        <button type="submit" className="group relative flex w-full justify-center btn-primary">
                            Log in
                        </button>
                    </div>
                </form>
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-[var(--accent)]"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="bg-[var(--background)] px-2 text-[var(--text-secondary)]">Or continue with</span>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <button className="btn-secondary">
                        Google
                    </button>
                    <button className="btn-secondary">
                        Apple
                    </button>
                </div>
                <p className="text-center text-sm text-[var(--text-secondary)]">
                    Don't have an account?
                    <a href="#" className="link"> Sign up</a>
                </p>
            </div>
        </main>
    </div>
  );
};

export default Login;
