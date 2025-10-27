import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function CheckoutSuccessPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4">
      <Card className="max-w-md w-full" data-testid="card-success">
        <CardHeader className="text-center">
          {loading ? (
            <div className="flex justify-center mb-4">
              <Loader2 className="h-16 w-16 text-blue-600 dark:text-blue-400 animate-spin" />
            </div>
          ) : (
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-3">
                <CheckCircle2 className="h-16 w-16 text-green-600 dark:text-green-400" />
              </div>
            </div>
          )}
          <CardTitle className="text-2xl">
            {loading ? 'Processando Pagamento...' : 'Pagamento Confirmado!'}
          </CardTitle>
          <CardDescription>
            {loading
              ? 'Aguarde enquanto confirmamos sua assinatura'
              : 'Sua assinatura foi ativada com sucesso'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!loading && (
            <>
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <p className="text-sm text-green-800 dark:text-green-300 text-center">
                  Enviamos um e-mail de confirmação com todos os detalhes da sua assinatura.
                  Em breve você receberá as credenciais de acesso.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900 dark:text-white">Próximos Passos:</h3>
                <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <li>Verifique seu e-mail para acessar o painel</li>
                  <li>Configure sua empresa e convide colaboradores</li>
                  <li>Comece a aplicar testes psicológicos</li>
                </ol>
              </div>

              <div className="pt-4 space-y-2">
                <Button
                  data-testid="button-ir-dashboard"
                  onClick={() => navigate('/login')}
                  className="w-full"
                >
                  Ir para o Login
                </Button>
                <Button
                  data-testid="button-voltar-home"
                  variant="outline"
                  onClick={() => navigate('/')}
                  className="w-full"
                >
                  Voltar para Home
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
