import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data das perguntas - em produção viria do backend baseado no teste
const perguntasMock = {
  "big-five": [
    {
      id: 1,
      texto: "Eu me vejo como alguém que é original, com novas ideias",
      categoria: "Abertura",
      escala: ["Discordo totalmente", "Discordo", "Neutro", "Concordo", "Concordo totalmente"]
    },
    {
      id: 2,
      texto: "Eu me vejo como alguém que faz um trabalho completo",
      categoria: "Conscienciosidade",
      escala: ["Discordo totalmente", "Discordo", "Neutro", "Concordo", "Concordo totalmente"]
    },
    {
      id: 3,
      texto: "Eu me vejo como alguém que é falante, comunicativo",
      categoria: "Extroversão",
      escala: ["Discordo totalmente", "Discordo", "Neutro", "Concordo", "Concordo totalmente"]
    },
    {
      id: 4,
      texto: "Eu me vejo como alguém que é prestativo e não egoísta com os outros",
      categoria: "Amabilidade", 
      escala: ["Discordo totalmente", "Discordo", "Neutro", "Concordo", "Concordo totalmente"]
    },
    {
      id: 5,
      texto: "Eu me vejo como alguém que se preocupa muito",
      categoria: "Neuroticismo",
      escala: ["Discordo totalmente", "Discordo", "Neutro", "Concordo", "Concordo totalmente"]
    }
  ],
  "inteligencia-emocional": [
    {
      id: 1,
      texto: "Eu consigo identificar facilmente minhas emoções quando elas surgem",
      categoria: "Autoconsciência",
      escala: ["Nunca", "Raramente", "Às vezes", "Frequentemente", "Sempre"]
    },
    {
      id: 2,
      texto: "Eu consigo controlar minhas emoções quando necessário",
      categoria: "Autorregulação",
      escala: ["Nunca", "Raramente", "Às vezes", "Frequentemente", "Sempre"]
    },
    {
      id: 3,
      texto: "Eu percebo facilmente as emoções das outras pessoas",
      categoria: "Empatia",
      escala: ["Nunca", "Raramente", "Às vezes", "Frequentemente", "Sempre"]
    }
  ]
};

export default function TestePerguntas() {
  const { testeId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const perguntas = perguntasMock[testeId as keyof typeof perguntasMock] || [];
  const [perguntaAtual, setPerguntaAtual] = useState(0);
  const [respostas, setRespostas] = useState<Record<number, number>>({});
  
  if (!perguntas.length) {
    return (
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold text-destructive">Teste não encontrado</h1>
        <Button onClick={() => navigate('/testes')}>
          Voltar aos Testes
        </Button>
      </div>
    );
  }

  const pergunta = perguntas[perguntaAtual];
  const progresso = ((perguntaAtual + 1) / perguntas.length) * 100;
  const jaRespondeu = respostas[pergunta.id] !== undefined;
  const isUltimaPergunta = perguntaAtual === perguntas.length - 1;

  const handleResposta = (valor: number) => {
    setRespostas(prev => ({ ...prev, [pergunta.id]: valor }));
  };

  const handleProxima = () => {
    if (!jaRespondeu) {
      toast({
        title: "Resposta obrigatória",
        description: "Por favor, selecione uma resposta antes de continuar.",
        variant: "destructive"
      });
      return;
    }

    if (isUltimaPergunta) {
      handleFinalizarTeste();
    } else {
      setPerguntaAtual(prev => prev + 1);
    }
  };

  const handleAnterior = () => {
    if (perguntaAtual > 0) {
      setPerguntaAtual(prev => prev - 1);
    }
  };

  const handleFinalizarTeste = () => {
    // Em produção, aqui seria feita a chamada para o backend para processar as respostas
    const resultadoId = `res-${Date.now()}`;
    navigate(`/resultado/${resultadoId}`);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate(`/teste/${testeId}/introducao`)}
          className="p-0 h-auto font-normal hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Voltar à Introdução
        </Button>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Pergunta {perguntaAtual + 1} de {perguntas.length}</span>
            <span>{Math.round(progresso)}% concluído</span>
          </div>
          <Progress value={progresso} className="h-2" />
        </div>
      </div>

      {/* Pergunta */}
      <Card className="bg-gradient-card border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">
              {pergunta.texto}
            </CardTitle>
            {jaRespondeu && (
              <CheckCircle className="h-6 w-6 text-success" />
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            Categoria: {pergunta.categoria}
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="grid gap-3">
            {pergunta.escala.map((opcao, index) => (
              <Button
                key={index}
                variant={respostas[pergunta.id] === index + 1 ? "default" : "outline"}
                className={`justify-start text-left h-auto p-4 ${
                  respostas[pergunta.id] === index + 1 
                    ? "bg-gradient-primary text-primary-foreground" 
                    : "hover:bg-accent"
                }`}
                onClick={() => handleResposta(index + 1)}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    respostas[pergunta.id] === index + 1
                      ? "border-primary-foreground bg-primary-foreground text-primary"
                      : "border-muted-foreground"
                  }`}>
                    {respostas[pergunta.id] === index + 1 && (
                      <div className="w-3 h-3 rounded-full bg-primary" />
                    )}
                  </div>
                  <span className="flex-1">{opcao}</span>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Navegação */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handleAnterior}
          disabled={perguntaAtual === 0}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Anterior
        </Button>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {Object.keys(respostas).length} de {perguntas.length} respondidas
        </div>

        <Button
          className="bg-gradient-primary hover:opacity-90"
          onClick={handleProxima}
        >
          {isUltimaPergunta ? (
            <>
              Finalizar Teste
              <CheckCircle className="h-4 w-4 ml-2" />
            </>
          ) : (
            <>
              Próxima
              <ArrowRight className="h-4 w-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}