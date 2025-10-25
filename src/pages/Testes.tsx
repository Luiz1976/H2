import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Clock, FileText, Brain, Heart, Users, Shield, AlertTriangle, Star, Lock, CheckCircle2, Loader2, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { infoTesteClimaOrganizacional } from "@/lib/testes/clima-organizacional";
import { infoTesteKarasekSiegrist } from "@/lib/testes/karasek-siegrist";
import { infoTesteEstresseOcupacional } from "@/lib/testes/estresse-ocupacional";
import { infoTesteClimaBemEstar } from "@/lib/testes/clima-bem-estar";
import { infoTesteMaturidadeRiscosPsicossociais } from "@/lib/testes/maturidade-riscos-psicossociais";
import { configPercepacaoAssedio } from "@/lib/testes/percepcao-assedio";
import { configQualidadeVidaTrabalho } from "@/lib/testes/qualidade-vida-trabalho";
import { obterInfoTesteRPO } from "@/lib/testes/riscos-psicossociais-ocupacionais";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface TesteDisponibilidade {
  id: string;
  nome: string;
  descricao: string;
  categoria: string;
  tempoEstimado: number;
  instrucoes: string;
  ativo: boolean;
  disponivel: boolean;
  motivo: string | null;
  proximaDisponibilidade: string | null;
  dataConclusao: string | null;
  pontuacao: number | null;
  periodicidadeDias: number | null;
}

