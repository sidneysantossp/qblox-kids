export interface Option {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
  withCount?: boolean;
}

export type AvailabilityStatus = 'in_stock' | 'made_to_order' | 'unavailable';

export interface Product {
  id: string;
  name: string;
  slug?: string | null; // URL-friendly slug
  description: string | null; // descrição curta
  rich_description?: string | null; // descrição rica (200-300 palavras)
  price: number;
  original_price: number | null;
  category: string; // categoria principal (mantida por compatibilidade)
  categories: string[]; // múltiplas categorias
  image_url: string;
  images: string[];
  stock: number;
  is_featured: boolean;
  is_bestseller: boolean;
  is_on_sale: boolean;
  is_flash_sale: boolean;
  is_weekly_deal: boolean;
  is_build_collection: boolean;
  is_tv_series: boolean;
  flash_sale_end_time: string | null;
  rating: number;
  reviews_count: number;
  part_type?: string | null;
  availability_status: AvailabilityStatus;
  weight?: number; // peso em gramas
  length?: number; // comprimento em cm
  height?: number; // altura em cm
  width?: number; // largura em cm
  sku?: string | null; // código SKU único (ex: QB-01)
  meta_title?: string | null; // título SEO
  meta_description?: string | null; // descrição SEO
  age_recommendation?: string | null; // idade recomendada (ex: "6+")
  whats_included?: string | null; // o que está incluído no kit
  material?: string | null; // material (ex: "Plástico ABS")
  created_at: string;
  updated_at: string;
}

