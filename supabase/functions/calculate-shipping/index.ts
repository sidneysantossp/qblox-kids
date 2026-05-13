import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ShippingRequest {
  cep_destino: string;
  peso: number;
  comprimento: number;
  altura: number;
  largura: number;
}

interface ShippingOption {
  id: string;
  name: string;
  price: number;
  delivery_time: string;
  company: string;
  isFallback?: boolean;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get request body
    const { cep_destino, peso, comprimento, altura, largura }: ShippingRequest = await req.json();

    // Validate input
    if (!cep_destino || !peso || !comprimento || !altura || !largura) {
      return new Response(
        JSON.stringify({ error: 'Todos os campos são obrigatórios' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get Correios API key and origin CEP from settings
    const { data: settings, error: settingsError } = await supabaseClient
      .from('settings')
      .select('key, value')
      .in('key', ['correios_api_key', 'correios_cep_origem']);

    if (settingsError) {
      throw new Error(`Erro ao buscar configurações: ${settingsError.message}`);
    }

    const apiKey = settings?.find(s => s.key === 'correios_api_key')?.value;
    const cepOrigem = settings?.find(s => s.key === 'correios_cep_origem')?.value;

    if (!apiKey || !cepOrigem) {
      return new Response(
        JSON.stringify({ 
          error: 'Configurações de frete não encontradas. Configure a API Key e CEP de origem no painel admin.' 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Clean CEP (remove non-numeric characters)
    const cepOrigemLimpo = cepOrigem.replace(/\D/g, '');
    const cepDestinoLimpo = cep_destino.replace(/\D/g, '');

    // Validate CEP format
    if (cepOrigemLimpo.length !== 8 || cepDestinoLimpo.length !== 8) {
      return new Response(
        JSON.stringify({ error: 'CEP inválido. Use o formato 00000-000' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Function to check if CEP is from Greater São Paulo
    const isGreaterSaoPaulo = (cep: string): boolean => {
      const cepNum = parseInt(cep.substring(0, 5));
      
      // São Paulo capital ranges
      if ((cepNum >= 1000 && cepNum <= 5999) || (cepNum >= 8000 && cepNum <= 8499)) {
        return true;
      }
      
      // ABC Region (Santo André, São Bernardo, São Caetano, Diadema, Mauá, Ribeirão Pires, Rio Grande da Serra)
      if (cepNum >= 9000 && cepNum <= 9999) {
        return true;
      }
      
      // Guarulhos
      if (cepNum >= 7000 && cepNum <= 7299) {
        return true;
      }
      
      // Osasco
      if (cepNum >= 6000 && cepNum <= 6299) {
        return true;
      }
      
      // Barueri, Carapicuíba, Cotia, Embu das Artes, Itapecerica da Serra, Taboão da Serra
      if (cepNum >= 6300 && cepNum <= 6899) {
        return true;
      }
      
      // Mogi das Cruzes, Suzano, Poá, Ferraz de Vasconcelos, Itaquaquecetuba
      if (cepNum >= 8700 && cepNum <= 8899) {
        return true;
      }
      
      return false;
    };

    const servicos = [
      { codigo: '04014', nome: 'SEDEX' },
      { codigo: '04510', nome: 'PAC' }
    ];

    const options: ShippingOption[] = [];

    if (isGreaterSaoPaulo(cepDestinoLimpo)) {
      options.push({
        id: 'motoboy',
        name: 'Moto Boy - Entrega Full',
        price: 18.0,
        delivery_time: 'Mesmo dia',
        company: 'Moto Boy',
      });
    }

    for (const servico of servicos) {
      try {
        const correiosUrl = `https://www.correios.com.br/preco/v1/nacional/encomenda/${cepOrigemLimpo}/${cepDestinoLimpo}`;

        const response = await fetch(correiosUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            servico: servico.codigo,
            peso,
            comprimento,
            altura,
            largura,
            formato: 1,
            diametro: 0,
            maoPropria: 'N',
            valorDeclarado: 0,
            avisoRecebimento: 'N'
          })
        });

        if (response.ok) {
          const data = await response.json();

          options.push({
            id: servico.codigo,
            name: servico.nome,
            price: parseFloat(data.valor || data.preco || '0'),
            delivery_time: `${parseInt(data.prazo || data.prazoEntrega || '0')} dia(s) úteis`,
            company: 'Correios',
          });
        } else {
          const estimatedPrice = servico.codigo === '04014' ? 25.0 : 15.9;
          const estimatedDays = servico.codigo === '04014' ? 2 : 5;

          options.push({
            id: servico.codigo,
            name: servico.nome,
            price: estimatedPrice,
            delivery_time: `${estimatedDays} dia(s) úteis`,
            company: 'Correios',
            isFallback: true,
          });
        }
      } catch (error) {
        console.error(`Erro ao calcular ${servico.nome}:`, error);

        const estimatedPrice = servico.codigo === '04014' ? 25.0 : 15.9;
        const estimatedDays = servico.codigo === '04014' ? 2 : 5;

        options.push({
          id: servico.codigo,
          name: servico.nome,
          price: estimatedPrice,
          delivery_time: `${estimatedDays} dia(s) úteis`,
          company: 'Correios',
          isFallback: true,
        });
      }
    }

    options.sort((a, b) => a.price - b.price);

    return new Response(
      JSON.stringify({ options }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Erro no cálculo de frete:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Erro ao calcular frete' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
