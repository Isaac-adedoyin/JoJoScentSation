import { requireAdmin } from '@/lib/auth';
import { redirect } from 'next/navigation';
import EditProductClient from './EditProductClient';

export default async function Page(props: any) {
  const session = await requireAdmin();
  const id = props?.params?.id;

  if (!session) {
    redirect('/products');
  }

  return <EditProductClient id={id} />;
}
