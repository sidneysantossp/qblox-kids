-- Adicionar colunas faltantes na tabela coupons
ALTER TABLE coupons 
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS min_purchase DECIMAL(10, 2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS max_discount DECIMAL(10, 2),
  ADD COLUMN IF NOT EXISTS usage_limit INTEGER,
  ADD COLUMN IF NOT EXISTS used_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Renomear expires_at para valid_until se necessário
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_name = 'coupons' AND column_name = 'expires_at') THEN
    ALTER TABLE coupons RENAME COLUMN expires_at TO valid_until;
  END IF;
END $$;

-- Adicionar valid_from se não existir
ALTER TABLE coupons ADD COLUMN IF NOT EXISTS valid_from TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);
CREATE INDEX IF NOT EXISTS idx_coupons_active ON coupons(active);
CREATE INDEX IF NOT EXISTS idx_coupons_valid_dates ON coupons(valid_from, valid_until);

-- Criar tabela de uso de cupons (histórico)
CREATE TABLE IF NOT EXISTS coupon_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coupon_id UUID NOT NULL REFERENCES coupons(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  discount_amount DECIMAL(10, 2) NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para histórico de uso
CREATE INDEX IF NOT EXISTS idx_coupon_usage_coupon_id ON coupon_usage(coupon_id);
CREATE INDEX IF NOT EXISTS idx_coupon_usage_order_id ON coupon_usage(order_id);
CREATE INDEX IF NOT EXISTS idx_coupon_usage_user_id ON coupon_usage(user_id);

-- Adicionar coluna de cupom na tabela de pedidos (se não existir)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'orders' AND column_name = 'coupon_code') THEN
    ALTER TABLE orders ADD COLUMN coupon_code VARCHAR(50);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'orders' AND column_name = 'coupon_discount') THEN
    ALTER TABLE orders ADD COLUMN coupon_discount DECIMAL(10, 2) DEFAULT 0;
  END IF;
END $$;

-- Políticas RLS para coupons
DROP POLICY IF EXISTS "Admins podem gerenciar cupons" ON coupons;
DROP POLICY IF EXISTS "Usuários autenticados podem visualizar cupons ativos" ON coupons;

CREATE POLICY "Admins podem gerenciar cupons"
  ON coupons
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Usuários autenticados podem visualizar cupons ativos"
  ON coupons
  FOR SELECT
  USING (active = true AND auth.uid() IS NOT NULL);

-- Políticas RLS para coupon_usage
ALTER TABLE coupon_usage ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins podem ver todo histórico de uso" ON coupon_usage;
DROP POLICY IF EXISTS "Usuários podem ver seu próprio histórico" ON coupon_usage;

CREATE POLICY "Admins podem ver todo histórico de uso"
  ON coupon_usage
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Usuários podem ver seu próprio histórico"
  ON coupon_usage
  FOR SELECT
  USING (user_id = auth.uid());

-- Função para validar cupom
CREATE OR REPLACE FUNCTION validate_coupon(
  p_code VARCHAR(50),
  p_cart_total DECIMAL(10, 2)
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_coupon RECORD;
  v_discount_amount DECIMAL(10, 2);
BEGIN
  -- Buscar cupom
  SELECT * INTO v_coupon
  FROM coupons
  WHERE code = p_code
  AND active = true
  AND (valid_from IS NULL OR valid_from <= NOW())
  AND (valid_until IS NULL OR valid_until >= NOW())
  AND (usage_limit IS NULL OR used_count < usage_limit);

  -- Verificar se cupom existe e é válido
  IF NOT FOUND THEN
    RETURN json_build_object(
      'valid', false,
      'message', 'Cupom inválido ou expirado'
    );
  END IF;

  -- Verificar valor mínimo de compra
  IF p_cart_total < COALESCE(v_coupon.min_purchase, 0) THEN
    RETURN json_build_object(
      'valid', false,
      'message', 'Valor mínimo de compra não atingido: R$ ' || COALESCE(v_coupon.min_purchase, 0)::TEXT
    );
  END IF;

  -- Calcular desconto
  IF v_coupon.discount_type = 'percentage' THEN
    v_discount_amount := (p_cart_total * v_coupon.discount_value / 100);
    IF v_coupon.max_discount IS NOT NULL AND v_discount_amount > v_coupon.max_discount THEN
      v_discount_amount := v_coupon.max_discount;
    END IF;
  ELSE
    v_discount_amount := v_coupon.discount_value;
  END IF;

  -- Garantir que desconto não seja maior que o total
  IF v_discount_amount > p_cart_total THEN
    v_discount_amount := p_cart_total;
  END IF;

  RETURN json_build_object(
    'valid', true,
    'coupon_id', v_coupon.id,
    'code', v_coupon.code,
    'discount_type', v_coupon.discount_type,
    'discount_value', v_coupon.discount_value,
    'discount_amount', v_discount_amount,
    'message', 'Cupom aplicado com sucesso!'
  );
END;
$$;

-- Função para aplicar cupom (incrementar contador de uso)
CREATE OR REPLACE FUNCTION apply_coupon(
  p_coupon_id UUID,
  p_order_id UUID,
  p_discount_amount DECIMAL(10, 2)
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Incrementar contador de uso
  UPDATE coupons
  SET used_count = COALESCE(used_count, 0) + 1,
      updated_at = NOW()
  WHERE id = p_coupon_id;

  -- Registrar uso
  INSERT INTO coupon_usage (coupon_id, order_id, user_id, discount_amount)
  VALUES (p_coupon_id, p_order_id, auth.uid(), p_discount_amount);
END;
$$;

-- Atualizar cupons existentes com valores padrão
UPDATE coupons 
SET used_count = COALESCE(used_count, 0),
    min_purchase = COALESCE(min_purchase, 0),
    valid_from = COALESCE(valid_from, created_at)
WHERE used_count IS NULL OR min_purchase IS NULL OR valid_from IS NULL;