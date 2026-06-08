import { requireAdmin } from '@/lib/auth';
import EditProductClient from './EditProductClient';

export default async function Page(props: any) {
  const session = await requireAdmin();
  const id = props?.params?.id;

  if (!session) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-20 text-center text-slate-700">
        <h1 className="text-3xl font-semibold">Access denied</h1>
        <p className="mt-4">Only admin accounts can edit products.</p>
      </div>
    );
  }

  return <EditProductClient id={id} />;
}
