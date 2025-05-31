import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardNavbar, DashboardSidebar } from '@/modules/dashboard/ui/components';

type Props = {
  children: React.ReactNode;
};

function Layout({ children }: Props) {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <main className="bg-muted flex h-screen w-screen flex-col">
        <DashboardNavbar />
        {children}
      </main>
    </SidebarProvider>
  );
}

export default Layout;
