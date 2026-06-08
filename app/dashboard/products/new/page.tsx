import { requireAdmin } from '@/lib/auth';
import NewProductClient from './NewProductClient';

export default async function NewProductPage() {
  const session = await requireAdmin();

  if (!session) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-20 text-center text-slate-700">
        <h1 className="text-3xl font-semibold">Access denied</h1>
        <p className="mt-4">Only admin accounts can create products.</p>
      </div>
    );
  }

  return <NewProductClient />;
}
