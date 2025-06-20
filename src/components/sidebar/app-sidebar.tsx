import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Users, 
  FileText, 
  Settings, 
  LogOut, 
  Home,
  Shield,
  ChevronRight,
  Blocks
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Fragment } from 'react/jsx-runtime';

// Breadcrumb component
const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const breadcrumbMap: { [key: string]: string } = {
    admin: 'Admin Panel',
    subjects: 'Fanlar',
    tests: 'Testlar',
    blocks: 'Bloklar',
    users: 'Foydalanuvchilar',
    settings: 'Sozlamalar',
  };

  return (
    <nav className="flex items-center space-x-1 text-sm text-gray-500 mb-6">
      <Link to="/admin" className="hover:text-gray-700 transition-colors">
        Admin Panel
      </Link>
      {pathnames.slice(1).map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 2).join('/')}`;
        const isLast = index === pathnames.length - 2;
        
        return (
          <Fragment key={name}>
            <ChevronRight className="h-4 w-4" />
            {isLast ? (
              <span className="text-gray-900 font-medium">
                {breadcrumbMap[name] || name}
              </span>
            ) : (
              <Link to={routeTo} className="hover:text-gray-700 transition-colors">
                {breadcrumbMap[name] || name}
              </Link>
            )}
          </Fragment>
        );
      })}
    </nav>
  );
};

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: Home },
  { name: 'Fanlar', href: '/admin/subjects', icon: BookOpen },
  { name: 'Testlar', href: '/admin/tests', icon: FileText },
  { name: 'Bloklar', href: '/admin/blocks', icon: Blocks },
  { name: 'Foydalanuvchilar', href: '/admin/users', icon: Users },
  { name: 'Sozlamalar', href: '/admin/settings', icon: Settings },
];

export const AppSidebar = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    // TODO: Implement logout logic
    navigate('/auth/login');
  };

  const isActive = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center space-x-3 px-4">
            <div className="bg-blue-600 p-2 rounded-lg shadow-sm">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
              <p className="text-sm text-gray-500">TestBlok.uz</p>
            </div>
          </div>
        </SidebarHeader>
        
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Boshqaruv</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <SidebarMenuItem key={item.name}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive(item.href)}
                        tooltip={item.name}
                      >
                        <Link to={item.href}>
                          <Icon className="h-4 w-4" />
                          <span>{item.name}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <div className="p-4">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5 mr-3 flex-shrink-0" />
              Chiqish
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-4 py-4 lg:px-6">
            <div className="flex items-center">
              <SidebarTrigger className="lg:hidden mr-3" />

              <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600">
                <span className="font-medium">Admin</span>
                <span>•</span>
                <span>TestBlok.uz</span>
              </div>
            </div>
            
            {/* User menu */}
            <div className="flex items-center space-x-3">
              <div className="hidden sm:block text-right">
                <div className="text-sm font-medium text-gray-900">Admin User</div>
                <div className="text-xs text-gray-500">admin@testblok.uz</div>
              </div>
              <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center shadow-sm">
                <span className="text-sm font-medium text-white">A</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">
            <Breadcrumb />
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {children}
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}; 