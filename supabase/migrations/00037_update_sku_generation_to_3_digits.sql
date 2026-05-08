-- Update the SKU generation function to use 3-digit padding
CREATE OR REPLACE FUNCTION public.generate_sku_from_sequence()
RETURNS text
LANGUAGE plpgsql
AS $function$
BEGIN
  RETURN 'QB-' || LPAD(nextval('product_sku_seq')::TEXT, 3, '0');
END;
$function$;

-- Update the sequence to continue from the current max
SELECT setval('product_sku_seq', (SELECT COALESCE(MAX(SUBSTRING(sku FROM 4)::INTEGER), 0) FROM products));