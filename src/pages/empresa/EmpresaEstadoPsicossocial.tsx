import { Brain, TrendingUp, AlertCircle, CheckCircle, Activity, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function EmpresaEstadoPsicossocial() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
              <Brain className="h-8 w-8 text-blue-600" />
              Estado Psicossocial da Empresa
            </h1>
            <p className="text-muted-foreground">
              Acompanhe a saúde mental e bem-estar organizacional
            </p>
          </div>
        </div>

        {/* Cards de Indicadores */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Índice de Bem-Estar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">87%</div>
              <p className="text-xs text-muted-foreground mt-1">
                +5% em relação ao mês anterior
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Activity className="h-4 w-4 text-blue-500" />
                Nível de Estresse
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Moderado</div>
              <p className="text-xs text-muted-foreground mt-1">
                Dentro dos parâmetros aceitáveis
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-purple-500" />
                Clima Organizacional
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8.2/10</div>
              <p className="text-xs text-muted-foreground mt-1">
                Clima positivo e colaborativo
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-orange-500" />
                Áreas de Atenção
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground mt-1">
                Departamentos precisam de suporte
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Análise Detalhada */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                Riscos Psicossociais Identificados
              </CardTitle>
              <CardDescription>
                Fatores que podem impactar a saúde mental dos colaboradores
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Carga de Trabalho</span>
                  <span className="text-sm text-orange-600 font-medium">Moderado</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-orange-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Autonomia</span>
                  <span className="text-sm text-green-600 font-medium">Bom</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Suporte Social</span>
                  <span className="text-sm text-green-600 font-medium">Excelente</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Conflitos</span>
                  <span className="text-sm text-yellow-600 font-medium">Atenção</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-600" />
                Recomendações
              </CardTitle>
              <CardDescription>
                Ações sugeridas para melhorar o ambiente psicossocial
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Programas de Bem-Estar</p>
                  <p className="text-xs text-muted-foreground">
                    Implementar atividades de relaxamento e mindfulness
                  </p>
                </div>
              </div>

              <div className="flex gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <CheckCircle className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Gestão de Conflitos</p>
                  <p className="text-xs text-muted-foreground">
                    Capacitar líderes em mediação e comunicação
                  </p>
                </div>
              </div>

              <div className="flex gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Equilíbrio Trabalho-Vida</p>
                  <p className="text-xs text-muted-foreground">
                    Revisar políticas de horário flexível e home office
                  </p>
                </div>
              </div>

              <div className="flex gap-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <CheckCircle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Avaliações Regulares</p>
                  <p className="text-xs text-muted-foreground">
                    Realizar pesquisas de clima trimestral
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Aviso Informativo */}
        <Card className="border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/10">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <Activity className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  Análise em Desenvolvimento
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Esta página está em construção. Os dados apresentados são simulados para demonstração.
                  Em breve, você terá acesso a análises reais baseadas nos testes aplicados aos seus colaboradores.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
