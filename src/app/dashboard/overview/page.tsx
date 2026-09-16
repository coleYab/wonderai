import PageContainer from '@/components/layout/page-container';
import { redirect } from 'next/navigation';

export default function OverviewPage() {
  // return <PageContainer pageTitle='Overview'>{null}</PageContainer>;

  return redirect('/dashboard/trips');
}
