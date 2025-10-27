import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, BarChart3, CheckCircle, AlertTriangle, TrendingUp, 
  Award, Loader2, ArrowRight, Sparkles, Shield, Users, Target
} from 'lucide-react';

const perguntasQuickCheck = [
  { id: 1, texto: "Sinto que a pressão no meu trabalho é constante e difícil de manejar." },
  { id: 2, texto: "Tenho dificuldades para desligar mentalmente das tarefas ao final do expediente." },
  { id: 3, texto: "Frequentemente me sinto sobrecarregado(a) com as responsabilidades profissionais." },
  { id: 4, texto: "Sinto que o meu trabalho interfere negativamente no meu descanso e sono." },
  { id: 5, texto: "Me sinto emocionalmente exaurido(a) devido às demandas profissionais." },
  { id: 6, texto: "Sinto-me frequentemente exausto(a) ao final do dia de trabalho." },
  { id: 7, texto: "Sinto que não consigo manter um equilíbrio saudável entre trabalho e vida pessoal." }
];

const opcoesResposta = [
  { valor: 1, texto: "Discordo totalmente", cor: "bg-green-500" },
  { valor: 2, texto: "Discordo", cor: "bg-lime-500" },
  { valor: 3, texto: "Neutro", cor: "bg-yellow-500" },
  { valor: 4, texto: "Concordo", cor: "bg-orange-500" },
  { valor: 5, texto: "Concordo totalmente", cor: "bg-red-500" }
];

type EstagioTeste = 'loading' | 'perguntas' | 'processando' | 'resultado' | 'conversao';

