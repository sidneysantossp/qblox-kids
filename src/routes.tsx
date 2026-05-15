import HomePage from './pages/HomePage';
import BrickStoreHomePage from './pages/BrickStoreHomePage';
import NotFoundPage from './pages/NotFoundPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CategoryPage from './pages/CategoryPage';
import ShopPage from './pages/ShopPage';
import AboutUsPage from './pages/AboutUsPage';
import AuthorQbloxEditorialPage from './pages/AuthorQbloxEditorialPage';
import BuildingFiguresPillarPage from './pages/BuildingFiguresPillarPage';
import SuperHeroesPillarPage from './pages/SuperHeroesPillarPage';
import RobloxPillarPage from './pages/RobloxPillarPage';
import TvSeriesPillarPage from './pages/TvSeriesPillarPage';
import GuideByAgePage from './pages/GuideByAgePage';
import GiftGuidePage from './pages/GiftGuidePage';
import BeginnersGuidePage from './pages/BeginnersGuidePage';
import MostWantedSuperHeroesGuidePage from './pages/MostWantedSuperHeroesGuidePage';
import RobloxCollectionGuidePage from './pages/RobloxCollectionGuidePage';
import GiftByPriceGuidePage from './pages/GiftByPriceGuidePage';
import LaunchesGuidePage from './pages/LaunchesGuidePage';
import ThemesComparisonGuidePage from './pages/ThemesComparisonGuidePage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import SpecialOffersPage from './pages/SpecialOffersPage';
import CustomBuilderPage from './pages/CustomBuilderPage';
import BuildCollectionPage from './pages/BuildCollectionPage';
import SearchPage from './pages/SearchPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import AsaasCheckoutPage from './pages/AsaasCheckoutPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import AsaasPaymentPage from './pages/AsaasPaymentPage';
import UserOrdersPage from './pages/UserOrdersPage';
import UserProfilePage from './pages/UserProfilePage';
import UserAddressesPage from './pages/UserAddressesPage';
import UserSettingsPage from './pages/UserSettingsPage';
import FavoritesPage from './pages/FavoritesPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import OrderDetailsPage from './pages/OrderDetailsPage';
import HelpCenterPage from './pages/HelpCenterPage';
import ReturnPolicyPage from './pages/ReturnPolicyPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfUsePage from './pages/TermsOfUsePage';
import AdminAccessDebugPage from './pages/AdminAccessDebugPage';
import TestPaymentMethods from './pages/TestPaymentMethods';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminUsers from './pages/admin/AdminUsers';
import AdminCategories from './pages/admin/AdminCategories';
import AdminCoupons from './pages/admin/AdminCoupons';
import AdminBanners from './pages/admin/AdminBanners';
import AdminBannersPage from './pages/admin/AdminBannersPage';
import BannerFormPage from './pages/admin/BannerFormPage';
import AdminSections from './pages/admin/AdminSections';
import AdminThematicCollections from './pages/admin/AdminThematicCollections';
import AdminSpecialHighlight from './pages/admin/AdminSpecialHighlight';
import AdminBlog from './pages/admin/AdminBlog';
import AdminPayments from './pages/admin/AdminPayments';
import AdminReports from './pages/admin/AdminReports';
import AdminSettings from './pages/admin/AdminSettings';
import AdminWhatsAppSettings from './pages/admin/AdminWhatsAppSettings';
import ProductFormPage from './pages/admin/ProductFormPage';
import CategoryFormPage from './pages/admin/CategoryFormPage';
import AdminOrderDetailPage from './pages/admin/AdminOrderDetailPage';
import AdminUserDetailPage from './pages/admin/AdminUserDetailPage';
import AdminDebugPage from './pages/admin/AdminDebugPage';
import { AdminLayout } from './components/layouts/AdminLayout';
import { ProtectedAdminRoute } from './components/admin/ProtectedAdminRoute';
import type { ReactNode } from 'react';

interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
  children?: RouteConfig[];
}