export interface CustomBuild {
  id: string;
  session_id: string;
  user_id: string | null;
  name: string;
  head_product_id: string | null;
  helmet_product_id: string | null;
  body_product_id: string | null;
  arms_product_id: string | null;
  legs_product_id: string | null;
  accessory_product_id: string | null;
  total_price: number;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: string;
  session_id: string;
  product_id: string;
  quantity: number;
  product?: Product;
  created_at: string;
  updated_at: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface Category {
  id?: string;
  name: string;
  slug: string;
  description?: string | null;
  long_description?: string | null; // 300-500 palavras para SEO
  image_url?: string | null;
  mini_thumb_url?: string | null;
  icon?: string | null;
  display_order?: number;
  is_active?: boolean;
  show_in_navbar?: boolean;
  parent_id?: string | null;
  faq?: FAQItem[] | null; // FAQ da categoria
  keywords?: string[] | null; // Keywords principais
  meta_title?: string | null;
  meta_description?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt?: string | null;
  content: string;
  featured_image?: string | null;
  author?: string;
  category?: string | null;
  tags?: string[] | null;
  keywords?: string[] | null;
  faq?: FAQItem[] | null;
  meta_title?: string | null;
  meta_description?: string | null;
  is_published: boolean;
  published_at?: string | null;
  views_count: number;
  reading_time?: number | null; // em minutos
  created_at: string;
  updated_at: string;
}

export interface HeroBanner {
  id: string;
  title: string;
  subtitle?: string | null;
  image_url: string;
  link_url?: string | null;
  button_text?: string | null;
  background_position_y?: number;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MiniBanner {
  id: string;
  title: string;
  subtitle?: string | null;
  image_url: string;
  link_url?: string | null;
  button_text?: string | null;
  placement?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type SpecialHighlightBackgroundType = 'gradient' | 'image' | 'solid';

export interface SpecialHighlightConfig {
  badge_text?: string;
  headline?: string;
  description?: string;
  features?: string[];
  image_url?: string;
  price_prefix?: string;
  price_value?: string;
  primary_cta_text?: string;
  primary_cta_url?: string;
  secondary_cta_text?: string;
  secondary_cta_url?: string;
  background_type?: SpecialHighlightBackgroundType;
  background_image_url?: string;
  background_color?: string;
  background_gradient_from?: string;
  background_gradient_via?: string;
  background_gradient_to?: string;
  background_overlay?: string;
  background_image_position_y?: number;
}

export interface HomepageSection {
  id: string;
  section_type: 'promotional_cards' | 'category_carousel' | 'featured_products' | 'best_sellers' | 'on_sale' | 'special_highlight' | 'thematic_collections';
  title: string;
  subtitle?: string | null;
  is_active: boolean;
  display_order: number;
  config: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  featured_image?: string | null;
  author_id?: string | null;
  category?: string | null;
  tags?: string[] | null;
  is_published: boolean;
  published_at?: string | null;
  views: number;
  created_at: string;
  updated_at: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  code: string;
  description?: string | null;
  icon?: string | null;
  is_active: boolean;
  config: Record<string, any>;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  username?: string | null;
  full_name?: string | null;
  avatar_url?: string | null;
  phone?: string | null;
  zip_code?: string | null;
  address?: string | null;
  number?: string | null;
  complement?: string | null;
  neighborhood?: string | null;
  city?: string | null;
  state?: string | null;
  role: 'user' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
}

export interface Order {
  id: string;
  user_id: string | null;
  total_amount: number;
  shipping_cost: number;
  discount: number;
  coupon_code?: string | null;
  payment_method: string;
  payment_method_id?: string | null;
  payment_method_type?: string | null;
  payment_gateway?: 'stripe' | 'asaas';
  status: 'pending' | 'completed' | 'cancelled' | 'refunded';
  shipping_address: any;
  items: OrderItem[];
  currency: string;
  stripe_session_id?: string | null;
  stripe_payment_intent_id?: string | null;
  asaas_payment_id?: string | null;
  asaas_invoice_url?: string | null;
  asaas_bank_slip_url?: string | null;
  asaas_pix_qr_code?: string | null;
  asaas_pix_copy_paste?: string | null;
  customer_email?: string | null;
  customer_name?: string | null;
  completed_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Coupon {
  id: string;
  code: string;
  description?: string | null;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_purchase: number;
  max_discount?: number | null;
  usage_limit?: number | null;
  used_count: number;
  valid_from: string;
  valid_until?: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CouponValidation {
  valid: boolean;
  coupon_id?: string;
  code?: string;
  discount_type?: 'percentage' | 'fixed';
  discount_value?: number;
  discount_amount?: number;
  message: string;
}

export interface CouponUsage {
  id: string;
  coupon_id: string;
  order_id?: string | null;
  user_id?: string | null;
  discount_amount: number;
  used_at: string;
}

export interface CheckoutRequest {
  items: OrderItem[];
  shipping_address?: any;
  shipping_cost?: number;
  discount?: number;
  coupon_code?: string;
  currency?: string;
  payment_method_types?: string[];
}

export interface CheckoutResponse {
  url: string;
  sessionId: string;
  orderId: string;
}

export interface PaymentVerificationResponse {
  verified: boolean;
  status: string;
  sessionId?: string;
  paymentIntentId?: string;
  paymentId?: string;
  amount?: number;
  currency?: string;
  customerEmail?: string;
  customerName?: string;
  order?: Order;
  message?: string;
  asaasStatus?: string;
  invoiceUrl?: string;
  bankSlipUrl?: string;
}

export interface AsaasCustomer {
  name: string;
  email: string;
  cpfCnpj: string;
  phone?: string;
  postalCode?: string;
  address?: string;
  addressNumber?: string;
  complement?: string;
  province?: string;
  city?: string;
  state?: string;
}

export interface AsaasCreditCard {
  holderName: string;
  number: string;
  expiryMonth: string;
  expiryYear: string;
  ccv: string;
}

export interface AsaasPaymentRequest {
  items: OrderItem[];
  customer: AsaasCustomer;
  paymentMethod: 'PIX' | 'BOLETO' | 'CREDIT_CARD';
  creditCard?: AsaasCreditCard;
  creditCardHolderInfo?: AsaasCustomer;
  shipping_cost?: number;
  discount?: number;
  coupon_code?: string;
}

export interface AsaasPaymentResponse {
  success: boolean;
  orderId: string;
  paymentId: string;
  invoiceUrl?: string;
  bankSlipUrl?: string;
  pixQrCode?: string;
  pixCopyPaste?: string;
  status: string;
  paymentMethod: string;
}

export interface SiteSetting {
  id: string;
  setting_key: string;
  setting_value: string | null;
  setting_type: string;
  description: string | null;
  is_secret: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductReview {
  id: string;
  product_id: string;
  user_name: string;
  rating: number;
  comment: string;
  images: string[];
  is_verified_purchase: boolean;
  helpful_count: number;
  created_at: string;
  updated_at: string;
}

export interface WhatsAppSettings {
  id: string;
  phone_number: string;
  welcome_message: string;
  is_active: boolean;
  show_button: boolean;
  created_at: string;
  updated_at: string;
}
