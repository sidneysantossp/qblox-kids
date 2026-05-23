import type { CartItem, Product, SiteSetting, HeroBanner, MiniBanner, Category, CouponValidation, BlogPost } from '@/types';
import { supabase } from './supabase';

// Categorias
export const getAllCategories = async () => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

// Produtos
export const getProducts = async (limit?: number) => {
  const query = supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (limit) {
    query.limit(limit);
  }
  
  const { data, error } = await query;
  
  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const getProductsByCategory = async (category: string, limit?: number) => {
  const query = supabase
    .from('products')
    .select('*')
    .contains('categories', [category])
    .order('created_at', { ascending: false });
  
  if (limit) {
    query.limit(limit);
  }
  
  const { data, error } = await query;
  
  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const getFeaturedProducts = async (limit = 8) => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(limit);
  
  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const getBestsellerProducts = async (limit = 8) => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_bestseller', true)
    .order('reviews_count', { ascending: false })
    .limit(limit);
  
  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const getOnSaleProducts = async (limit = 6) => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_on_sale', true)
    .order('created_at', { ascending: false })
    .limit(limit);
  
  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const getFlashSaleProducts = async (limit = 6) => {
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_flash_sale', true)
    .gt('flash_sale_end_time', now)
    .order('flash_sale_end_time', { ascending: true })
    .limit(limit);
  
  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const getWeeklyDealsProducts = async (limit = 8) => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_weekly_deal', true)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const getLaunchProducts = async (limit = 8) => {
  return getProductsByCategory('lancamentos', limit);
};

export const getBuildCollectionProducts = async (limit = 8) => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_build_collection', true)
    .order('created_at', { ascending: false })
    .limit(limit);
  
  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const getTvSeriesProducts = async (limit = 8) => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_tv_series', true)
    .order('created_at', { ascending: false })
    .limit(limit);
  
  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const getProductById = async (id: string): Promise<Product | null> => {
  // Verifica se é um UUID válido
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const isUuid = uuidRegex.test(id);
  
  // Se for UUID, busca por ID, senão busca por slug
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq(isUuid ? 'id' : 'slug', id)
    .maybeSingle();
  
  if (error) throw error;
  return data;
};

export const searchProducts = async (searchTerm: string) => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%,sku.ilike.%${searchTerm}%`)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

// Carrinho
export const getCartItems = async (sessionId: string): Promise<CartItem[]> => {
  const { data, error } = await supabase
    .from('cart_items')
    .select(`
      *,
      product:products(*)
    `)
    .eq('session_id', sessionId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const addToCart = async (sessionId: string, productId: string, quantity = 1) => {
  try {
    console.log('addToCart chamado:', { sessionId, productId, quantity });
    
    // Verificar se o item já existe no carrinho
    const { data: existingItem, error: selectError } = await supabase
      .from('cart_items')
      .select('*')
      .eq('session_id', sessionId)
      .eq('product_id', productId)
      .maybeSingle();
    
    if (selectError) {
      console.error('Erro ao verificar item existente:', selectError);
      throw selectError;
    }
    
    console.log('Item existente:', existingItem);
    
    if (existingItem) {
      // Atualizar quantidade
      const { data, error } = await supabase
        .from('cart_items')
        .update({ quantity: existingItem.quantity + quantity, updated_at: new Date().toISOString() })
        .eq('id', existingItem.id)
        .select()
        .maybeSingle();
      
      if (error) {
        console.error('Erro ao atualizar quantidade:', error);
        throw error;
      }
      console.log('Item atualizado:', data);
      return data;
    } else {
      // Adicionar novo item
      const { data, error } = await supabase
        .from('cart_items')
        .insert({ session_id: sessionId, product_id: productId, quantity })
        .select()
        .maybeSingle();
      
      if (error) {
        console.error('Erro ao inserir novo item:', error);
        throw error;
      }
      console.log('Novo item adicionado:', data);
      return data;
    }
  } catch (error) {
    console.error('Erro geral em addToCart:', error);
    throw error;
  }
};

export const updateCartItemQuantity = async (itemId: string, quantity: number) => {
  if (quantity <= 0) {
    return removeFromCart(itemId);
  }
  
  const { data, error } = await supabase
    .from('cart_items')
    .update({ quantity, updated_at: new Date().toISOString() })
    .eq('id', itemId)
    .select()
    .maybeSingle();
  
  if (error) throw error;
  return data;
};

export const removeFromCart = async (itemId: string) => {
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('id', itemId);
  
  if (error) throw error;
};

export const clearCart = async (sessionId: string) => {
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('session_id', sessionId);
  
  if (error) throw error;
};

// ========== Pagamentos com Stripe ==========

export const createStripeCheckout = async (checkoutData: any) => {
  try {
    // Fazer chamada HTTP direta para evitar o problema de JWT inválido
    // que ocorre quando o Supabase client envia automaticamente o token
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Configuração do Supabase não encontrada');
    }
    
    const functionUrl = `${supabaseUrl}/functions/v1/create_stripe_checkout`;
    
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'apikey': supabaseAnonKey,
      },
      body: JSON.stringify(checkoutData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ 
        message: 'Erro ao processar pagamento' 
      }));
      console.error('Erro na resposta:', errorData);
      throw new Error(errorData.message || 'Erro ao criar sessão de pagamento');
    }

    const result = await response.json();
    return result.data || result;
  } catch (error) {
    console.error('Erro ao criar checkout Stripe:', error);
    throw error;
  }
};

export const verifyStripePayment = async (sessionId: string) => {
  const { data, error } = await supabase.functions.invoke('verify_stripe_payment', {
    body: { sessionId },
  });

  if (error) {
    const errorMsg = await error?.context?.text();
    console.error('Erro ao verificar pagamento:', errorMsg || error?.message);
    throw new Error(errorMsg || error?.message || 'Erro ao verificar pagamento');
  }

  return data;
};

// ========== Pedidos ==========

export const getUserOrders = async (userId: string) => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const getOrderById = async (orderId: string) => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const retryOrderPayment = async (orderId: string) => {
  // Buscar pedido
  const order = await getOrderById(orderId);
  
  if (!order) {
    throw new Error('Pedido não encontrado');
  }

  if (order.status !== 'pending') {
    throw new Error('Apenas pedidos pendentes podem ter o pagamento retentado');
  }

  // Criar nova sessão de checkout com os mesmos dados
  const checkoutData = {
    items: order.items,
    shipping_address: order.shipping_address,
    shipping_cost: order.shipping_cost,
    discount: order.discount,
    coupon_code: order.coupon_code,
    currency: order.currency || 'brl',
  };

  return await createStripeCheckout(checkoutData);
};

// ========== Asaas Payment ==========

const ASAAS_FUNCTION_TIMEOUT_MS = 25000;

const withTimeout = async <T>(promise: Promise<T>, timeoutMs: number, timeoutMessage: string) => {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  try {
    return await Promise.race([
      promise,
      new Promise<T>((_, reject) => {
        timeoutId = setTimeout(() => reject(new Error(timeoutMessage)), timeoutMs);
      }),
    ]);
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
};

const parseFunctionError = async (error: any, fallbackMessage: string) => {
  const rawError = await error?.context?.text?.();

  if (!rawError) {
    return fallbackMessage;
  }

  try {
    const parsed = JSON.parse(rawError);
    if (parsed?.error && parsed?.step) {
      return `${parsed.error} (${parsed.step})`;
    }
    return parsed?.error || fallbackMessage;
  } catch {
    return rawError;
  }
};

export const createAsaasPayment = async (paymentData: any) => {
  const requestId = paymentData?.requestId || crypto.randomUUID();
  const startedAt = performance.now();

  console.log('[Checkout]', { requestId, step: 'create_asaas_payment:start' });

  const { data, error } = await withTimeout(
    supabase.functions.invoke('create_asaas_payment', {
      body: {
        ...paymentData,
        requestId,
      },
    }),
    ASAAS_FUNCTION_TIMEOUT_MS,
    'Tempo limite ao criar cobrança no Asaas'
  );

  if (error) {
    const errorMsg = await parseFunctionError(error, 'Erro ao criar pagamento');
    console.error('[Checkout]', {
      requestId,
      step: 'create_asaas_payment:error',
      elapsedMs: Math.round(performance.now() - startedAt),
      error: errorMsg,
    });
    throw new Error(errorMsg);
  }

  console.log('[Checkout]', {
    requestId,
    step: 'create_asaas_payment:success',
    elapsedMs: Math.round(performance.now() - startedAt),
  });

  return data;
};

export const verifyAsaasPayment = async (paymentId: string) => {
  const startedAt = performance.now();

  const { data, error } = await withTimeout(
    supabase.functions.invoke('verify_asaas_payment', {
      body: { payment_id: paymentId },
    }),
    ASAAS_FUNCTION_TIMEOUT_MS,
    'Tempo limite ao verificar pagamento no Asaas'
  );

  if (error) {
    const errorMsg = await parseFunctionError(error, 'Erro ao verificar pagamento');
    console.error('[Checkout]', {
      step: 'verify_asaas_payment:error',
      paymentId,
      elapsedMs: Math.round(performance.now() - startedAt),
      error: errorMsg,
    });
    throw new Error(errorMsg);
  }

  console.log('[Checkout]', {
    step: 'verify_asaas_payment:success',
    paymentId,
    elapsedMs: Math.round(performance.now() - startedAt),
  });

  return data;
};

// ========== Custom Builder / Monte sua Coleção ==========

export const getProductsByPartType = async (partType: string) => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('part_type', partType)
    .eq('category', 'Monte sua Coleção')
    .order('name', { ascending: true });
  
  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const saveCustomBuild = async (buildData: {
  session_id: string;
  user_id?: string | null;
  name: string;
  head_product_id?: string | null;
  helmet_product_id?: string | null;
  body_product_id?: string | null;
  arms_product_id?: string | null;
  legs_product_id?: string | null;
  accessory_product_id?: string | null;
  total_price: number;
}) => {
  const { data, error } = await supabase
    .from('custom_builds')
    .insert(buildData)
    .select()
    .maybeSingle();
  
  if (error) throw error;
  return data;
};

export const getCustomBuildsBySession = async (sessionId: string) => {
  const { data, error } = await supabase
    .from('custom_builds')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

// ========== Site Settings ==========

export const getSiteSettings = async (): Promise<SiteSetting[]> => {
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .order('setting_key', { ascending: true });
  
  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const getSiteSettingByKey = async (key: string): Promise<SiteSetting | null> => {
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .eq('setting_key', key)
    .maybeSingle();
  
  if (error) throw error;
  return data;
};

export const updateSiteSetting = async (key: string, value: string) => {
  const { data, error } = await supabase
    .from('site_settings')
    .upsert(
      {
        setting_key: key,
        setting_value: value,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'setting_key' }
    )
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
};

// ========== Hero Banners ==========

export const getActiveHeroBanners = async (): Promise<HeroBanner[]> => {
  const { data, error } = await supabase
    .from('hero_banners')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

// ========== Mini Banners ==========

export const getActiveMiniBanners = async (placement = 'promo_mini', limit = 2): Promise<MiniBanner[]> => {
  const { data, error } = await supabase
    .from('mini_banners')
    .select('*')
    .eq('is_active', true)
    .eq('placement', placement)
    .order('display_order', { ascending: true })
    .limit(limit);

  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

// ========== Payment Methods ==========

export const getActivePaymentMethods = async () => {
  const { data, error } = await supabase
    .from('payment_methods')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

// ========== Shipping / Frete ==========

export interface ShippingOption {
  id: string;
  name: string;
  price: number;
  delivery_time: string;
  company: string;
  isFallback?: boolean;
}

export const FREE_SHIPPING_THRESHOLD = 99;
const STANDARD_SHIPPING_PRICE = 15.9;
const MOTOBOY_SHIPPING_PRICE = 18;

const isGreaterSaoPaulo = (cep: string): boolean => {
  const cleanCep = cep.replace(/\D/g, '');
  const cepNum = parseInt(cleanCep.substring(0, 5));

  if ((cepNum >= 1000 && cepNum <= 5999) || (cepNum >= 8000 && cepNum <= 8499)) {
    return true;
  }

  if (cepNum >= 9000 && cepNum <= 9999) {
    return true;
  }

  if (cepNum >= 7000 && cepNum <= 7299) {
    return true;
  }

  if (cepNum >= 6000 && cepNum <= 6299) {
    return true;
  }

  if (cepNum >= 6300 && cepNum <= 6899) {
    return true;
  }

  if (cepNum >= 8700 && cepNum <= 8899) {
    return true;
  }

  return false;
};

const buildFallbackShippingOptions = (destinationCep: string, cartTotal: number): ShippingOption[] => {
  const isFreeShipping = cartTotal >= FREE_SHIPPING_THRESHOLD;
  const options: ShippingOption[] = [
    {
      id: 'standard',
      name: 'Frete Padrão',
      price: isFreeShipping ? 0 : STANDARD_SHIPPING_PRICE,
      delivery_time: '5-10 dias úteis',
      company: 'Correios',
      isFallback: true,
    },
  ];

  if (isGreaterSaoPaulo(destinationCep)) {
    options.push({
      id: 'motoboy',
      name: 'Moto Boy - Entrega Full',
      price: MOTOBOY_SHIPPING_PRICE,
      delivery_time: 'Disponível apenas para Grande São Paulo',
      company: 'Moto Boy',
      isFallback: true,
    });
  }

  return options.sort((a, b) => a.price - b.price);
};

const normalizeShippingOptions = (options: ShippingOption[], cartTotal: number) => {
  const isFreeShipping = cartTotal >= FREE_SHIPPING_THRESHOLD;

  return options
    .map((option) => ({
      ...option,
      price:
        isFreeShipping && (option.company?.toLowerCase().includes('correio') || option.id === 'standard')
          ? 0
          : option.price,
    }))
    .sort((a, b) => a.price - b.price);
};

export const calculateShipping = async (
  destinationCep: string,
  cartTotal: number
): Promise<ShippingOption[]> => {
  try {
    console.log('[API] calculateShipping chamado:', { destinationCep, cartTotal });

    const { data: settings, error: settingsError } = await supabase
      .from('settings')
      .select('key, value')
      .in('key', ['correios_api_key', 'correios_cep_origem']);

    if (settingsError) {
      console.error('[API] Erro ao buscar configurações:', settingsError);
      throw settingsError;
    }

    const apiKey = settings?.find((s) => s.key === 'correios_api_key')?.value;
    const cepOrigem = settings?.find((s) => s.key === 'correios_cep_origem')?.value;

    if (!apiKey || !cepOrigem) {
      console.warn('[API] Configurações dos Correios não encontradas, usando frete padrão');
      return buildFallbackShippingOptions(destinationCep, cartTotal);
    }

    const cleanOriginCep = cepOrigem.replace(/\D/g, '');
    const cleanDestCep = destinationCep.replace(/\D/g, '');

    if (cleanOriginCep.length !== 8 || cleanDestCep.length !== 8) {
      throw new Error('CEP inválido');
    }

    const { data, error } = await supabase.functions.invoke('calculate-shipping', {
      body: {
        cep_origem: cleanOriginCep,
        cep_destino: cleanDestCep,
        peso: 300,
        comprimento: 20,
        altura: 10,
        largura: 15,
        valor_declarado: cartTotal,
      },
    });

    if (error) {
      console.error('[API] Erro ao calcular frete:', error);
      return buildFallbackShippingOptions(destinationCep, cartTotal);
    }

    const rawOptions = Array.isArray(data?.options)
      ? data.options
      : Array.isArray(data?.opcoes)
        ? data.opcoes.map((option: any) => ({
            id: String(option.servico),
            name: option.nome,
            price: Number(option.valor),
            delivery_time: option.prazo === 0 ? 'Mesmo dia' : `${option.prazo} dia(s) úteis`,
            company: option.servico === 'motoboy' ? 'Moto Boy' : 'Correios',
          }))
        : [];

    if (rawOptions.length === 0) {
      return buildFallbackShippingOptions(destinationCep, cartTotal);
    }

    return normalizeShippingOptions(rawOptions, cartTotal);
  } catch (error) {
    console.error('[API] Erro ao calcular frete:', error);
    return buildFallbackShippingOptions(destinationCep, cartTotal);
  }
};

// Avaliações de Produtos
export const getProductReviews = async (productId: string) => {
  const { data, error } = await supabase
    .from('product_reviews')
    .select('*')
    .eq('product_id', productId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const getProductReviewsStats = async (productId: string) => {
  const reviews = await getProductReviews(productId);
  
  if (reviews.length === 0) {
    return {
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    };
  }
  
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = totalRating / reviews.length;
  
  const ratingDistribution = reviews.reduce((acc, review) => {
    acc[review.rating] = (acc[review.rating] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);
  
  return {
    averageRating: Math.round(averageRating * 10) / 10,
    totalReviews: reviews.length,
    ratingDistribution: {
      5: ratingDistribution[5] || 0,
      4: ratingDistribution[4] || 0,
      3: ratingDistribution[3] || 0,
      2: ratingDistribution[2] || 0,
      1: ratingDistribution[1] || 0,
    },
  };
};

// ==================== COUPONS ====================

export const validateCoupon = async (code: string, cartTotal: number): Promise<CouponValidation> => {
  try {
    const { data, error } = await supabase.rpc('validate_coupon', {
      p_code: code,
      p_cart_total: cartTotal
    });

    if (error) throw error;

    return data as CouponValidation;
  } catch (error) {
    console.error('Erro ao validar cupom:', error);
    return {
      valid: false,
      message: 'Erro ao validar cupom. Tente novamente.'
    };
  }
};

export const applyCoupon = async (
  couponId: string,
  orderId: string,
  discountAmount: number
): Promise<void> => {
  const { error } = await supabase.rpc('apply_coupon', {
    p_coupon_id: couponId,
    p_order_id: orderId,
    p_discount_amount: discountAmount
  });

  if (error) throw error;
};

// Configurações do WhatsApp
export const getWhatsAppSettings = async () => {
  const { data, error } = await supabase
    .from('whatsapp_settings')
    .select('*')
    .eq('is_active', true)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
};

export const createWhatsAppSettings = async (
  settings: { phone_number: string; welcome_message: string; show_button?: boolean }
) => {
  console.log('Criando novas configurações do WhatsApp...');
  
  // Check if user is authenticated
  const { data: { session } } = await supabase.auth.getSession();
  console.log('Session ao criar WhatsApp:', session?.user?.id);
  console.log('User metadata:', session?.user?.user_metadata);
  console.log('App metadata:', session?.user?.app_metadata);
  
  const { data, error } = await supabase
    .from('whatsapp_settings')
    .insert({
      ...settings,
      is_active: true,
      show_button: settings.show_button ?? true
    })
    .select()
    .maybeSingle();

  if (error) {
    console.error('Erro ao criar configurações do WhatsApp:', error);
    throw error;
  }
  
  if (!data) {
    console.error('Insert retornou null - possível problema de RLS');
    throw new Error('Não foi possível criar as configurações. Verifique se você tem permissão de administrador.');
  }
  
  console.log('Configurações criadas com sucesso:', data);
  return data;
};

export const updateWhatsAppSettings = async (
  id: string,
  settings: { phone_number: string; welcome_message: string; show_button?: boolean }
) => {
  // Check if user is authenticated
  const { data: { session } } = await supabase.auth.getSession();
  console.log('Session ao atualizar WhatsApp:', session?.user?.id);
  console.log('User metadata:', session?.user?.user_metadata);
  console.log('App metadata:', session?.user?.app_metadata);
  
  const { data, error } = await supabase
    .from('whatsapp_settings')
    .update({
      ...settings,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .maybeSingle();

  if (error) {
    console.error('Erro ao atualizar configurações do WhatsApp:', error);
    throw error;
  }
  
  if (!data) {
    console.error('Update retornou null - possível problema de RLS');
    throw new Error('Nenhuma configuração foi atualizada. Verifique se você tem permissão de administrador.');
  }
  
  return data;
};

// ============================================================================
// BLOG POSTS
// ============================================================================

/**
 * Busca todos os posts publicados do blog
 */
export const getPublishedBlogPosts = async (): Promise<BlogPost[]> => {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('is_published', true)
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Erro ao buscar posts do blog:', error);
    return [];
  }

  return Array.isArray(data) ? data : [];
};

/**
 * Busca um post do blog por slug
 */
export const getBlogPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .maybeSingle();

  if (error) {
    console.error('Erro ao buscar post do blog:', error);
    return null;
  }

  // Incrementar views_count
  if (data) {
    await supabase
      .from('blog_posts')
      .update({ views_count: (data.views_count || 0) + 1 })
      .eq('id', data.id);
  }

  return data;
};

/**
 * Busca posts do blog por categoria
 */
export const getBlogPostsByCategory = async (category: string): Promise<BlogPost[]> => {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('category', category)
    .eq('is_published', true)
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Erro ao buscar posts por categoria:', error);
    return [];
  }

  return Array.isArray(data) ? data : [];
};

/**
 * Busca posts relacionados (mesma categoria, exceto o atual)
 */
export const getRelatedBlogPosts = async (currentPostId: string, category: string, limit = 3): Promise<BlogPost[]> => {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('category', category)
    .eq('is_published', true)
    .neq('id', currentPostId)
    .order('published_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Erro ao buscar posts relacionados:', error);
    return [];
  }

  return Array.isArray(data) ? data : [];
};

/**
 * Busca categoria por slug com todos os campos
 */
export const getCategoryBySlug = async (slug: string): Promise<Category | null> => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error) {
    console.error('Erro ao buscar categoria:', error);
    return null;
  }

  return data;
};
