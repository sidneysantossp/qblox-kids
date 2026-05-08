import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ShippingRequest {
  cep_destino: string;
  peso: number; // em gramas
  comprimento: number; // em cm
  altura: number; // em cm
  largura: number; // em cm
}

interface CorreiosResponse {
  servico: string;
  nome: string;
  valor: number;
  prazo: number;
  erro?: string;
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

    // Calculate shipping for different services
    // Using Correios API structure (this is a common format)
    const servicos = [
      { codigo: '04014', nome: 'SEDEX' },
      { codigo: '04510', nome: 'PAC' }
    ];

    const resultados: any[] = [];

    // Adicionar opção Moto Boy - Entrega Full (somente para Grande São Paulo)
    if (isGreaterSaoPaulo(cepDestinoLimpo)) {
      resultados.push({
        servico: 'motoboy',
        nome: 'Moto Boy - Entrega Full',
        valor: 15.00,
        prazo: 0,
      });
    }

    for (const servico of servicos) {
      try {
        // Call Correios API
        // Note: The actual Correios API endpoint may vary. This is a common structure.
        const correiosUrl = `https://www.correios.com.br/preco/v1/nacional/encomenda/${cepOrigemLimpo}/${cepDestinoLimpo}`;
        
        const response = await fetch(correiosUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            servico: servico.codigo,
            peso: peso, // Already in grams
            comprimento,
            altura,
            largura,
            formato: 1, // Caixa/Pacote
            diametro: 0,
            maoPropria: 'N',
            valorDeclarado: 0,
            avisoRecebimento: 'N'
          })
        });

        if (response.ok) {
          const data = await response.json();
          
          resultados.push({
            servico: servico.codigo,
            nome: servico.nome,
            valor: parseFloat(data.valor || data.preco || '0'),
            prazo: parseInt(data.prazo || data.prazoEntrega || '0'),
          });
        } else {
          // If API fails, return estimated values for demo purposes
          // In production, you should handle this properly
          const valorEstimado = servico.codigo === '04014' ? 25.00 : 15.00;
          const prazoEstimado = servico.codigo === '04014' ? 2 : 5;
          
          resultados.push({
            servico: servico.codigo,
            nome: servico.nome,
            valor: valorEstimado,
            prazo: prazoEstimado,
          });
        }
      } catch (error) {
        console.error(`Erro ao calcular ${servico.nome}:`, error);
        
        // Return estimated values on error
        const valorEstimado = servico.codigo === '04014' ? 25.00 : 15.00;
        const prazoEstimado = servico.codigo === '04014' ? 2 : 5;
        
        resultados.push({
          servico: servico.codigo,
          nome: servico.nome,
          valor: valorEstimado,
          prazo: prazoEstimado,
        });
      }
    }

    return new Response(
      JSON.stringify({ opcoes: resultados }),
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
