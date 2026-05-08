-- Add Stripe payment fields to orders table
ALTER TABLE public.orders 
  ADD COLUMN IF NOT EXISTS stripe_session_id TEXT,
  ADD COLUMN IF NOT EXISTS stripe_payment_intent_id TEXT,
  ADD COLUMN IF NOT EXISTS customer_email TEXT,
  ADD COLUMN IF NOT EXISTS customer_name TEXT,
  ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'brl';

-- Add unique constraint for stripe_session_id
DO $$ BEGIN
  ALTER TABLE public.orders ADD CONSTRAINT orders_stripe_session_id_key UNIQUE (stripe_session_id);
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Update existing status values to standardize
UPDATE public.orders SET status = 'pending' WHERE status IS NULL OR status = '';
UPDATE public.orders SET status = 'completed' WHERE status IN ('delivered', 'paid');
UPDATE public.orders SET status = 'cancelled' WHERE status = 'canceled';

-- Set default for status if not set
ALTER TABLE public.orders ALTER COLUMN status SET DEFAULT 'pending';

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_orders_stripe_session_id ON public.orders(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_orders_stripe_payment_intent_id ON public.orders(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

-- Update RLS policies for orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
DROP POLICY IF EXISTS "Service role can manage orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Users can create orders" ON public.orders;

-- Users can view their own orders
CREATE POLICY "Users can view own orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own orders (guest checkout allowed)
CREATE POLICY "Users can create orders"
  ON public.orders FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Service role can manage all orders (for edge functions)
CREATE POLICY "Service role can manage orders"
  ON public.orders FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

-- Admins can view all orders
CREATE POLICY "Admins can view all orders"
  ON public.orders FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Add comment
COMMENT ON TABLE public.orders IS 'Pedidos com integração Stripe para pagamentos';