export default function Testes() {
  const navigate = useNavigate();
  const infoRPO = obterInfoTesteRPO();
  
  const [testes, setTestes] = useState<TesteDisponibilidade[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    carregarTestesDisponiveis();
  }, []);

  const carregarTestesDisponiveis = async () => {
    try {
      setCarregando(true);
      setErro(null);

      const token = localStorage.getItem('authToken');
      const user = localStorage.getItem('currentUser');
      
      if (!token || !user) {
        // Se não está logado como colaborador, mostrar testes estáticos
        setCarregando(false);
        return;
      }

      const userData = JSON.parse(user);
      if (userData.role !== 'colaborador') {
        // Se não é colaborador, mostrar testes estáticos
        setCarregando(false);
        return;
      }

      const response = await fetch('/api/teste-disponibilidade/colaborador/testes', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao carregar testes');
      }

      const data = await response.json();
      setTestes(data.testes || []);
    } catch (error) {
      console.error('Erro ao carregar testes:', error);
      setErro('Erro ao carregar testes disponíveis');
      toast.error('Erro ao carregar testes disponíveis');
    } finally {
      setCarregando(false);
    }
  };

  const getTesteInfo = (nome: string) => {
    const nomeNorm = nome.toLowerCase();
    if (nomeNorm.includes('clima organizacional')) return infoTesteClimaOrganizacional;
    if (nomeNorm.includes('karasek') || nomeNorm.includes('siegrist')) return infoTesteKarasekSiegrist;
    if (nomeNorm.includes('estresse ocupacional')) return infoTesteEstresseOcupacional;
    if (nomeNorm.includes('clima e bem-estar')) return infoTesteClimaBemEstar;
    if (nomeNorm.includes('maturidade')) return infoTesteMaturidadeRiscosPsicossociais;
    if (nomeNorm.includes('assédio')) return configPercepacaoAssedio;
    if (nomeNorm.includes('qualidade de vida')) return configQualidadeVidaTrabalho;
    if (nomeNorm.includes('rpo') || nomeNorm.includes('riscos psicossociais')) return infoRPO;
    return null;
  };

  const getMotivoTexto = (motivo: string | null, proximaDisponibilidade: string | null) => {
    if (motivo === 'teste_concluido') {
      return 'Teste já concluído';
    } else if (motivo === 'bloqueado_empresa') {
      return 'Bloqueado pela empresa';
    } else if (motivo === 'aguardando_periodicidade' && proximaDisponibilidade) {
      const data = new Date(proximaDisponibilidade);
      return `Disponível em ${format(data, "dd 'de' MMMM", { locale: ptBR })}`;
    }
    return 'Indisponível';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Testes Disponíveis
        </h1>
        <p className="text-xl text-gray-700 dark:text-gray-200 max-w-3xl mx-auto">
          Descubra seus traços de personalidade, competências e potencial através de nossos testes cientificamente validados
        </p>
      </div>

      {/* Grid de Testes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {/* Teste de Clima Organizacional */}
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col p-6">
          <CardHeader className="space-y-6 p-0">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center shadow-sm">
                <Building2 className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="text-center space-y-3">
              <div className="flex justify-center">
                <Badge variant="outline" className="text-xs text-blue-600 border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800">
                  {infoTesteClimaOrganizacional.categoria}
                </Badge>
              </div>
              <CardTitle className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
                {infoTesteClimaOrganizacional.nome}
              </CardTitle>
              <CardDescription className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed px-2">
                {infoTesteClimaOrganizacional.descricao}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 flex-1 flex flex-col justify-end p-0 mt-6">
            <div className="flex justify-center gap-6 text-sm text-gray-700 dark:text-gray-300">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{infoTesteClimaOrganizacional.duracao}</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>{infoTesteClimaOrganizacional.questoes} questões</span>
              </div>
            </div>
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 font-medium transition-colors duration-200"
              onClick={() => navigate('/teste/clima-organizacional')}
            >
              Iniciar Teste
            </Button>
          </CardContent>
        </Card>

        {/* Teste Karasek-Siegrist */}
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col p-6">
          <CardHeader className="space-y-6 p-0">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-purple-500 flex items-center justify-center shadow-sm">
                <Brain className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="text-center space-y-3">
              <div className="flex justify-center">
                <Badge variant="outline" className="text-xs text-purple-600 border-purple-200 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800">
                  {infoTesteKarasekSiegrist.categoria}
                </Badge>
              </div>
              <CardTitle className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
                {infoTesteKarasekSiegrist.nome}
              </CardTitle>
              <CardDescription className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed px-2">
                {infoTesteKarasekSiegrist.descricao}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 flex-1 flex flex-col justify-end p-0 mt-6">
            <div className="flex justify-center gap-6 text-sm text-gray-700 dark:text-gray-300">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{infoTesteKarasekSiegrist.duracao}</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>{infoTesteKarasekSiegrist.questoes} questões</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              <Badge variant="outline" className="text-xs text-gray-600 border-gray-200 bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600">
                OMS
              </Badge>
              <Badge variant="outline" className="text-xs text-gray-600 border-gray-200 bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600">
                OIT
              </Badge>
            </div>
            <Button 
              className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-xl py-3 font-medium transition-colors duration-200"
              onClick={() => navigate('/teste/karasek-siegrist')}
            >
              Iniciar Teste
            </Button>
          </CardContent>
        </Card>

        {/* Teste de Estresse Ocupacional */}
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col p-6">
          <CardHeader className="space-y-6 p-0">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center shadow-sm">
                <Heart className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="text-center space-y-3">
              <div className="flex justify-center">
                <Badge variant="outline" className="text-xs text-blue-600 border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800">
                  {infoTesteEstresseOcupacional.categoria}
                </Badge>
              </div>
              <CardTitle className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
                {infoTesteEstresseOcupacional.nome}
              </CardTitle>
              <CardDescription className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed px-2">
                {infoTesteEstresseOcupacional.descricao}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 flex-1 flex flex-col justify-end p-0 mt-6">
            <div className="flex justify-center gap-6 text-sm text-gray-700 dark:text-gray-300">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{infoTesteEstresseOcupacional.duracao}</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>{infoTesteEstresseOcupacional.questoes} questões</span>
              </div>
            </div>
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 font-medium transition-colors duration-200"
              onClick={() => navigate('/teste/estresse-ocupacional')}
            >
              Iniciar Teste
            </Button>
          </CardContent>
        </Card>

        {/* Teste HumaniQ Insight - Clima Organizacional e Bem-Estar Psicológico */}
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col p-6">
          <CardHeader className="space-y-6 p-0">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center shadow-sm">
                <Users className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="text-center space-y-3">
              <div className="flex justify-center">
                <Badge variant="outline" className="text-xs text-green-600 border-green-200 bg-green-50 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
                  {infoTesteClimaBemEstar.categoria}
                </Badge>
              </div>
              <CardTitle className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
                {infoTesteClimaBemEstar.nome}
              </CardTitle>
              <CardDescription className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed px-2">
                {infoTesteClimaBemEstar.descricao}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 flex-1 flex flex-col justify-end p-0 mt-6">
            <div className="flex justify-center gap-6 text-sm text-gray-700 dark:text-gray-300">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{infoTesteClimaBemEstar.duracao}</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>{infoTesteClimaBemEstar.questoes} questões</span>
              </div>
            </div>
            <Button 
              className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl py-3 font-medium transition-colors duration-200"
              onClick={() => navigate('/teste/clima-bem-estar')}
            >
              Iniciar Teste
            </Button>
          </CardContent>
        </Card>

        {/* Teste HumaniQ MGRP - Maturidade em Gestão de Riscos Psicossociais */}
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col p-6">
          <CardHeader className="space-y-6 p-0">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center shadow-sm">
                <Shield className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="text-center space-y-3">
              <div className="flex justify-center">
                <Badge variant="outline" className="text-xs text-orange-600 border-orange-200 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800">
                  {infoTesteMaturidadeRiscosPsicossociais.categoria}
                </Badge>
              </div>
              <CardTitle className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
                {infoTesteMaturidadeRiscosPsicossociais.nome}
              </CardTitle>
              <CardDescription className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed px-2">
                {infoTesteMaturidadeRiscosPsicossociais.descricao}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 flex-1 flex flex-col justify-end p-0 mt-6">
            <div className="flex justify-center gap-6 text-sm text-gray-700 dark:text-gray-300">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{infoTesteMaturidadeRiscosPsicossociais.duracao}</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>{infoTesteMaturidadeRiscosPsicossociais.questoes} questões</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              <Badge variant="outline" className="text-xs text-gray-600 border-gray-200 bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600">
                Organizacional
              </Badge>
              <Badge variant="outline" className="text-xs text-gray-600 border-gray-200 bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600">
                Gestão
              </Badge>
            </div>
            <Button 
              className="w-full bg-orange-600 hover:bg-orange-700 text-white rounded-xl py-3 font-medium transition-colors duration-200"
              onClick={() => navigate('/teste/maturidade-riscos-psicossociais')}
            >
              Iniciar Teste
            </Button>
          </CardContent>
        </Card>

        {/* Teste HumaniQ PAS - Percepção de Assédio Moral e Sexual */}
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col p-6">
          <CardHeader className="space-y-6 p-0">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center shadow-sm">
                <AlertTriangle className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="text-center space-y-3">
              <div className="flex justify-center">
                <Badge variant="outline" className="text-xs text-red-600 border-red-200 bg-red-50 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800">
                  {configPercepacaoAssedio.categoria}
                </Badge>
              </div>
              <CardTitle className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
                {configPercepacaoAssedio.nome}
              </CardTitle>
              <CardDescription className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed px-2">
                {configPercepacaoAssedio.descricao}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 flex-1 flex flex-col justify-end p-0 mt-6">
            <div className="flex justify-center gap-6 text-sm text-gray-700 dark:text-gray-300">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{configPercepacaoAssedio.tempoEstimado}</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>48 questões</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              <Badge variant="outline" className="text-xs text-gray-600 border-gray-200 bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600">
                Proteção
              </Badge>
              <Badge variant="outline" className="text-xs text-gray-600 border-gray-200 bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600">
                Assédio
              </Badge>
            </div>
            <Button 
              className="w-full bg-red-600 hover:bg-red-700 text-white rounded-xl py-3 font-medium transition-colors duration-200"
              onClick={() => navigate('/teste/percepcao-assedio')}
            >
              Iniciar Avaliação
            </Button>
          </CardContent>
        </Card>

        {/* Teste HumaniQ QVT - Qualidade de Vida no Trabalho */}
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col p-6">
          <CardHeader className="space-y-6 p-0">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-yellow-500 flex items-center justify-center shadow-sm">
                <Star className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="text-center space-y-3">
              <div className="flex justify-center">
                <Badge variant="outline" className="text-xs text-yellow-600 border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800">
                  {configQualidadeVidaTrabalho.categoria}
                </Badge>
              </div>
              <CardTitle className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
                {configQualidadeVidaTrabalho.nome}
              </CardTitle>
              <CardDescription className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed px-2">
                {configQualidadeVidaTrabalho.descricao}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 flex-1 flex flex-col justify-end p-0 mt-6">
            <div className="flex justify-center gap-6 text-sm text-gray-700 dark:text-gray-300">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{configQualidadeVidaTrabalho.tempoEstimado}</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>{configQualidadeVidaTrabalho.numeroPerguntas} questões</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              <Badge variant="outline" className="text-xs text-gray-600 border-gray-200 bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600">
                Qualidade
              </Badge>
              <Badge variant="outline" className="text-xs text-gray-600 border-gray-200 bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600">
                Bem-estar
              </Badge>
            </div>
            <Button 
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-white rounded-xl py-3 font-medium transition-colors duration-200"
              onClick={() => navigate('/teste/qualidade-vida-trabalho')}
            >
              Iniciar Teste
            </Button>
          </CardContent>
        </Card>

        {/* Teste HumaniQ RPO - Riscos Psicossociais Ocupacionais */}
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col p-6">
          <CardHeader className="space-y-6 p-0">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-indigo-500 flex items-center justify-center shadow-sm">
                <Shield className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="text-center space-y-3">
              <div className="flex justify-center">
                <Badge variant="outline" className="text-xs text-indigo-600 border-indigo-200 bg-indigo-50 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-800">
                  {infoRPO.categoria}
                </Badge>
              </div>
              <CardTitle className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
                {infoRPO.nome}
              </CardTitle>
              <CardDescription className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed px-2">
                {infoRPO.descricao}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 flex-1 flex flex-col justify-end p-0 mt-6">
            <div className="flex justify-center gap-6 text-sm text-gray-700 dark:text-gray-300">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{infoRPO.tempoEstimado}</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>{infoRPO.numeroPerguntas} questões</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              <Badge variant="outline" className="text-xs text-gray-600 border-gray-200 bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600">
                Riscos
              </Badge>
              <Badge variant="outline" className="text-xs text-gray-600 border-gray-200 bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600">
                Psicossociais
              </Badge>
            </div>
            <Button 
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-3 font-medium transition-colors duration-200"
              onClick={() => navigate('/teste/riscos-psicossociais-ocupacionais')}
            >
              Iniciar Teste
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Informações Adicionais */}
      <div className="text-center space-y-4">
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm">
          <CardContent className="p-8">
            <h3 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-100">Sobre Nossos Testes</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-600 dark:text-gray-300">
              <div className="space-y-3 p-4 rounded-lg bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50">
                <div className="font-semibold text-gray-800 dark:text-gray-100 text-base">Cientificamente Validados</div>
                <p className="leading-relaxed">Baseados em pesquisas e modelos científicos reconhecidos</p>
              </div>
              <div className="space-y-3 p-4 rounded-lg bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50">
                <div className="font-semibold text-gray-800 dark:text-gray-100 text-base">Resultados Detalhados</div>
                <p className="leading-relaxed">Análises completas com interpretações e recomendações</p>
              </div>
              <div className="space-y-3 p-4 rounded-lg bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50">
                <div className="font-semibold text-gray-800 dark:text-gray-100 text-base">Confidencialidade</div>
                <p className="leading-relaxed">Seus dados são protegidos e mantidos em sigilo</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}