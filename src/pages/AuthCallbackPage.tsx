import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/db/supabase';
import { useToast } from '@/hooks/use-toast';

export default function AuthCallbackPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    let isMounted = true;

    const redirectToLoginWithError = (storedReturnUrl: string, message: string) => {
      sessionStorage.removeItem('auth_return_url');
      toast({
        title: 'Erro ao finalizar login',
        description: message,
        variant: 'destructive',
      });
      navigate('/login', { replace: true, state: { returnUrl: storedReturnUrl } });
    };

    const finalizeAuth = async () => {
      const hashParams = new URLSearchParams(location.hash.replace(/^#/, ''));
      const searchParams = new URLSearchParams(location.search);
      const storedReturnUrl = sessionStorage.getItem('auth_return_url') || '/';
      const errorDescription = hashParams.get('error_description') || searchParams.get('error_description');
      const errorCode = hashParams.get('error_code') || searchParams.get('error_code');

      if (errorDescription || errorCode) {
        redirectToLoginWithError(storedReturnUrl, decodeURIComponent(errorDescription || errorCode || 'Falha inesperada no retorno do login social.'));
        return;
      }

      try {
        const existingSession = await supabase.auth.getSession();
        if (!existingSession.data.session?.user) {
          const authCode = searchParams.get('code');
          if (authCode) {
            const { error } = await supabase.auth.exchangeCodeForSession(window.location.href);
            if (error) {
              throw error;
            }
          }
        }

        const waitForSession = async () => {
          for (let attempt = 0; attempt < 20; attempt += 1) {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
              sessionStorage.removeItem('auth_return_url');
              if (isMounted) {
                navigate(storedReturnUrl, { replace: true });
              }
              return;
            }
            await new Promise((resolve) => window.setTimeout(resolve, 150));
          }

          redirectToLoginWithError(storedReturnUrl, 'Não foi possível concluir a sessão do Google. Tente novamente. Se o erro persistir, me envie a URL completa do callback.');
        };

        await waitForSession();
      } catch (error: any) {
        console.error('Erro ao finalizar autenticação social:', error);
        redirectToLoginWithError(storedReturnUrl, error?.message || 'Não foi possível concluir o login social.');
      }
    };

    finalizeAuth();

    return () => {
      isMounted = false;
    };
  }, [location, navigate, toast]);

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B35]"></div>
        <p className="text-muted-foreground">Finalizando login...</p>
      </div>
    </div>
  );
}
