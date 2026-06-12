'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ToastContext';
import { Search, Filter, Shield, User as UserIcon } from 'lucide-react';

type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
};

export default function UserManagementClient({ initialUsers, currentUserEmail }: { initialUsers: User[], currentUserEmail: string }) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  
  const router = useRouter();
  const { notify } = useToast();

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch = 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      
      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, roleFilter]);

  async function handleRoleChange(userId: string, newRole: string) {
    // Optimistic Update
    setUsers(prev => prev.map(u => u._id === userId ? { ...u, role: newRole } : u));
    setUpdatingId(userId);

    try {
      const res = await fetch('/api/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: newRole })
      });

      if (!res.ok) {
        const error = await res.json();
        setUsers(initialUsers); // revert
        notify({ message: error.error || 'Failed to update role', variant: 'error' });
        return;
      }

      notify({ message: 'User role updated', variant: 'success' });
      router.refresh();
    } catch (err) {
      setUsers(initialUsers); // revert
      notify({ message: 'An error occurred while updating the role.', variant: 'error' });
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full border border-border bg-surface py-3 pl-11 pr-5 text-sm text-text-primary outline-none transition-colors focus:border-gold/50 focus:ring-1 focus:ring-gold/50 placeholder:text-text-muted"
          />
        </div>
        
        <div className="flex items-center gap-3">
          <Filter className="text-text-muted w-4 h-4" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="rounded-full border border-border bg-background px-4 py-2.5 text-sm text-text-primary outline-none transition-colors focus:border-gold/50"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admins</option>
            <option value="customer">Customers</option>
          </select>
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="rounded-[1.75rem] border border-dashed border-border bg-surface py-16 text-center">
          <p className="font-serif text-xl text-text-primary">No users found</p>
          <p className="mt-2 text-sm text-text-muted">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="rounded-[1.75rem] border border-border-subtle bg-surface shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-text-muted">
              <thead className="border-b border-border bg-surface text-[10px] uppercase tracking-[0.2em] text-text-muted">
                <tr>
                  <th className="px-6 py-4 font-semibold">User</th>
                  <th className="px-6 py-4 font-semibold">Email</th>
                  <th className="px-6 py-4 font-semibold">Registered</th>
                  <th className="px-6 py-4 font-semibold">Role Access</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A1A1A]">
                {filteredUsers.map((user) => {
                  const isCurrentUser = user.email === currentUserEmail;
                  
                  return (
                    <tr key={user._id} className="transition-colors hover:bg-[#1A1A1A]/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1A1A1A] border border-border">
                            {user.role === 'admin' ? (
                              <Shield className="h-4 w-4 text-gold" />
                            ) : (
                              <UserIcon className="h-4 w-4 text-text-muted" />
                            )}
                          </div>
                          <span className="font-medium text-text-primary">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">{user.email}</td>
                      <td className="px-6 py-4 text-xs">{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <select
                            value={user.role}
                            disabled={isCurrentUser || updatingId === user._id}
                            onChange={(e) => handleRoleChange(user._id, e.target.value)}
                            className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em] outline-none transition-colors ${
                              user.role === 'admin' 
                                ? 'bg-gold/10 border-gold/30 text-gold focus:border-gold' 
                                : 'bg-surface border-border text-text-primary focus:border-[#7A7060]'
                            } disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer`}
                          >
                            <option value="customer">Customer</option>
                            <option value="admin">Admin</option>
                          </select>
                          {isCurrentUser && (
                            <span className="rounded-full bg-[#2A2A2A] px-2.5 py-1 text-[9px] uppercase tracking-widest text-text-muted">You</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
