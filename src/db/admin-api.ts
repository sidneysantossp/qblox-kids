import { supabase } from './supabase';
import type {
  Category,
  HeroBanner,
  MiniBanner,
  HomepageSection,
  BlogPost,
  PaymentMethod,
  Product,
  Order,
  UserProfile,
  ProductReview,
  Coupon,
  CouponUsage
} from '@/types';

// ==================== CATEGORIES ====================

export async function getAllCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

export async function getCategoryById(id: string) {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function createCategory(category: Omit<Category, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('categories')
    .insert(category)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateCategory(id: string, category: Partial<Category>) {
  const { data, error } = await supabase
    .from('categories')
    .update(category)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteCategory(id: string) {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// ==================== HERO BANNERS ====================

export async function getAllHeroBanners() {
  const { data, error } = await supabase
    .from('hero_banners')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

export async function getActiveHeroBanners() {
  const { data, error } = await supabase
    .from('hero_banners')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

export async function getHeroBannerById(id: string) {
  const { data, error } = await supabase
    .from('hero_banners')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function createHeroBanner(banner: Omit<HeroBanner, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('hero_banners')
    .insert(banner)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateHeroBanner(id: string, banner: Partial<HeroBanner>) {
  const { data, error } = await supabase
    .from('hero_banners')
    .update(banner)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteHeroBanner(id: string) {
  const { error } = await supabase
    .from('hero_banners')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// ==================== MINI BANNERS ====================

export async function getAllMiniBanners(placement?: string) {
  let query = supabase
    .from('mini_banners')
    .select('*')
    .order('display_order', { ascending: true });

  if (placement) {
    query = query.eq('placement', placement);
  }

  const { data, error } = await query;

  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

export async function getActiveMiniBanners() {
  const { data, error } = await supabase
    .from('mini_banners')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

export async function getMiniBannerById(id: string) {
  const { data, error } = await supabase
    .from('mini_banners')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function createMiniBanner(banner: Omit<MiniBanner, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('mini_banners')
    .insert(banner)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateMiniBanner(id: string, banner: Partial<MiniBanner>) {
  const { data, error } = await supabase
    .from('mini_banners')
    .update(banner)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteMiniBanner(id: string) {
  const { error } = await supabase
    .from('mini_banners')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// ==================== HOMEPAGE SECTIONS ====================

export async function getAllHomepageSections() {
  const { data, error } = await supabase
    .from('homepage_sections')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

export async function getActiveHomepageSections() {
  const { data, error } = await supabase
    .from('homepage_sections')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

export async function getHomepageSectionById(id: string) {
  const { data, error } = await supabase
    .from('homepage_sections')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function createHomepageSection(section: Omit<HomepageSection, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('homepage_sections')
    .insert(section)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateHomepageSection(id: string, section: Partial<HomepageSection>) {
  const { data, error } = await supabase
    .from('homepage_sections')
    .update(section)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteHomepageSection(id: string) {
  const { error } = await supabase
    .from('homepage_sections')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// ==================== BLOG POSTS ====================

export async function getAllBlogPosts() {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

export async function getPublishedBlogPosts(limit?: number) {
  let query = supabase
    .from('blog_posts')
    .select('*')
    .eq('is_published', true)
    .order('published_at', { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

export async function getBlogPostById(id: string) {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getBlogPostBySlug(slug: string) {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .maybeSingle();

  if (error) throw error;
  
  // Increment views
  if (data) {
    await supabase
      .from('blog_posts')
      .update({ views: (data.views || 0) + 1 })
      .eq('id', data.id);
  }
  
  return data;
}

export async function createBlogPost(post: Omit<BlogPost, 'id' | 'created_at' | 'updated_at' | 'views'>) {
  const { data, error } = await supabase
    .from('blog_posts')
    .insert(post)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateBlogPost(id: string, post: Partial<BlogPost>) {
  const { data, error } = await supabase
    .from('blog_posts')
    .update(post)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteBlogPost(id: string) {
  const { error } = await supabase
    .from('blog_posts')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// ==================== PAYMENT METHODS ====================

export async function getAllPaymentMethods() {
  const { data, error } = await supabase
    .from('payment_methods')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

export async function getActivePaymentMethods() {
  const { data, error } = await supabase
    .from('payment_methods')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

export async function getPaymentMethodById(id: string) {
  const { data, error } = await supabase
    .from('payment_methods')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function createPaymentMethod(method: Omit<PaymentMethod, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('payment_methods')
    .insert(method)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updatePaymentMethod(id: string, method: Partial<PaymentMethod>) {
  const { data, error } = await supabase
    .from('payment_methods')
    .update(method)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deletePaymentMethod(id: string) {
  const { error } = await supabase
    .from('payment_methods')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// ==================== PRODUCTS (Admin) ====================

export async function getAllProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

export async function createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('products')
    .insert(product)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateProduct(id: string, product: Partial<Product>) {
  const { data, error } = await supabase
    .from('products')
    .update(product)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function duplicateProduct(id: string) {
  // Get the original product
  const products = await getAllProducts();
  const originalProduct = products.find((p) => p.id === id);
  
  if (!originalProduct) {
    throw new Error('Produto não encontrado');
  }

  // Create a copy without id, created_at, updated_at, and sku (will be auto-generated)
  const { id: _, created_at, updated_at, sku, ...productData } = originalProduct;
  
  // Add "(Cópia)" to the name
  const duplicatedProduct = {
    ...productData,
    name: `${productData.name} (Cópia)`,
  };

  // Create the new product (SKU will be auto-generated by database trigger)
  return createProduct(duplicatedProduct);
}

export async function deleteProduct(id: string) {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function deleteProducts(ids: string[]) {
  if (ids.length === 0) return;

  const { error } = await supabase
    .from('products')
    .delete()
    .in('id', ids);

  if (error) throw error;
}

export async function bulkUpdateProducts(ids: string[], updates: Partial<Product>) {
  const products = await getAllProducts();
  const targetProducts = products.filter((product) => ids.includes(product.id));

  const results = await Promise.all(
    targetProducts.map((product) => {
      const merged = { ...product, ...updates };
      return updateProduct(product.id, merged);
    })
  );

  return results;
}

// ==================== ORDERS (Admin) ====================

export async function getAllOrders(status?: string) {
  console.log('[admin-api] getAllOrders: Iniciando busca de pedidos...', { status });
  
  let query = supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });
  
  // Apply status filter if provided
  if (status && status !== 'all') {
    query = query.eq('status', status);
  }

  const { data: orders, error } = await query;

  if (error) {
    console.error('[admin-api] getAllOrders: Erro ao buscar pedidos:', error);
    throw error;
  }
  
  if (!orders || orders.length === 0) {
    console.log('[admin-api] getAllOrders: Nenhum pedido encontrado');
    return [];
  }

  // Fetch user profiles separately to avoid JOIN issues with null user_ids
  const userIds = orders
    .map(order => order.user_id)
    .filter((id): id is string => id !== null);

  let profiles: any[] = [];
  if (userIds.length > 0) {
    const { data: profilesData } = await supabase
      .from('profiles')
      .select('id, full_name, username')
      .in('id', userIds);
    
    profiles = profilesData || [];
  }

  // Merge profiles with orders
  const ordersWithProfiles = orders.map(order => ({
    ...order,
    profiles: order.user_id 
      ? profiles.find(p => p.id === order.user_id) || null
      : null
  }));
  
  console.log('[admin-api] getAllOrders: Pedidos encontrados:', ordersWithProfiles.length);
  return ordersWithProfiles;
}

export async function getOrderById(id: string) {
  console.log('[admin-api] getOrderById: Iniciando busca do pedido:', id);
  
  try {
    // Fetch order data
    console.log('[admin-api] getOrderById: Buscando dados do pedido...');
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('[admin-api] getOrderById: Erro ao buscar pedido:', error);
      throw new Error(`Erro ao buscar pedido: ${error.message}`);
    }
    
    if (!data) {
      console.log('[admin-api] getOrderById: Pedido não encontrado');
      return null;
    }
    
    console.log('[admin-api] getOrderById: Pedido encontrado:', data);
    
    // Fetch profile data separately if user_id exists
    if (data.user_id) {
      console.log('[admin-api] getOrderById: Buscando perfil do usuário:', data.user_id);
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, full_name, username, phone')
        .eq('id', data.user_id)
        .maybeSingle();
      
      if (!profileError && profile) {
        console.log('[admin-api] getOrderById: Perfil encontrado:', profile);
        data.profiles = profile;
      } else {
        console.log('[admin-api] getOrderById: Perfil não encontrado ou erro:', profileError);
        data.profiles = null;
      }
    } else {
      console.log('[admin-api] getOrderById: Pedido sem user_id');
      data.profiles = null;
    }
    
    // Fetch product details for each item in the order
    if (data.items && Array.isArray(data.items)) {
      console.log('[admin-api] getOrderById: Processando items do pedido:', data.items.length);
      const productIds = data.items.map((item: any) => item.product_id);
      
      if (productIds.length > 0) {
        console.log('[admin-api] getOrderById: Buscando produtos:', productIds);
        const { data: products, error: productsError } = await supabase
          .from('products')
          .select('id, name, image_url')
          .in('id', productIds);
        
        if (!productsError && products) {
          console.log('[admin-api] getOrderById: Produtos encontrados:', products.length);
          // Map products to items with proper structure
          data.order_items = data.items.map((item: any) => {
            const product = products.find((p: any) => p.id === item.product_id);
            return {
              id: `${data.id}-${item.product_id}`, // Create unique ID for order item
              product_id: item.product_id,
              quantity: item.quantity,
              price: item.price,
              products: product || { 
                id: item.product_id, 
                name: 'Produto não encontrado', 
                image_url: '' 
              }
            };
          });
        } else {
          console.error('[admin-api] getOrderById: Erro ao buscar produtos:', productsError);
          // If products fetch fails, still create order_items structure
          data.order_items = data.items.map((item: any) => ({
            id: `${data.id}-${item.product_id}`,
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.price,
            products: { 
              id: item.product_id, 
              name: 'Produto não encontrado', 
              image_url: '' 
            }
          }));
        }
      } else {
        console.log('[admin-api] getOrderById: Nenhum produto no pedido');
        data.order_items = [];
      }
    } else {
      console.log('[admin-api] getOrderById: Pedido sem items');
      data.order_items = [];
    }
    
    console.log('[admin-api] getOrderById: Pedido completo processado:', data);
    return data;
  } catch (error: any) {
    console.error('[admin-api] getOrderById: Erro geral:', error);
    throw error;
  }
}

export async function updateOrderStatus(id: string, status: string) {
  console.log('[admin-api] updateOrderStatus: Atualizando status do pedido:', { id, status });
  const { data, error } = await supabase
    .from('orders')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('[admin-api] updateOrderStatus: Erro ao atualizar status:', error);
    throw error;
  }
  
  console.log('[admin-api] updateOrderStatus: Status atualizado com sucesso');
  return data;
}

export async function deleteOrder(id: string) {
  console.log('[admin-api] deleteOrder: Excluindo pedido:', id);
  const { error } = await supabase
    .from('orders')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('[admin-api] deleteOrder: Erro ao excluir pedido:', error);
    throw error;
  }
  
  console.log('[admin-api] deleteOrder: Pedido excluído com sucesso');
}

// ==================== USERS (Admin) ====================

export async function getAllUsers() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

export async function getUserById(id: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function updateUserRole(id: string, role: 'user' | 'admin') {
  const { data, error } = await supabase
    .from('profiles')
    .update({ role })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ==================== DASHBOARD STATS ====================

export async function getDashboardStats() {
  console.log('[admin-api] getDashboardStats: Iniciando busca de estatísticas...');
  
  // Get total products
  const { count: totalProducts } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true });

  // Get total orders
  const { count: totalOrders } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true });

  // Get total users
  const { count: totalUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });

  // Get total revenue
  const { data: orders } = await supabase
    .from('orders')
    .select('total_amount')
    .eq('status', 'delivered');

  const totalRevenue = orders?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;

  // Get recent orders
  const { data: recentOrders, error: recentOrdersError } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);

  if (recentOrdersError) {
    console.error('[admin-api] getDashboardStats: Erro ao buscar pedidos recentes:', recentOrdersError);
  } else {
    console.log('[admin-api] getDashboardStats: Pedidos recentes encontrados:', recentOrders?.length || 0);
  }

  // Get low stock products
  const { data: lowStockProducts } = await supabase
    .from('products')
    .select('*')
    .lte('stock', 10)
    .order('stock', { ascending: true })
    .limit(5);

  console.log('[admin-api] getDashboardStats: Estatísticas carregadas:', {
    totalProducts,
    totalOrders,
    totalUsers,
    totalRevenue,
    recentOrdersCount: recentOrders?.length || 0
  });

  return {
    totalProducts: totalProducts || 0,
    totalOrders: totalOrders || 0,
    totalUsers: totalUsers || 0,
    totalRevenue,
    recentOrders: Array.isArray(recentOrders) ? recentOrders : [],
    lowStockProducts: Array.isArray(lowStockProducts) ? lowStockProducts : [],
  };
}

// ==================== REPORTS ====================

export async function getSalesReport(startDate?: string, endDate?: string) {
  let query = supabase
    .from('orders')
    .select('*')
    .eq('status', 'delivered');

  if (startDate) {
    query = query.gte('created_at', startDate);
  }

  if (endDate) {
    query = query.lte('created_at', endDate);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) throw error;

  const orders = Array.isArray(data) ? data : [];
  const totalSales = orders.reduce((sum, order) => sum + order.total_amount, 0);
  const totalOrders = orders.length;
  const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

  return {
    orders,
    totalSales,
    totalOrders,
    averageOrderValue,
  };
}

// ==================== IMAGE UPLOAD ====================

export async function uploadImage(file: File, bucket: string = 'products') {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return data.publicUrl;
}

export async function deleteImage(url: string, bucket: string = 'products') {
  const path = url.split('/').pop();
  if (!path) return;

  const { error } = await supabase.storage
    .from(bucket)
    .remove([path]);

  if (error) throw error;
}

// ==================== PRODUCT REVIEWS ====================

export async function getProductReviews(productId: string) {
  const { data, error } = await supabase
    .from('product_reviews')
    .select('*')
    .eq('product_id', productId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

export async function createProductReview(review: {
  product_id: string;
  user_name: string;
  rating: number;
  comment: string;
  images?: string[];
  is_verified_purchase?: boolean;
}) {
  const { data, error } = await supabase
    .from('product_reviews')
    .insert({
      ...review,
      images: review.images || [],
      is_verified_purchase: review.is_verified_purchase ?? true,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateProductReview(id: string, review: {
  user_name?: string;
  rating?: number;
  comment?: string;
  images?: string[];
  is_verified_purchase?: boolean;
}) {
  const { data, error } = await supabase
    .from('product_reviews')
    .update(review)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteProductReview(id: string) {
  const { error } = await supabase
    .from('product_reviews')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// ==================== COUPONS ====================

export async function getAllCoupons() {
  const { data, error } = await supabase
    .from('coupons')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

export async function getCouponById(id: string) {
  const { data, error } = await supabase
    .from('coupons')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getCouponByCode(code: string) {
  const { data, error } = await supabase
    .from('coupons')
    .select('*')
    .eq('code', code)
    .eq('active', true)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function createCoupon(coupon: Omit<Coupon, 'id' | 'created_at' | 'updated_at' | 'used_count'>) {
  const { data, error } = await supabase
    .from('coupons')
    .insert({
      ...coupon,
      used_count: 0
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateCoupon(id: string, coupon: Partial<Coupon>) {
  const { data, error } = await supabase
    .from('coupons')
    .update({
      ...coupon,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteCoupon(id: string) {
  const { error } = await supabase
    .from('coupons')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function getCouponUsageHistory(couponId?: string) {
  let query = supabase
    .from('coupon_usage')
    .select(`
      *,
      coupons!inner(code, discount_type, discount_value),
      orders!left(id, total_amount, status)
    `)
    .order('used_at', { ascending: false });

  if (couponId) {
    query = query.eq('coupon_id', couponId);
  }

  const { data, error } = await query;

  if (error) throw error;
  return Array.isArray(data) ? data : [];
}
