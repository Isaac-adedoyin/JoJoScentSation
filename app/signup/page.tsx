'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });

    const data = await response.json();
    if (data.success) {
      setMessage('Account created. You can now log in.');
      setName('');
      setEmail('');
      setPassword('');
      router.push('/login');
    } else {
      setMessage(data.error || 'Unable to create account.');
    }
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-12 sm:px-6 sm:py-16">
      <div className="rounded-[2rem] border border-[#E8DDCB] bg-white p-6 shadow-[0_18px_45px_rgba(76,60,38,0.08)] sm:p-10">
        <h1 className="text-2xl font-semibold text-[#2D2D2D] sm:text-3xl">Create a customer account</h1>
        <p className="mt-3 text-[#61584D]">Register to save orders and access the shop dashboard.</p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-[#2D2D2D]">Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 w-full rounded-3xl border border-[#E3D3BA] bg-[#FFFCF8] px-4 py-3 outline-none focus:border-[#D6B98C]"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#2D2D2D]">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-3xl border border-[#E3D3BA] bg-[#FFFCF8] px-4 py-3 outline-none focus:border-[#D6B98C]"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#2D2D2D]">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-3xl border border-[#E3D3BA] bg-[#FFFCF8] px-4 py-3 outline-none focus:border-[#D6B98C]"
            />
          </div>
          {message && <p className="text-sm text-[#61584D]">{message}</p>}
          <button type="submit" className="w-full rounded-full bg-[#D6B98C] px-6 py-3 text-sm font-semibold text-[#2D2D2D] transition hover:bg-[#CDAE80]">
            Sign up
          </button>
        </form>
      </div>
    </div>
  );
}
