import { requireAdmin } from '@/lib/auth';
import { redirect } from 'next/navigation';
import NewProductClient from './NewProductClient';

export default async function NewProductPage() {
  const session = await requireAdmin();

  if (!session) {
    redirect('/products');
  }

  return (
    <div className="space-y-6">
      <NewProductClient />
    </div>
  );
}
