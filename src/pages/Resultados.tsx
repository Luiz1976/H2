import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Calendar, ExternalLink, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Mock data - em produção virá do banco de dados
const resultadosMock = [
  {
    id: "res-001",
    testeId: "big-five",
    nomeTeste: "Big Five",
    dataRealizacao: "2024-01-15",
    categoria: "Personalidade",
    status: "Concluído",
    pontuacao: 85,
    url: "/resultado/res-001"
  },
  {
    id: "res-002", 
    testeId: "inteligencia-emocional",
    nomeTeste: "Inteligência Emocional",
    dataRealizacao: "2024-01-10",
    categoria: "Emocional",
    status: "Concluído",
    pontuacao: 78,
    url: "/resultado/res-002"
  },
  {
    id: "res-003",
    testeId: "lideranca",
    nomeTeste: "Perfil de Liderança", 
    dataRealizacao: "2024-01-05",
    categoria: "Profissional",
    status: "Concluído",
    pontuacao: 92,
    url: "/resultado/res-003"
  }
];

export default function Resultados() {
  const navigate = useNavigate();

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric'
    });
  };

  const getCorPontuacao = (pontuacao: number) => {
    if (pontuacao >= 90) return "text-success";
    if (pontuacao >= 70) return "text-warning";
    return "text-destructive";
  };

  const handleVerResultado = (url: string) => {
    navigate(url);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent">
          Meus Resultados
        </h1>
        <p className="text-xl text-muted-foreground">
          Acesse e gerencie todos os seus resultados de testes
        </p>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-primary mb-2">
              {resultadosMock.length}
            </div>
            <div className="text-sm text-muted-foreground">
              Testes Realizados
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-success mb-2">
              {Math.round(resultadosMock.reduce((acc, r) => acc + r.pontuacao, 0) / resultadosMock.length)}%
            </div>
            <div className="text-sm text-muted-foreground">
              Pontuação Média
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-warning mb-2">
              {new Set(resultadosMock.map(r => r.categoria)).size}
            </div>
            <div className="text-sm text-muted-foreground">
              Categorias Exploradas  
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Resultados */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Histórico de Testes</h2>
        
        {resultadosMock.length === 0 ? (
          <Card className="bg-gradient-card border-border/50">
            <CardContent className="p-12 text-center">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhum resultado encontrado</h3>
              <p className="text-muted-foreground mb-6">
                Você ainda não realizou nenhum teste. Que tal começar agora?
              </p>
              <Button 
                className="bg-gradient-primary hover:opacity-90"
                onClick={() => navigate('/testes')}
              >
                Fazer Primeiro Teste
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {resultadosMock.map((resultado) => (
              <Card 
                key={resultado.id}
                className="hover:shadow-glow transition-all duration-300 bg-gradient-card border-border/50"
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">
                      {resultado.nomeTeste}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatarData(resultado.dataRealizacao)}</span>
                      </div>
                      <Badge variant="secondary">
                        {resultado.categoria}
                      </Badge>
                    </CardDescription>
                  </div>
                  
                  <div className="text-right space-y-2">
                    <div className={`text-2xl font-bold ${getCorPontuacao(resultado.pontuacao)}`}>
                      {resultado.pontuacao}%
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {resultado.status}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-4">
                  <div className="flex gap-2">
                    <Button 
                      className="flex-1 bg-gradient-primary hover:opacity-90"
                      onClick={() => handleVerResultado(resultado.url)}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Ver Relatório
                    </Button>
                    <Button variant="outline" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}