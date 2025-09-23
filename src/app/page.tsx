import { Chatbot } from '@/components/chatbot/chatbot';
import { SidebarNav } from '@/components/sidebar-nav';
import { Sidebar, SidebarInset } from '@/components/ui/sidebar';

export default function Home() {
  return (
    <>
      <Sidebar collapsible="icon">
        <SidebarNav />
      </Sidebar>
      <SidebarInset>
        <main className="flex items-center justify-center min-h-screen p-2 md:p-4">
          <Chatbot />
        </main>
      </SidebarInset>
    </>
  );
}
