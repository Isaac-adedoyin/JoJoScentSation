import EditProductClient from './EditProductClient';

export default function Page(props: any) {
  const id = props?.params?.id;
  return <EditProductClient id={id} />;
}
