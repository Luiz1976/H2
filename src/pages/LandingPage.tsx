import { useState, useEffect } from 'react';
import { 
  Shield, CheckCircle, TrendingUp, Users, FileCheck, Brain, Zap, 
  Award, Clock, AlertTriangle, BarChart3, Sparkles, Target, Star,
  ChevronRight, Download, Play, ArrowRight, Check, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link, useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState('rh');
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header Fixo */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-white/95 backdrop-blur-lg shadow-lg' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-indigo-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                HumaniQ AI
              </span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <button onClick={() => scrollToSection('solucao')} className="text-gray-700 hover:text-indigo-600 transition-colors">
                Solução
              </button>
              <button onClick={() => scrollToSection('modulos')} className="text-gray-700 hover:text-indigo-600 transition-colors">
                Módulos
              </button>
              <button onClick={() => scrollToSection('depoimentos')} className="text-gray-700 hover:text-indigo-600 transition-colors">
                Casos de Sucesso
              </button>
              <button onClick={() => scrollToSection('preco')} className="text-gray-700 hover:text-indigo-600 transition-colors">
                ROI
              </button>
            </nav>
            <div className="flex space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/login')}
                data-testid="button-login"
              >
                Entrar
              </Button>
              <Button 
                onClick={() => scrollToSection('cta')} 
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                data-testid="button-diagnostico-header"
              >
                Diagnóstico Gratuito
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* SEÇÃO 1: HERO */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-amber-100 text-amber-800 border-amber-200 px-4 py-2 text-sm font-medium" data-testid="badge-prazo">
              ⚠️ Prazo NR-01: Fiscalização ativa a partir de 25/05/2026
            </Badge>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Sua empresa está <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">protegida</span> contra os riscos psicossociais?
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
              A partir de maio de 2026, mapear e controlar riscos psicossociais será obrigatório. 
              Empresas sem evidências documentadas enfrentarão <strong className="text-red-600">multas de até R$ 6.708</strong> e 
              passivos trabalhistas que podem ultrapassar <strong className="text-red-600">R$ 100 mil</strong> por caso.
            </p>

            <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 p-6 mb-8 rounded-lg" data-testid="card-estatistica">
              <div className="flex items-start">
                <AlertTriangle className="h-6 w-6 text-red-600 mt-1 mr-3 flex-shrink-0" />
                <div className="text-left">
                  <p className="text-lg font-semibold text-gray-900 mb-2">
                    Dado Alarmante que Exige Sua Atenção Agora
                  </p>
                  <p className="text-gray-700">
                    <strong className="text-2xl text-red-600">472 mil afastamentos</strong> por transtornos mentais foram registrados no Brasil em 2024 — 
                    um aumento de <strong>68% em relação a 2023</strong>.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => scrollToSection('diagnostico')}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-lg px-8 py-6 shadow-xl hover:shadow-2xl transition-all"
                data-testid="button-diagnostico-hero"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Faça seu Diagnóstico Gratuito em 5 Minutos
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => scrollToSection('demo')}
                className="text-lg px-8 py-6 border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50"
                data-testid="button-demo"
              >
                <Play className="mr-2 h-5 w-5" />
                Ver Demonstração
              </Button>
            </div>

            <p className="text-sm text-gray-500 mt-4">
              ✓ Sem custo ✓ Sem cartão de crédito ✓ Resultado imediato
            </p>
          </div>
        </div>
      </section>

      {/* SEÇÃO 2: O PROBLEMA (DOR) */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              O custo invisível que está <span className="text-red-600">consumindo sua empresa</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Enquanto você lê esta página, colaboradores da sua organização podem estar enfrentando:
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="border-2 border-red-100 hover:border-red-300 transition-all">
              <CardContent className="pt-6">
                <div className="flex items-start mb-4">
                  <div className="bg-red-100 p-3 rounded-lg mr-4">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Riscos que Você Não Vê</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start">
                        <X className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                        Sobrecarga de trabalho e prazos irreais
                      </li>
                      <li className="flex items-start">
                        <X className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                        Assédio moral e conflitos não resolvidos
                      </li>
                      <li className="flex items-start">
                        <X className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                        Metas abusivas sem suporte adequado
                      </li>
                      <li className="flex items-start">
                        <X className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                        Jornadas excessivas sem previsibilidade
                      </li>
                      <li className="flex items-start">
                        <X className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                        Falta de apoio em momentos críticos
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-orange-100 hover:border-orange-300 transition-all">
              <CardContent className="pt-6">
                <div className="flex items-start mb-4">
                  <div className="bg-orange-100 p-3 rounded-lg mr-4">
                    <TrendingUp className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Impacto Financeiro Real</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start">
                        <span className="text-orange-600 font-bold mr-2">R$ 12-20k</span>
                        por colaborador afastado
                      </li>
                      <li className="flex items-start">
                        <span className="text-orange-600 font-bold mr-2">20-50%</span>
                        do salário anual por turnover
                      </li>
                      <li className="flex items-start">
                        <span className="text-orange-600 font-bold mr-2">até 30%</span>
                        de perda de produtividade
                      </li>
                      <li className="flex items-start">
                        <span className="text-orange-600 font-bold mr-2">+R$ 100k</span>
                        em indenizações por caso
                      </li>
                      <li className="flex items-start">
                        <span className="text-orange-600 font-bold mr-2">+134%</span>
                        em afastamentos em 2 anos
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-2xl p-8 text-center">
            <p className="text-2xl font-semibold mb-2">
              O Brasil está entre os países mais estressados do mundo
            </p>
            <p className="text-lg text-gray-300">
              54% da população reporta alta preocupação com saúde mental
            </p>
          </div>
        </div>
      </section>

      {/* SEÇÃO 3: MUDANÇA REGULATÓRIA (URGÊNCIA) */}
      <section id="urgencia" className="py-20 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-red-600 text-white px-4 py-2" data-testid="badge-nr01">
              🚨 NOVA EXIGÊNCIA NR-01
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              O que mudou na NR-01 — e por que sua empresa precisa agir <span className="text-red-600">agora</span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <div className="bg-white rounded-2xl p-8 shadow-xl">
                <h3 className="text-2xl font-bold mb-6 text-gray-900">A NR-01 agora exige que você:</h3>
                <ul className="space-y-4">
                  {[
                    'Identifique os fatores de risco psicossociais',
                    'Avalie a intensidade e frequência desses riscos',
                    'Mensure o impacto na saúde dos colaboradores',
                    'Controle com planos de ação documentados',
                    'Monitore continuamente a evolução'
                  ].map((item, index) => (
                    <li key={index} className="flex items-start" data-testid={`requirement-${index}`}>
                      <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-lg">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <div className="bg-gradient-to-br from-red-600 to-red-700 text-white rounded-2xl p-8 shadow-xl mb-6">
                <h3 className="text-2xl font-bold mb-6">Linha do Tempo Crítica</h3>
                <div className="space-y-6">
                  <div className="border-l-4 border-white/30 pl-6">
                    <p className="font-semibold text-lg">Hoje</p>
                    <p className="text-red-100">Fase educativa — momento ideal para implementar</p>
                  </div>
                  <div className="border-l-4 border-yellow-300 pl-6">
                    <p className="font-semibold text-lg">Até 25/05/2026</p>
                    <p className="text-red-100">Período de adaptação — construa evidências</p>
                  </div>
                  <div className="border-l-4 border-red-300 pl-6">
                    <p className="font-semibold text-lg">Após 26/05/2026</p>
                    <p className="text-red-100 font-bold">Fiscalização ativa + Multas de R$ 1.799 a R$ 6.708</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h4 className="font-bold text-lg mb-3 text-gray-900">Consequências para quem não cumprir:</h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                    Multas entre R$ 1.799,39 e R$ 6.708,08
                  </li>
                  <li className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                    Notificações via eSocial (automático)
                  </li>
                  <li className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                    Ações trabalhistas com dano moral coletivo
                  </li>
                  <li className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                    Possibilidade de Ação Civil Pública (ACP)
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-12 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl p-8 text-center">
            <p className="text-xl md:text-2xl font-semibold mb-4">
              ⚠️ Empresas que começarem apenas em maio de 2026 estarão <strong>12 meses atrasadas</strong> na construção de evidências
            </p>
            <p className="text-lg text-indigo-100">
              Auditores avaliarão o histórico completo de ações, não apenas a situação presente. 
              Com a HumaniQ AI, você constrói esse histórico automaticamente desde o primeiro dia.
            </p>
          </div>
        </div>
      </section>

      {/* SEÇÃO 5: SOLUÇÃO COMPLETA */}
      <section id="solucao" className="py-20 bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] -z-0" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 px-6 py-3 text-base font-bold" data-testid="badge-solucao">
              🎯 SOLUÇÃO 360° COMPLETA
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              HumaniQ AI: A Plataforma Completa para Gestão de Riscos Psicossociais
            </h2>
            <p className="text-xl md:text-2xl text-indigo-200 max-w-4xl mx-auto">
              A única solução integrada que entrega tudo o que a NR-01 exige — do mapeamento online à capacitação de lideranças — 
              em um sistema totalmente automatizado e auditável.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <p className="text-center text-2xl font-semibold mb-2">
              Não é apenas software.
            </p>
            <p className="text-center text-3xl font-bold text-transparent bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text">
              É todo o ecossistema de conformidade psicossocial.
            </p>
          </div>
        </div>
      </section>

      {/* SEÇÃO 6: MÓDULOS DA PLATAFORMA */}
      <section id="modulos" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              9 Módulos Integrados. Uma Solução Completa.
            </h2>
            <p className="text-xl text-gray-600">
              Tudo que você precisa para estar 100% em conformidade com a NR-01
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                titulo: 'Mapeamento Online Automatizado',
                descricao: 'Avaliação digital de riscos com alertas protegidos por sigilo. 100% online, resultados em tempo real.',
                beneficio: 'Elimina planilhas manuais e processos lentos'
              },
              {
                icon: Shield,
                titulo: 'Avaliação Individual com Sigilo',
                descricao: 'Testes psicométricos validados com proteção LGPD. Dados individuais nunca expostos.',
                beneficio: 'Identificação precoce com ética e legalidade'
              },
              {
                icon: BarChart3,
                titulo: 'Dashboard de Saúde Psicossocial',
                descricao: 'Score de maturidade, mapa de calor por setor, comparação com benchmarks setoriais.',
                beneficio: 'Diretoria visualiza tudo em 30 segundos'
              },
              {
                icon: FileCheck,
                titulo: 'Relatórios Automáticos',
                descricao: 'Relatórios gerenciais, para auditoria e PGR específico NR-01. Exportação em PDF profissional.',
                beneficio: 'Entregue ao auditor exatamente o que ele precisa'
              },
              {
                icon: Award,
                titulo: 'Relatório PGR Específico NR-01',
                descricao: 'Documento técnico formatado conforme MTE, alinhado com ISO 45003, seções obrigatórias incluídas.',
                beneficio: 'Seu PGR fica completo e em conformidade'
              },
              {
                icon: Brain,
                titulo: 'Propostas de Ação Inteligentes',
                descricao: 'IA analisa dados e sugere intervenções personalizadas com responsáveis e prazos definidos.',
                beneficio: 'Do diagnóstico à ação sem consultoria externa'
              },
              {
                icon: TrendingUp,
                titulo: 'Melhoria Contínua',
                descricao: 'Sistema PDCA, sugestões de políticas internas, benchmarks e alertas proativos.',
                beneficio: 'A plataforma orienta evolução constante'
              },
              {
                icon: Users,
                titulo: 'Treinamento EAD para Lideranças',
                descricao: 'Curso completo sobre gestão de riscos psicossociais com certificação digital.',
                beneficio: 'Líderes capacitados = ambientes saudáveis'
              },
              {
                icon: Clock,
                titulo: 'Histórico Auditável Completo',
                descricao: 'Registro de todas as ações, quem acessou, quando, logs completos.',
                beneficio: 'Proteção jurídica total. Você prova tudo'
              }
            ].map((modulo, index) => (
              <Card key={index} className="hover:shadow-2xl transition-all hover:-translate-y-1 border-2 border-gray-100 hover:border-indigo-300" data-testid={`card-modulo-${index}`}>
                <CardContent className="pt-6">
                  <div className="bg-gradient-to-br from-indigo-500 to-purple-600 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                    <modulo.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900">{modulo.titulo}</h3>
                  <p className="text-gray-600 mb-4">{modulo.descricao}</p>
                  <div className="bg-indigo-50 p-3 rounded-lg border-l-4 border-indigo-500">
                    <p className="text-sm font-semibold text-indigo-900">
                      <Sparkles className="inline h-4 w-4 mr-1" />
                      {modulo.beneficio}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO 7: BENEFÍCIOS POR PÚBLICO */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Benefícios para Cada Área da Sua Empresa
            </h2>
            <p className="text-xl text-gray-600">
              Uma solução que atende todos os stakeholders
            </p>
          </div>

          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-full p-2 shadow-lg inline-flex gap-2">
              {[
                { id: 'rh', label: 'RH' },
                { id: 'juridico', label: 'Jurídico' },
                { id: 'diretoria', label: 'Diretoria' },
                { id: 'compliance', label: 'Compliance' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 rounded-full font-semibold transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  data-testid={`tab-${tab.id}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-xl">
            {activeTab === 'rh' && (
              <div data-testid="content-rh">
                <h3 className="text-2xl font-bold mb-6 text-indigo-600">Para o RH</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    'Diagnóstico preciso do clima organizacional',
                    'Identificação precoce de áreas críticas',
                    'Planos de ação inteligentes e personalizados',
                    'Acompanhamento da evolução em tempo real',
                    'Redução de turnover e absenteísmo'
                  ].map((item, index) => (
                    <div key={index} className="flex items-start">
                      <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-lg">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'juridico' && (
              <div data-testid="content-juridico">
                <h3 className="text-2xl font-bold mb-6 text-indigo-600">Para o Jurídico</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    'Evidências documentadas para defesa em processos',
                    'Relatórios probatórios com rastreabilidade completa',
                    'Conformidade com NR-01 e ISO 45003',
                    'Histórico de ações preventivas e corretivas',
                    'Proteção contra dano moral coletivo'
                  ].map((item, index) => (
                    <div key={index} className="flex items-start">
                      <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-lg">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'diretoria' && (
              <div data-testid="content-diretoria">
                <h3 className="text-2xl font-bold mb-6 text-indigo-600">Para a Diretoria</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    'ROI claro: economia em afastamentos e turnover',
                    'Reputação fortalecida (ESG e Employer Branding)',
                    'Dashboard executivo com indicadores estratégicos',
                    'Redução de passivos trabalhistas',
                    'Score de maturidade organizacional'
                  ].map((item, index) => (
                    <div key={index} className="flex items-start">
                      <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-lg">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'compliance' && (
              <div data-testid="content-compliance">
                <h3 className="text-2xl font-bold mb-6 text-indigo-600">Para Compliance e SESMT</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    'Integração automática com PGR e GRO',
                    'Relatórios prontos para fiscalização do MTE',
                    'Atendimento às orientações técnicas oficiais',
                    'Logs de auditoria completos',
                    'Capacitação contínua de lideranças'
                  ].map((item, index) => (
                    <div key={index} className="flex items-start">
                      <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-lg">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SEÇÃO 10: PROVA SOCIAL */}
      <section id="depoimentos" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Empresas que já transformaram sua gestão de riscos
            </h2>
            <div className="flex justify-center items-center gap-2 text-yellow-500">
              {[1,2,3,4,5].map(i => <Star key={i} className="h-6 w-6 fill-current" />)}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                depoimento: "A HumaniQ AI entregou tudo: o mapeamento, os relatórios para o PGR e ainda capacitou nossas lideranças. Reduzimos 23% dos riscos críticos em 90 dias.",
                autor: "Gestora de RH",
                empresa: "Indústria Alimentícia",
                colaboradores: "450 colaboradores"
              },
              {
                depoimento: "Quando o auditor pediu evidências sobre riscos psicossociais, abri a plataforma e exportei o relatório PGR em 2 minutos. Ele ficou impressionado com o nível de detalhamento.",
                autor: "Coordenador SESMT",
                empresa: "Logística",
                colaboradores: "1.200 colaboradores"
              },
              {
                depoimento: "O treinamento EAD para líderes foi fundamental. Eles agora sabem identificar sinais de sobrecarga e agir preventivamente. Nosso clima melhorou 40% em 6 meses.",
                autor: "Diretor de Pessoas",
                empresa: "Varejo",
                colaboradores: "800 colaboradores"
              }
            ].map((item, index) => (
              <Card key={index} className="border-2 border-gray-100 hover:border-indigo-300 hover:shadow-xl transition-all" data-testid={`card-depoimento-${index}`}>
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[1,2,3,4,5].map(i => <Star key={i} className="h-5 w-5 fill-current text-yellow-500" />)}
                  </div>
                  <p className="text-gray-700 mb-6 italic">"{item.depoimento}"</p>
                  <div className="border-t pt-4">
                    <p className="font-semibold text-gray-900">{item.autor}</p>
                    <p className="text-sm text-gray-600">{item.empresa} | {item.colaboradores}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO 11: ROI E ECONOMIA */}
      <section id="preco" className="py-20 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Quanto sua empresa pode <span className="text-green-600">economizar</span> com a HumaniQ AI?
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="bg-white rounded-2xl p-8 shadow-xl">
              <h3 className="text-2xl font-bold text-red-600 mb-6">Cenário Atual (sem gestão completa)</h3>
              <div className="space-y-4">
                {[
                  { item: '5 afastamentos/ano × R$ 15.000', valor: 'R$ 75.000' },
                  { item: '3 turnover/ano × R$ 25.000', valor: 'R$ 75.000' },
                  { item: '1 ação trabalhista × R$ 120.000', valor: 'R$ 120.000' },
                  { item: 'Consultoria para PGR × R$ 30.000', valor: 'R$ 30.000' },
                  { item: 'Treinamentos externos × R$ 20.000', valor: 'R$ 20.000' },
                  { item: 'Perda de produtividade estimada', valor: 'R$ 80.000' }
                ].map((item, index) => (
                  <div key={index} className="flex justify-between items-center pb-3 border-b">
                    <span className="text-gray-700">{item.item}</span>
                    <span className="font-bold text-red-600">{item.valor}</span>
                  </div>
                ))}
                <div className="bg-red-100 p-4 rounded-lg mt-6">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Total de custos evitáveis:</span>
                    <span className="text-3xl font-bold text-red-600">R$ 400.000/ano</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-600 to-emerald-600 text-white rounded-2xl p-8 shadow-xl">
              <h3 className="text-2xl font-bold mb-6">Com HumaniQ AI (Plataforma Completa)</h3>
              <div className="space-y-6">
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
                  <p className="text-lg mb-2">Investimento Anual</p>
                  <p className="text-5xl font-bold">R$ 29.900</p>
                  <p className="text-green-200 mt-2">Tudo incluído. Sem custos extras.</p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
                  <p className="text-lg mb-2">Economia Potencial</p>
                  <p className="text-5xl font-bold">R$ 370.000/ano</p>
                </div>

                <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 p-6 rounded-xl">
                  <p className="text-lg mb-2 font-semibold">Retorno sobre Investimento</p>
                  <p className="text-6xl font-bold">1.238%</p>
                  <p className="text-gray-800 mt-2 font-medium">Para cada R$ 1 investido, você economiza R$ 12,38</p>
                </div>

                <div className="text-center pt-4">
                  <Button 
                    size="lg" 
                    onClick={() => scrollToSection('diagnostico')}
                    className="bg-white text-green-600 hover:bg-gray-100 text-lg px-8 py-6 shadow-xl"
                    data-testid="button-diagnostico-roi"
                  >
                    Comece Seu Diagnóstico Gratuito
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 14: CTA FINAL */}
      <section id="diagnostico" className="py-20 bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Comece Hoje. Proteja Sua Empresa Amanhã.
          </h2>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-white/20">
            <div className="flex items-center justify-center mb-6">
              <Sparkles className="h-12 w-12 text-yellow-400" />
            </div>
            <h3 className="text-3xl font-bold mb-6">Diagnóstico Gratuito Completo + Demo da Plataforma</h3>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white/10 p-6 rounded-xl">
                <h4 className="font-bold text-xl mb-4">O que você recebe sem custo:</h4>
                <ul className="space-y-3 text-left">
                  {[
                    'Avaliação de até 20 colaboradores',
                    'Mapa de risco psicossocial instantâneo',
                    'Página de Nível de Saúde da sua empresa',
                    'Relatório de maturidade organizacional',
                    'Demonstração ao vivo de todos os módulos',
                    'Consultoria inicial com especialista em SST'
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gradient-to-br from-yellow-400 to-orange-400 text-gray-900 p-6 rounded-xl flex flex-col justify-center">
                <p className="text-2xl font-bold mb-4">Sem Riscos. Sem Complicações.</p>
                <ul className="space-y-2 text-left">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 mr-2" />
                    Sem cartão de crédito
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 mr-2" />
                    Sem compromisso
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 mr-2" />
                    Sem complicação
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Button 
              size="lg" 
              onClick={() => navigate('/login')}
              className="bg-white text-indigo-600 hover:bg-gray-100 text-xl px-12 py-8 shadow-2xl hover:shadow-3xl transition-all"
              data-testid="button-diagnostico-final"
            >
              <Sparkles className="mr-2 h-6 w-6" />
              Iniciar Diagnóstico Gratuito Agora
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="bg-transparent border-2 border-white text-white hover:bg-white/10 text-xl px-12 py-8"
              data-testid="button-demo-final"
            >
              <Play className="mr-2 h-6 w-6" />
              Agendar Demonstração Personalizada
            </Button>
          </div>

          <p className="text-indigo-200 text-lg">
            Junte-se a centenas de empresas que já estão protegidas
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Brain className="h-8 w-8 text-indigo-400" />
                <span className="text-xl font-bold text-white">HumaniQ AI</span>
              </div>
              <p className="text-sm">
                Plataforma completa para gestão de riscos psicossociais em conformidade com a NR-01.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Produto</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => scrollToSection('modulos')} className="hover:text-white">Módulos</button></li>
                <li><button onClick={() => scrollToSection('preco')} className="hover:text-white">Preços</button></li>
                <li><button onClick={() => scrollToSection('depoimentos')} className="hover:text-white">Casos de Sucesso</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Sobre Nós</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Contato</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Termos de Uso</a></li>
                <li><a href="#" className="hover:text-white">Política de Privacidade</a></li>
                <li><a href="#" className="hover:text-white">LGPD</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2025 HumaniQ AI. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}