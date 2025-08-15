import { Dashboard } from '@/components/dashboard-v2/dashboard';

export default function Home() {
  return (
    <main className="p-4 overflow-y-auto">
      <div className="w-full space-y-8 max-w-full mx-auto">
        <Dashboard />
      </div>
    </main>
  );
}
