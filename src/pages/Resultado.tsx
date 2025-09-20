import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Download, Share2, RefreshCw, TrendingUp, Award, Brain } from "lucide-react";

// Mock data do resultado - em produção viria do backend baseado no ID
const resultadoMock = {
  id: "res-001",
  testeId: "big-five",
  nomeTeste: "Big Five - Traços de Personalidade",
  dataRealizacao: new Date().toISOString(),
  pontuacaoGeral: 85,
  dimensoes: [
    {
      nome: "Abertura à Experiência",
      pontuacao: 92,
      descricao: "Você demonstra alta abertura para novas experiências, criatividade e curiosidade intelectual.",
      interpretacao: "Pessoas com alta abertura tendem a ser imaginativas, criativas e abertas a novas ideias e experiências.",
      cor: "from-purple-500 to-pink-500"
    },
    {
      nome: "Conscienciosidade", 
      pontuacao: 88,
      descricao: "Você apresenta alto nível de organização, disciplina e orientação para objetivos.",
      interpretacao: "Alta conscienciosidade indica responsabilidade, organização e perseverança na realização de tarefas.",
      cor: "from-blue-500 to-cyan-500"
    },
    {
      nome: "Extroversão",
      pontuacao: 76,
      descricao: "Você tem tendência moderada-alta para interação social e busca por estimulação externa.",
      interpretacao: "Extroversão moderada-alta sugere sociabilidade equilibrada com momentos de introspecção.",
      cor: "from-green-500 to-emerald-500"
    },
    {
      nome: "Amabilidade",
      pontuacao: 84,
      descricao: "Você demonstra alta cooperação, confiança e consideração pelos outros.", 
      interpretacao: "Alta amabilidade indica tendência à cooperação, empatia e preocupação com o bem-estar alheio.",
      cor: "from-yellow-500 to-amber-500"
    },
    {
      nome: "Neuroticismo",
      pontuacao: 34,
      descricao: "Você apresenta baixo neuroticismo, indicando estabilidade emocional e resistência ao estresse.",
      interpretacao: "Baixo neuroticismo sugere estabilidade emocional, calma e resistência a situações estressantes.",
      cor: "from-red-500 to-orange-500"
    }
  ],
  recomendacoes: [
    "Continue explorando novas áreas de conhecimento e experiências criativas",
    "Use sua organização natural para liderar projetos importantes",
    "Equilibre momentos sociais com tempo de reflexão pessoal",
    "Canalize sua empatia para contribuir positivamente em equipes",
    "Sua estabilidade emocional é uma grande força - use-a para apoiar outros"
  ],
  insights: [
    "Seu perfil indica excelente potencial para liderança criativa",
    "Você tem habilidades naturais para trabalho em equipe",
    "Sua estabilidade emocional é um diferencial competitivo importante"
  ]
};

export default function Resultado() {
  const { resultadoId } = useParams();
  const navigate = useNavigate();

  // Em produção, carregaria os dados do backend baseado no resultadoId
  const resultado = resultadoMock;

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCorPontuacao = (pontuacao: number) => {
    if (pontuacao >= 80) return "text-success";
    if (pontuacao >= 60) return "text-warning";
    return "text-destructive";
  };

  const getInterpretacaoPontuacao = (pontuacao: number) => {
    if (pontuacao >= 90) return "Muito Alto";
    if (pontuacao >= 80) return "Alto";
    if (pontuacao >= 60) return "Moderado";
    if (pontuacao >= 40) return "Baixo";
    return "Muito Baixo";
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate('/resultados')}
          className="p-0 h-auto font-normal hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Todos os Resultados
        </Button>
        
        <div className="text-center space-y-4">
          <Badge className="bg-gradient-primary">Resultado Completo</Badge>
          <h1 className="text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            {resultado.nomeTeste}
          </h1>
          <p className="text-muted-foreground">
            Realizado em {formatarData(resultado.dataRealizacao)}
          </p>
        </div>
      </div>

      {/* Pontuação Geral */}
      <Card className="bg-gradient-card border-border/50">
        <CardHeader className="text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-gradient-primary flex items-center justify-center mb-4">
            <Award className="h-8 w-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-3xl">
            Pontuação Geral: <span className={getCorPontuacao(resultado.pontuacaoGeral)}>
              {resultado.pontuacaoGeral}%
            </span>
          </CardTitle>
          <CardDescription className="text-lg">
            {getInterpretacaoPontuacao(resultado.pontuacaoGeral)} - Resultado muito positivo
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Análise por Dimensões */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Brain className="h-6 w-6 text-primary" />
          Análise Detalhada por Dimensões
        </h2>
        
        <div className="grid gap-6">
          {resultado.dimensoes.map((dimensao, index) => (
            <Card key={index} className="bg-gradient-card border-border/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{dimensao.nome}</CardTitle>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${getCorPontuacao(dimensao.pontuacao)}`}>
                      {dimensao.pontuacao}%
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {getInterpretacaoPontuacao(dimensao.pontuacao)}
                    </Badge>
                  </div>
                </div>
                <Progress value={dimensao.pontuacao} className="h-3" />
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-foreground">{dimensao.descricao}</p>
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">
                    <strong>Interpretação:</strong> {dimensao.interpretacao}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Insights e Recomendações */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Principais Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {resultado.insights.map((insight, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs font-medium flex items-center justify-center mt-0.5 shrink-0">
                  {index + 1}
                </div>
                <p className="text-sm">{insight}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              Recomendações de Desenvolvimento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {resultado.recomendacoes.map((recomendacao, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
                <p className="text-sm">{recomendacao}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Ações */}
      <Card className="bg-gradient-card border-border/50">
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-4 justify-center">
            <Button className="bg-gradient-primary hover:opacity-90">
              <Download className="h-4 w-4 mr-2" />
              Baixar Relatório PDF
            </Button>
            <Button variant="outline">
              <Share2 className="h-4 w-4 mr-2" />
              Compartilhar Resultado
            </Button>
            <Button variant="outline" onClick={() => navigate('/testes')}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Fazer Outro Teste
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <div className="text-center text-sm text-muted-foreground bg-muted/30 p-4 rounded-lg">
        <p>
          <strong>Importante:</strong> Este resultado é baseado em suas respostas no momento do teste. 
          A personalidade pode evoluir ao longo do tempo. Para interpretações profissionais, 
          consulte um psicólogo qualificado.
        </p>
      </div>
    </div>
  );
}