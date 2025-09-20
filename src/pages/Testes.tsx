import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Clock, Users, Target, Heart, Zap, Shield, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const testesDisponiveis = [
  {
    id: "big-five",
    nome: "Big Five",
    descricao: "Avalia os cinco principais traços de personalidade",
    duracao: "15-20 min",
    questoes: 44,
    categoria: "Personalidade",
    icon: Brain,
    cor: "from-purple-500 to-pink-500"
  },
  {
    id: "inteligencia-emocional",
    nome: "Inteligência Emocional",
    descricao: "Mede a capacidade de reconhecer e gerenciar emoções",
    duracao: "10-15 min",
    questoes: 28,
    categoria: "Emocional",
    icon: Heart,
    cor: "from-red-500 to-orange-500"
  },
  {
    id: "estilos-aprendizagem",
    nome: "Estilos de Aprendizagem",
    descricao: "Identifica seu estilo preferido de aprendizagem",
    duracao: "8-12 min",
    questoes: 20,
    categoria: "Cognitivo",
    icon: Target,
    cor: "from-blue-500 to-cyan-500"
  },
  {
    id: "lideranca",
    nome: "Perfil de Liderança",
    descricao: "Avalia competências e estilos de liderança",
    duracao: "12-18 min",
    questoes: 32,
    categoria: "Profissional",
    icon: Users,
    cor: "from-green-500 to-emerald-500"
  },
  {
    id: "motivacao",
    nome: "Motivação e Valores",
    descricao: "Descobre seus principais motivadores",
    duracao: "10-15 min",
    questoes: 25,
    categoria: "Motivacional",
    icon: Zap,
    cor: "from-yellow-500 to-amber-500"
  },
  {
    id: "estresse",
    nome: "Gestão de Estresse",
    descricao: "Avalia níveis e estratégias de manejo do estresse",
    duracao: "8-12 min",
    questoes: 22,
    categoria: "Bem-estar",
    icon: Shield,
    cor: "from-indigo-500 to-purple-500"
  },
  {
    id: "comunicacao",
    nome: "Estilo de Comunicação",
    descricao: "Identifica seu padrão de comunicação",
    duracao: "10-15 min",  
    questoes: 30,
    categoria: "Social",
    icon: Star,
    cor: "from-teal-500 to-green-500"
  },
  {
    id: "criatividade",
    nome: "Potencial Criativo",
    descricao: "Mede capacidades e estilos criativos",
    duracao: "12-18 min",
    questoes: 26,
    categoria: "Criativo",
    icon: Brain,
    cor: "from-pink-500 to-rose-500"
  }
];

export default function Testes() {
  const navigate = useNavigate();

  const handleIniciarTeste = (testeId: string) => {
    navigate(`/teste/${testeId}/introducao`);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent">
          Testes Disponíveis
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Descubra seus traços de personalidade, competências e potencial através de nossos testes cientificamente validados
        </p>
      </div>

      {/* Grid de Testes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {testesDisponiveis.map((teste) => {
          const IconComponent = teste.icon;
          return (
            <Card 
              key={teste.id} 
              className="group hover:shadow-glow transition-all duration-300 hover:-translate-y-1 bg-gradient-card border-border/50 backdrop-blur-sm"
            >
              <CardHeader className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${teste.cor} shadow-lg`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {teste.categoria}
                  </Badge>
                </div>
                <div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {teste.nome}
                  </CardTitle>
                  <CardDescription className="text-sm mt-2">
                    {teste.descricao}
                  </CardDescription>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{teste.duracao}</span>
                  </div>
                  <span>{teste.questoes} questões</span>
                </div>
                
                <Button 
                  className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
                  onClick={() => handleIniciarTeste(teste.id)}
                >
                  Iniciar Teste
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}