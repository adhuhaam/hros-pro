import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/react.svg'; // Use your logo here

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      localStorage.setItem('token', data.token);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-base-200/80 to-base-100/80">
      <form className="card w-full max-w-md bg-base-100 shadow-2xl p-10 border border-base-300 rounded-2xl flex flex-col gap-6" onSubmit={handleSubmit}>
        <div className="flex flex-col items-center mb-2">
          <img src={logo} alt="Logo" className="w-16 h-16 mb-2" />
          <h2 className="text-3xl font-extrabold mb-1 text-primary">HRMS Login</h2>
          <p className="text-base-content/70 text-sm">Sign in to your account</p>
        </div>
        {error && <div className="alert alert-error mb-2 text-sm">{error}</div>}
        <div className="form-control">
          <label className="label">
            <span className="label-text text-base font-medium">Email</span>
          </label>
          <input
            type="email"
            className="input input-bordered input-lg"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoFocus
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text text-base font-medium">Password</span>
          </label>
          <input
            type="password"
            className="input input-bordered input-lg"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <button className="btn btn-neutral btn-lg w-full mt-2" type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
} 