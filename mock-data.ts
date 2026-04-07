import { Dashboard } from '@/components/dashboard';
import { getDashboardData } from '@/lib/google-sheets';

export default async function DashboardPage() {
  const data = await getDashboardData();
  return <Dashboard data={data} />;
}
