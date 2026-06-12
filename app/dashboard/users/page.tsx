import { requireAdmin } from '@/lib/auth';
import { redirect } from 'next/navigation';
import getClient from '@/lib/mongodb';
import UserManagementClient from './UserManagementClient';

export const dynamic = 'force-dynamic';

export default async function UsersPage() {
  const session = await requireAdmin();

  if (!session) {
    redirect('/products');
  }

  const client = await getClient();
  const db = client.db();
  
  const usersRaw = await db.collection('users').find({}, { projection: { passwordHash: 0 } }).sort({ createdAt: -1 }).toArray();
  
  // Serialize for client component
  const users = usersRaw.map(user => ({
    _id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt.toISOString()
  }));

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-border-subtle bg-surface px-5 py-6 shadow-sm sm:px-8 sm:py-8">
        <div>
          <p className="text-[10px] uppercase tracking-[0.4em] text-gold">Dashboard</p>
          <h1 className="mt-3 font-serif text-3xl tracking-[-0.03em] text-text-primary sm:text-4xl">User Management</h1>
          <p className="mt-3 text-sm leading-7 text-text-muted">
            View all registered customers, grant management access, and secure your operations.
          </p>
        </div>
      </div>

      <div className="mt-6">
        <UserManagementClient initialUsers={users} currentUserEmail={session.user?.email || ''} />
      </div>
    </div>
  );
}
