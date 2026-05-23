import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Package, User, MapPin, Settings, LogOut, Menu, Heart, TicketPercent } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

interface UserDashboardLayoutProps {
  children: React.ReactNode;
}

const menuItems = [
  {
    title: 'Meus Pedidos',
    href: '/meus-pedidos',
    icon: Package,
  },
  {
    title: 'Meu Perfil',
    href: '/perfil',
    icon: User,
  },
  {
    title: 'Meus Favoritos',
    href: '/favoritos',
    icon: Heart,
  },
  {
    title: 'Meus Cupons',
    href: '/meus-cupons',
    icon: TicketPercent,
  },
  {
    title: 'Endereços',
    href: '/enderecos',
    icon: MapPin,
  },
  {
    title: 'Configurações',
    href: '/configuracoes',
    icon: Settings,
  },
];

function SidebarContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, profile } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="flex flex-col h-full">
      {/* User Info */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-base truncate">
              {profile?.full_name || profile?.username || 'Usuário'}
            </p>
            <p className="text-sm text-muted-foreground truncate">
              Minha Conta
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;

          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                'hover:bg-accent hover:text-accent-foreground',
                isActive && 'bg-primary text-primary-foreground hover:bg-primary/90'
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span className="font-medium">{item.title}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={handleSignOut}
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium">Sair</span>
        </Button>
      </div>
    </div>
  );
}

export default function UserDashboardLayout({ children }: UserDashboardLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 border-r border-border bg-card shrink-0">
          <SidebarContent />
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          {/* Mobile Header */}
          <div className="lg:hidden sticky top-0 z-10 bg-card border-b border-border p-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold">Minha Conta</h1>
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-64">
                  <SheetTitle className="sr-only">Menu da conta</SheetTitle>
                  <SheetDescription className="sr-only">Acesse pedidos, perfil, favoritos, cupons, endereços e configurações da sua conta.</SheetDescription>
                  <SidebarContent />
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Page Content */}
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
