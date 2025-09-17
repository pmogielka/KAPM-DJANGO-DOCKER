import InfinoAuthLayout from '@/components/infino/InfinoAuthLayout';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <InfinoAuthLayout>{children}</InfinoAuthLayout>;
}