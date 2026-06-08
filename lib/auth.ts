import { MongoClient } from 'mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/nextauth';
import getClient from './mongodb';

export async function getSession() {
  return getServerSession(authOptions);
}

export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user?.role !== 'admin' && session.user?.role !== 'manager')) {
    return null;
  }
  return session;
}

export async function fetchDb() {
  const client = await getClient();
  return client.db();
}
