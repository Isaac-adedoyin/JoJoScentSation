'use client';

import type { FormEvent } from 'react';
import { useState } from 'react';
import { getSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    const res = await signIn('credentials', {
      redirect: false,
      email,
      password
    });

    if (res?.error) {
      setError('Invalid login credentials.');
      return;
    }

    const session = await getSession();
    router.push(session?.user?.role === 'admin' ? '/dashboard' : '/products');
    router.refresh();
  };

  return (
    <div className="mx-auto max-w-lg px-6 py-16">
      <div className="rounded-[2rem] border border-[#E8DDCB] bg-white p-10 shadow-[0_18px_45px_rgba(76,60,38,0.08)]">
        <h1 className="text-3xl font-semibold text-[#2D2D2D]">Log in to JoJoScentSation</h1>
        <p className="mt-3 text-[#61584D]">Manage orders, inventory, or continue shopping with a customer account.</p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
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
          {error && <p className="text-sm text-[#8D544A]">{error}</p>}
          <button type="submit" className="w-full rounded-full bg-[#D6B98C] px-6 py-3 text-sm font-semibold text-[#2D2D2D] transition hover:bg-[#CDAE80]">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