export default function QuickCheckEstresse() {
  const navigate = useNavigate();
  const [estagio, setEstagio] = useState<EstagioTeste>('loading');
  const [perguntaAtual, setPerguntaAtual] = useState(0);
  const [respostas, setRespostas] = useState<Record<number, number>>({});
  const [salvandoResposta, setSalvandoResposta] = useState(false);
  const [mostrarBotaoFinalizar, setMostrarBotaoFinalizar] = useState(false);
  const [estagioProcessamento, setEstagioProcessamento] = useState(0);
  const [progressoProcessamento, setProgressoProcessamento] = useState(0);
  const [pontuacaoTotal, setPontuacaoTotal] = useState(0);
  const [classificacao, setClassificacao] = useState('');
  const [cor, setCor] = useState('');

  const estagiosProcessamento = [
    {
      icon: Brain,
      title: "Analisando Respostas",
      description: "Processando suas respostas com inteligência artificial",
      color: "hsl(217 91% 60%)",
      duration: 1800
    },
    {
      icon: BarChart3,
      title: "Calculando Métricas",
      description: "Gerando insights personalizados para seu perfil",
      color: "hsl(142 71% 45%)",
      duration: 2000
    },
    {
      icon: Award,
      title: "Criando Relatório",
      description: "Compilando análises detalhadas e recomendações",
      color: "hsl(262 83% 58%)",
      duration: 1500
    }
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setEstagio('perguntas');
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (estagio === 'processando') {
      const timer = setTimeout(() => {
        if (estagioProcessamento < estagiosProcessamento.length - 1) {
          setEstagioProcessamento(prev => prev + 1);
          setProgressoProcessamento(0);
        } else {
          setTimeout(() => {
            calcularResultado();
            setEstagio('resultado');
          }, 1000);
        }
      }, estagiosProcessamento[estagioProcessamento].duration);

      return () => clearTimeout(timer);
    }
  }, [estagio, estagioProcessamento]);

  useEffect(() => {
    if (estagio === 'processando') {
      const progressTimer = setInterval(() => {
        setProgressoProcessamento(prev => {
          const increment = 100 / (estagiosProcessamento[estagioProcessamento].duration / 50);
          return Math.min(prev + increment, 100);
        });
      }, 50);

      return () => clearInterval(progressTimer);
    }
  }, [estagio, estagioProcessamento]);

  const handleResposta = async (valor: number) => {
    if (salvandoResposta) return;

    setSalvandoResposta(true);
    
    setRespostas(prev => ({
      ...prev,
      [perguntasQuickCheck[perguntaAtual].id]: valor
    }));

    await new Promise(resolve => setTimeout(resolve, 800));

    const isUltimaPergunta = perguntaAtual === perguntasQuickCheck.length - 1;

    if (!isUltimaPergunta) {
      await new Promise(resolve => setTimeout(resolve, 400));
      setPerguntaAtual(prev => prev + 1);
      setSalvandoResposta(false);
    } else {
      setSalvandoResposta(false);
      setMostrarBotaoFinalizar(true);
    }
  };

  const finalizarTeste = () => {
    setEstagio('processando');
    setEstagioProcessamento(0);
    setProgressoProcessamento(0);
  };

  const calcularResultado = () => {
    const valores = Object.values(respostas);
    const soma = valores.reduce((acc, val) => acc + val, 0);
    const media = soma / valores.length;
    setPontuacaoTotal(media);

    if (media <= 2.0) {
      setClassificacao('Baixo Risco');
      setCor('text-green-600');
    } else if (media <= 3.5) {
      setClassificacao('Risco Moderado');
      setCor('text-yellow-600');
    } else if (media <= 4.5) {
      setClassificacao('Alto Risco');
      setCor('text-orange-600');
    } else {
      setClassificacao('Risco Crítico');
      setCor('text-red-600');
    }
  };

  const progresso = ((perguntaAtual + 1) / perguntasQuickCheck.length) * 100;

  if (estagio === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Brain className="h-20 w-20 text-indigo-600 mx-auto" />
          </motion.div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-800">Preparando sua avaliação...</h2>
            <p className="text-gray-600">Carregando tecnologia de análise psicossocial</p>
          </div>
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-pink-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (estagio === 'processando') {
    const estagioAtual = estagiosProcessamento[estagioProcessamento];
    const IconComponent = estagioAtual.icon;

    return (
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, hsl(217 91% 60% / 0.95) 0%, hsl(234 89% 74% / 0.95) 50%, hsl(262 83% 58% / 0.95) 100%)'
        }}
      >
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full opacity-20"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
              }}
              animate={{
                y: [null, Math.random() * window.innerHeight],
                x: [null, Math.random() * window.innerWidth],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          ))}
        </div>

        <motion.div
          key={estagioProcessamento}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="relative z-10 text-center space-y-8 px-4"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <IconComponent className="h-24 w-24 text-white mx-auto drop-shadow-2xl" />
          </motion.div>

          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-white drop-shadow-lg">
              {estagioAtual.title}
            </h2>
            <p className="text-xl text-white/90 drop-shadow">
              {estagioAtual.description}
            </p>
          </div>

          <div className="w-80 mx-auto space-y-3">
            <Progress 
              value={progressoProcessamento} 
              className="h-3 bg-white/20"
            />
            <div className="flex justify-between text-sm text-white/80">
              <span>Etapa {estagioProcessamento + 1} de {estagiosProcessamento.length}</span>
              <span>{Math.round(progressoProcessamento)}%</span>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (estagio === 'resultado') {
    const porcentagemRisco = (pontuacaoTotal / 5) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-100 p-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto space-y-6"
        >
          <Card className="border-none shadow-2xl bg-white/80 backdrop-blur">
            <CardContent className="p-8 space-y-6">
              <div className="text-center space-y-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                >
                  <CheckCircle className="h-20 w-20 text-green-500 mx-auto" />
                </motion.div>
                <h1 className="text-3xl font-bold text-gray-800">Análise Concluída!</h1>
                <p className="text-gray-600">Seu nível de estresse ocupacional foi identificado</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50">
                  <CardContent className="p-6 text-center space-y-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-600">Classificação</p>
                      <p className={`text-4xl font-bold ${cor}`}>{classificacao}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">Índice de Estresse</p>
                      <div className="flex items-center justify-center gap-2">
                        <span className={`text-5xl font-bold ${cor}`}>
                          {pontuacaoTotal.toFixed(1)}
                        </span>
                        <span className="text-2xl text-gray-400">/5.0</span>
                      </div>
                    </div>
                    <Progress value={porcentagemRisco} className="h-3" />
                  </CardContent>
                </Card>

                <Card className="border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-1" />
                      <div className="space-y-2">
                        <h3 className="font-semibold text-gray-800">O que isso significa?</h3>
                        <p className="text-sm text-gray-600">
                          {pontuacaoTotal <= 2.0 && "Seu nível de estresse está controlado. Continue mantendo hábitos saudáveis."}
                          {pontuacaoTotal > 2.0 && pontuacaoTotal <= 3.5 && "Atenção: Você apresenta sinais moderados de estresse. É importante monitorar."}
                          {pontuacaoTotal > 3.5 && pontuacaoTotal <= 4.5 && "Alerta: Alto nível de estresse detectado. Recomendamos ações imediatas."}
                          {pontuacaoTotal > 4.5 && "Crítico: Nível de estresse muito elevado. Intervenção urgente recomendada."}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold text-gray-800">Esta é apenas uma prévia!</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    A avaliação completa da HumaniQ AI analisa <strong>38 dimensões psicossociais</strong>, 
                    gera relatórios profissionais em PDF, identifica riscos críticos e oferece 
                    planos de ação personalizados conforme a NR-01.
                  </p>
                  <div className="grid sm:grid-cols-3 gap-3 pt-2">
                    <div className="text-center p-3 bg-white rounded-lg">
                      <Shield className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
                      <p className="text-xs font-medium">Conformidade NR-01</p>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg">
                      <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                      <p className="text-xs font-medium">Gestão de Equipes</p>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg">
                      <Target className="h-8 w-8 text-pink-600 mx-auto mb-2" />
                      <p className="text-xs font-medium">Planos de Ação</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  size="lg"
                  onClick={() => navigate('/login')}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-lg py-6"
                  data-testid="button-acessar-plataforma"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  Acessar Avaliação Completa Agora
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate('/landing')}
                  className="flex-1 border-2 text-lg py-6"
                  data-testid="button-voltar-landing"
                >
                  Voltar à Página Inicial
                </Button>
              </div>

              <div className="text-center pt-4 border-t">
                <p className="text-xs text-gray-500">
                  ⚠️ Este é um teste demonstrativo gratuito. Os resultados não substituem avaliação profissional.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  const pergunta = perguntasQuickCheck[perguntaAtual];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6 pt-8">
        <Card className="shadow-sm border border-slate-200/60">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-slate-800">
                Quick Check - Estresse Ocupacional
              </h1>
              <Badge variant="secondary" className="text-sm">
                {perguntaAtual + 1} de {perguntasQuickCheck.length}
              </Badge>
            </div>
            <Progress value={progresso} className="h-3 bg-slate-200" />
            
            {salvandoResposta && (
              <div className="mt-4 flex items-center justify-center">
                <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm font-medium">Salvando resposta...</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <motion.div
          key={perguntaAtual}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <Card className="shadow-lg border-2 border-blue-100">
            <CardContent className="p-8">
              <div className="space-y-8">
                <div className="text-center">
                  <p className="text-xl font-medium text-slate-700 leading-relaxed">
                    {pergunta.texto}
                  </p>
                </div>

                <div className="space-y-3">
                  {opcoesResposta.map((opcao) => (
                    <Button
                      key={opcao.valor}
                      onClick={() => handleResposta(opcao.valor)}
                      disabled={salvandoResposta}
                      variant="outline"
                      className={`w-full h-auto py-4 px-6 text-left justify-start hover:scale-102 transition-all ${
                        respostas[pergunta.id] === opcao.valor
                          ? 'border-blue-500 bg-blue-50 border-2'
                          : 'border-slate-200 hover:border-blue-300'
                      }`}
                      data-testid={`button-resposta-${opcao.valor}`}
                    >
                      <div className="flex items-center gap-4 w-full">
                        <div className={`w-10 h-10 rounded-full ${opcao.cor} flex items-center justify-center text-white font-bold flex-shrink-0`}>
                          {opcao.valor}
                        </div>
                        <span className="text-base font-medium text-slate-700 flex-1">
                          {opcao.texto}
                        </span>
                        {respostas[pergunta.id] === opcao.valor && (
                          <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                        )}
                      </div>
                    </Button>
                  ))}
                </div>

                {mostrarBotaoFinalizar && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="pt-4"
                  >
                    <Button
                      onClick={finalizarTeste}
                      size="lg"
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-lg py-6"
                      data-testid="button-finalizar-teste"
                    >
                      <ArrowRight className="mr-2 h-5 w-5" />
                      Finalizar e Ver Resultado
                    </Button>
                  </motion.div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
