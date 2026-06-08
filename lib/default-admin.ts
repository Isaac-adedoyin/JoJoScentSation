import { hash } from 'bcryptjs';
import getClient from '@/lib/mongodb';

const DEFAULT_ADMIN_EMAIL = 'admin@jojoscentsation.com';
const DEFAULT_ADMIN_PASSWORD = 'ChangeMe123!';

export async function ensureDefaultAdminAccount() {
  const client = await getClient();
  const db = client.db();
  const email = DEFAULT_ADMIN_EMAIL.toLowerCase();

  const existingAdmin = await db.collection('users').findOne({ email });
  if (existingAdmin) {
    return existingAdmin;
  }

  // Change default admin password before production launch.
  const passwordHash = await hash(DEFAULT_ADMIN_PASSWORD, 10);

  await db.collection('users').insertOne({
    name: 'Store Owner',
    email,
    passwordHash,
    role: 'admin',
    createdAt: new Date()
  });

  return db.collection('users').findOne({ email });
}

export function isDefaultAdminEmail(email?: string | null) {
  return email?.toLowerCase() === DEFAULT_ADMIN_EMAIL;
}
