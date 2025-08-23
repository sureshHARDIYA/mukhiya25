"use client";

import { usePathname, useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { logout } from "@/app/auth/logout/actions";

interface AdminLayoutClientProps {
  children: React.ReactNode;
  user: User;
}

export function AdminLayoutClient({ children, user }: AdminLayoutClientProps) {
  const pathname = usePathname();
  const router = useRouter();
  
  // Extract the active tab from the pathname
  const getActiveTab = () => {
    if (!pathname) return 'dashboard';
    const path = pathname.split('/admin/')[1];
    return path || 'dashboard';
  };

  const handleTabChange = (tab: string) => {
    // Navigate to the new route
    const newPath = tab === 'dashboard' ? '/admin' : `/admin/${tab}`;
    router.push(newPath);
  };

  const handleSignOut = async () => {
    await logout();
  };

  return (
    <AdminLayout
      activeTab={getActiveTab()}
      onTabChange={handleTabChange}
      onSignOut={handleSignOut}
      user={user}
    >
      {children}
    </AdminLayout>
  );
}

export default AdminLayoutClient;