const routes: RouteConfig[] = [
  {
    name: 'Home',
    path: '/',
    element: <BrickStoreHomePage />
  },
  {
    name: 'Home Old',
    path: '/old',
    element: <HomePage />,
    visible: false
  },
  {
    name: 'Product Detail',
    path: '/produto/:id',
    element: <ProductDetailPage />,
    visible: false
  },
  {
    name: 'Shop',
    path: '/loja',
    element: <ShopPage />,
    visible: true
  },
  {
    name: 'About Us',
    path: '/quem-somos',
    element: <AboutUsPage />,
    visible: true
  },
  {
    name: 'Author QBLOX Editorial',
    path: '/autor/qblox-editorial',
    element: <AuthorQbloxEditorialPage />,
    visible: false
  },
  {
    name: 'Building Figures Pillar',
    path: '/bonecos-de-montar',
    element: <BuildingFiguresPillarPage />,
    visible: true
  },
  {
    name: 'Super Heroes Pillar',
    path: '/bonecos-de-super-herois',
    element: <SuperHeroesPillarPage />,
    visible: true
  },
  {
    name: 'Roblox Pillar',
    path: '/bonecos-de-roblox',
    element: <RobloxPillarPage />,
    visible: true
  },
  {
    name: 'TV Series Pillar',
    path: '/bonecos-de-series-da-tv',
    element: <TvSeriesPillarPage />,
    visible: true
  },
  {
    name: 'Guide By Age',
    path: '/guia/como-escolher-bonecos-de-montar-por-idade',
    element: <GuideByAgePage />,
    visible: true
  },
  {
    name: 'Gift Guide',
    path: '/guia/bonecos-de-montar-para-presentear',
    element: <GiftGuidePage />,
    visible: true
  },
  {
    name: 'Beginners Guide',
    path: '/guia/melhores-bonecos-de-montar-para-iniciantes',
    element: <BeginnersGuidePage />,
    visible: true
  },
  {
    name: 'Most Wanted Super Heroes Guide',
    path: '/guia/bonecos-de-super-herois-mais-procurados',
    element: <MostWantedSuperHeroesGuidePage />,
    visible: true
  },
  {
    name: 'Roblox Collection Guide',
    path: '/guia/como-comecar-uma-colecao-de-roblox',
    element: <RobloxCollectionGuidePage />,
    visible: true
  },
  {
    name: 'Gift By Price Guide',
    path: '/guia/bonecos-de-montar-por-faixa-de-preco',
    element: <GiftByPriceGuidePage />,
    visible: true
  },
  {
    name: 'Launches Guide',
    path: '/guia/melhores-lancamentos-de-bonecos-de-montar',
    element: <LaunchesGuidePage />,
    visible: true
  },
  {
    name: 'Themes Comparison Guide',
    path: '/guia/comparativo-super-herois-roblox-series-tv',
    element: <ThemesComparisonGuidePage />,
    visible: true
  },
  {
    name: 'Custom Builder',
    path: '/categoria/acessorios',
    element: <CustomBuilderPage />,
    visible: false
  },
  {
    name: 'Build Collection',
    path: '/categoria/monte-sua-colecao',
    element: <BuildCollectionPage />,
    visible: false
  },
  {
    name: 'Blog',
    path: '/blog',
    element: <BlogPage />,
    visible: true
  },
  {
    name: 'Blog Post',
    path: '/blog/:slug',
    element: <BlogPostPage />,
    visible: false
  },
  {
    name: 'Category',
    path: '/categoria/:category',
    element: <CategoryPage />,
    visible: false
  },
  {
    name: 'Special Offers',
    path: '/ofertas-especiais',
    element: <SpecialOffersPage />,
    visible: false
  },
  {
    name: 'Search',
    path: '/busca',
    element: <SearchPage />,
    visible: false
  },
  {
    name: 'Cart',
    path: '/carrinho',
    element: <CartPage />,
    visible: false
  },
  {
    name: 'Checkout',
    path: '/checkout',
    element: <CheckoutPage />,
    visible: false
  },
  {
    name: 'Test Payment Methods',
    path: '/test-payment-methods',
    element: <TestPaymentMethods />,
    visible: false
  },
  {
    name: 'Asaas Checkout',
    path: '/checkout-asaas',
    element: <AsaasCheckoutPage />,
    visible: false
  },
  {
    name: 'Payment Success',
    path: '/pagamento-sucesso',
    element: <PaymentSuccessPage />,
    visible: false
  },
  {
    name: 'Asaas Payment',
    path: '/pagamento-asaas',
    element: <AsaasPaymentPage />,
    visible: false
  },
  {
    name: 'My Orders',
    path: '/meus-pedidos',
    element: <UserOrdersPage />,
    visible: false
  },
  {
    name: 'My Profile',
    path: '/perfil',
    element: <UserProfilePage />,
    visible: false
  },
  {
    name: 'My Addresses',
    path: '/enderecos',
    element: <UserAddressesPage />,
    visible: false
  },
  {
    name: 'Settings',
    path: '/configuracoes',
    element: <UserSettingsPage />,
    visible: false
  },
  {
    name: 'Favorites',
    path: '/favoritos',
    element: <FavoritesPage />,
    visible: false
  },
  {
    name: 'Login',
    path: '/login',
    element: <LoginPage />,
    visible: false
  },
  {
    name: 'Register',
    path: '/registro',
    element: <RegisterPage />,
    visible: false
  },
  {
    name: 'Dashboard',
    path: '/minha-conta',
    element: <DashboardPage />,
    visible: false
  },
  {
    name: 'Admin Access Debug',
    path: '/admin-debug',
    element: <AdminAccessDebugPage />,
    visible: false
  },
  {
    name: 'Order Details',
    path: '/minha-conta/pedido/:orderId',
    element: <OrderDetailsPage />,
    visible: false
  },
  {
    name: 'Help Center',
    path: '/central-de-ajuda',
    element: <HelpCenterPage />,
    visible: false
  },
  {
    name: 'Return Policy',
    path: '/politica-de-troca',
    element: <ReturnPolicyPage />,
    visible: false
  },
  {
    name: 'Privacy Policy',
    path: '/politica-de-privacidade',
    element: <PrivacyPolicyPage />,
    visible: false
  },
  {
    name: 'Terms of Use',
    path: '/termos-de-uso',
    element: <TermsOfUsePage />,
    visible: false
  },
  {
    name: 'Admin',
    path: '/admin',
    element: (
      <ProtectedAdminRoute>
        <AdminLayout />
      </ProtectedAdminRoute>
    ),
    visible: false,
    children: [
      {
        name: 'Admin Dashboard',
        path: '',
        element: <AdminDashboard />,
        visible: false
      },
      {
        name: 'Admin Debug',
        path: 'debug',
        element: <AdminDebugPage />,
        visible: false
      },
      {
        name: 'Admin Products',
        path: 'produtos',
        element: <AdminProducts />,
        visible: false
      },
      {
        name: 'New Product',
        path: 'produtos/novo',
        element: <ProductFormPage />,
        visible: false
      },
      {
        name: 'Edit Product',
        path: 'produtos/:id',
        element: <ProductFormPage />,
        visible: false
      },
      {
        name: 'Admin Orders',
        path: 'pedidos',
        element: <AdminOrders />,
        visible: false
      },
      {
        name: 'Order Detail',
        path: 'pedidos/:id',
        element: <AdminOrderDetailPage />,
        visible: false
      },
      {
        name: 'Admin Users',
        path: 'usuarios',
        element: <AdminUsers />,
        visible: false
      },
      {
        name: 'User Detail',
        path: 'usuarios/:id',
        element: <AdminUserDetailPage />,
        visible: false
      },
      {
        name: 'Admin Categories',
        path: 'categorias',
        element: <AdminCategories />,
        visible: false
      },
      {
        name: 'New Category',
        path: 'categorias/nova',
        element: <CategoryFormPage />,
        visible: false
      },
      {
        name: 'Edit Category',
        path: 'categorias/:id',
        element: <CategoryFormPage />,
        visible: false
      },
      {
        name: 'Admin Coupons',
        path: 'cupons',
        element: <AdminCoupons />,
        visible: false
      },
      {
        name: 'Admin Banners',
        path: 'banners',
        element: <AdminBannersPage />,
        visible: false
      },
      {
        name: 'Admin Banner Form',
        path: 'banners/:id',
        element: <BannerFormPage />,
        visible: false
      },
      {
        name: 'Admin Sections',
        path: 'secoes',
        element: <AdminSections />,
        visible: false
      },
      {
        name: 'Admin Special Highlight',
        path: 'destaque-especial',
        element: <AdminSpecialHighlight />,
        visible: false
      },
      {
        name: 'Admin Thematic Collections',
        path: 'colecoes-tematicas',
        element: <AdminThematicCollections />,
        visible: false
      },
      {
        name: 'Admin Blog',
        path: 'blog',
        element: <AdminBlog />,
        visible: false
      },
      {
        name: 'Admin Payments',
        path: 'pagamentos',
        element: <AdminPayments />,
        visible: false
      },
      {
        name: 'Admin Reports',
        path: 'relatorios',
        element: <AdminReports />,
        visible: false
      },
      {
        name: 'Admin Settings',
        path: 'configuracoes',
        element: <AdminSettings />,
        visible: false
      },
      {
        name: 'Admin WhatsApp Settings',
        path: 'whatsapp',
        element: <AdminWhatsAppSettings />,
        visible: false
      }
    ]
  },
  {
    name: '404 Not Found',
    path: '*',
    element: <NotFoundPage />,
    visible: false
  }
];

export default routes;
