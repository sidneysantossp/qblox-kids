import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  FolderTree,
  Image,
  LayoutGrid,
  FileText,
  CreditCard,
  BarChart3,
  Menu,
  LogOut,
  Home,
  Settings,
  Ticket,
  MessageCircle
} from 'lucide-react';
import { useState } from 'react';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Produtos', href: '/admin/produtos', icon: Package },
  { name: 'Pedidos', href: '/admin/pedidos', icon: ShoppingCart },
  { name: 'Usuários', href: '/admin/usuarios', icon: Users },
  { name: 'Categorias', href: '/admin/categorias', icon: FolderTree },
  { name: 'Cupons', href: '/admin/cupons', icon: Ticket },
  { name: 'Banners Hero', href: '/admin/banners', icon: Image },
  { name: 'Seções Home', href: '/admin/secoes', icon: LayoutGrid },
  { name: 'Blog', href: '/admin/blog', icon: FileText },
  { name: 'Pagamentos', href: '/admin/pagamentos', icon: CreditCard },
  { name: 'Relatórios', href: '/admin/relatorios', icon: BarChart3 },
  { name: 'Configurações', href: '/admin/configuracoes', icon: Settings },
  { name: 'WhatsApp', href: '/admin/whatsapp', icon: MessageCircle },
];

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="flex h-full flex-col bg-card border-r">
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-6">
        <Link to="/admin" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">Q</span>
          </div>
          <div>
            <h1 className="font-bold text-lg leading-none">QBlox Kids</h1>
            <p className="text-xs text-muted-foreground">Painel Admin</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href || 
              (item.href !== '/admin' && location.pathname.startsWith(item.href));
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Footer Actions */}
      <div className="border-t p-4 space-y-2">
        <Button
          variant="outline"
          className="w-full justify-start"
          asChild
        >
          <Link to="/">
            <Home className="h-4 w-4 mr-2" />
            Ver Site
          </Link>
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-destructive"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sair
        </Button>
      </div>
    </div>
  );
}

export function AdminLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden xl:block w-64 shrink-0">
        <Sidebar />
      </aside>

      {/* Mobile Menu */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetTrigger asChild className="xl:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="fixed top-4 left-4 z-40"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <Sidebar />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-6 xl:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
