// Trilha de Capacitação - Liderança e Saúde Psicossocial - Conforme NR01

export interface Modulo {
  id: number;
  titulo: string;
  duracao: string;
  conteudo: string[];
}

export interface Curso {
  id: number;
  slug: string;
  titulo: string;
  subtitulo: string;
  descricao: string;
  duracao: string;
  nivel: "Iniciante" | "Intermediário" | "Avançado";
  categoria: string;
  icone: string;
  cor: string;
  corBadge: string;
  objetivo: string;
  resultadosEsperados: string[];
  modulos: Modulo[];
  atividadesPraticas?: string[];
  integracaoPGR?: string[];
}

export const cursos: Curso[] = [
  {
    id: 1,
    slug: "fundamentos-legais-riscos-psicossociais",
    titulo: "Fundamentos Legais e Técnicos dos Riscos Psicossociais",
    subtitulo: "Base Legal e Técnica para Gestão Preventiva",
    descricao: "Compreenda o contexto legal, técnico e organizacional da gestão dos riscos psicossociais no ambiente de trabalho, conforme NR01.",
    duracao: "4h",
    nivel: "Intermediário",
    categoria: "Compliance & Legal",
    icone: "⚖️",
    cor: "from-blue-600 to-cyan-600",
    corBadge: "bg-blue-100 text-blue-700 border-blue-200",
    objetivo: "Capacitar os líderes para compreender o contexto legal, técnico e organizacional da gestão dos riscos psicossociais no ambiente de trabalho.",
    resultadosEsperados: [
      "Líderes conscientes da base legal e suas responsabilidades",
      "Capacidade de identificar riscos psicossociais no dia a dia",
      "Integração prática com o PGR (Programa de Gerenciamento de Riscos)",
      "Compreensão dos impactos organizacionais e financeiros"
    ],
    modulos: [
      {
        id: 1,
        titulo: "Introdução à NR01 e ao PGR",
        duracao: "60 min",
        conteudo: [
          "O que são riscos ocupacionais e psicossociais: definições e classificações",
          "Estrutura completa da NR01: histórico, atualizações e aplicação prática",
          "Objetivo central do PGR e sua relação com as demais Normas Regulamentadoras",
          "Por que a saúde psicossocial tornou-se obrigatória no Brasil",
          "Casos reais de empresas penalizadas por negligência"
        ]
      },
      {
        id: 2,
        titulo: "Responsabilidades da Liderança",
        duracao: "60 min",
        conteudo: [
          "Obrigações legais: o que a lei exige de você como gestor",
          "Papel preventivo do líder: identificação precoce de sinais de risco",
          "Identificação de comportamentos críticos: isolamento, queda de produtividade, conflitos",
          "Como documentar e reportar situações de risco adequadamente",
          "Responsabilidade civil e criminal em casos de omissão"
        ]
      },
      {
        id: 3,
        titulo: "Integração com Outras Normas e Leis",
        duracao: "60 min",
        conteudo: [
          "NR07 (PCMSO): exames médicos e monitoramento da saúde mental",
          "NR17 (Ergonomia): ergonomia cognitiva e organizacional do trabalho",
          "Lei 14.457/22: políticas de prevenção ao assédio e proteção às vítimas",
          "CLT e direitos trabalhistas relacionados à saúde mental",
          "Como garantir conformidade integral em sua área"
        ]
      },
      {
        id: 4,
        titulo: "Impactos Organizacionais",
        duracao: "60 min",
        conteudo: [
          "Custos reais do adoecimento mental: afastamentos, turnover, indenizações",
          "Impacto na produtividade, clima e imagem organizacional",
          "Benefícios financeiros e estratégicos da gestão preventiva",
          "ROI (Retorno sobre Investimento) em programas de saúde psicossocial",
          "Cases de sucesso: empresas que transformaram sua cultura"
        ]
      }
    ],
    integracaoPGR: [
      "Atuação preventiva conforme NR01 – Gestão de Riscos Ocupacionais",
      "Identificação e comunicação de fatores de riscos psicossociais",
      "Promoção de ambiente saudável, ético e seguro",
      "Fortalecimento da cultura de prevenção contínua"
    ]
  },
  {
    id: 2,
    slug: "inteligencia-emocional-lideranca",
    titulo: "Inteligência Emocional Aplicada à Liderança",
    subtitulo: "Autoconsciência, Empatia e Autorregulação",
    descricao: "Desenvolva autoconsciência, empatia e autorregulação emocional, essenciais para uma liderança equilibrada e humana.",
    duracao: "3h",
    nivel: "Intermediário",
    categoria: "Desenvolvimento Pessoal",
    icone: "🧠",
    cor: "from-purple-600 to-pink-600",
    corBadge: "bg-purple-100 text-purple-700 border-purple-200",
    objetivo: "Desenvolver autoconsciência, empatia e autorregulação emocional, essenciais para uma liderança equilibrada e humana.",
    resultadosEsperados: [
      "Redução de reações impulsivas e decisões baseadas em emoções negativas",
      "Melhoria significativa do clima organizacional",
      "Aumento do engajamento e confiança da equipe",
      "Maior capacidade de lidar com pressão e conflitos"
    ],
    modulos: [
      {
        id: 1,
        titulo: "O que é Inteligência Emocional e Sua Importância na Liderança",
        duracao: "45 min",
        conteudo: [
          "Os 5 pilares da Inteligência Emocional segundo Daniel Goleman",
          "Por que líderes emocionalmente inteligentes são mais eficazes",
          "Autoconsciência: conhecer suas próprias emoções e gatilhos",
          "Autogestão: controlar impulsos e manter a serenidade",
          "Como a IE impacta diretamente resultados e clima da equipe"
        ]
      },
      {
        id: 2,
        titulo: "Reconhecimento de Emoções e Gatilhos",
        duracao: "45 min",
        conteudo: [
          "Mapeamento dos seus gatilhos emocionais: o que te tira do equilíbrio?",
          "Técnicas de autorreflexão e journaling emocional",
          "Identificando padrões de comportamento sob pressão",
          "Como pausar antes de reagir: a regra dos 90 segundos",
          "Exercício prático: diário emocional de 7 dias"
        ]
      },
      {
        id: 3,
        titulo: "Empatia e Percepção Social",
        duracao: "45 min",
        conteudo: [
          "Empatia cognitiva vs. empatia emocional: qual usar em cada situação",
          "Leitura de sinais não-verbais: linguagem corporal e microexpressões",
          "Como se colocar genuinamente no lugar do outro",
          "Escuta ativa: ouvir para compreender, não para responder",
          "Desenvolvendo sensibilidade social no ambiente de trabalho"
        ]
      },
      {
        id: 4,
        titulo: "Tomada de Decisão Equilibrada e Gestão de Conflitos",
        duracao: "45 min",
        conteudo: [
          "Como separar emoção de razão em decisões críticas",
          "Técnicas de regulação emocional: respiração, pausa estratégica, reenquadramento",
          "Gerenciando conflitos sem escalar tensões",
          "Transformando feedback negativo em oportunidade de crescimento",
          "Exercício: simulação de situação de alta pressão"
        ]
      }
    ],
    atividadesPraticas: [
      "Teste de perfil emocional (autoavaliação estruturada)",
      "Simulações de feedback empático com role-playing",
      "Exercícios de respiração e ancoragem emocional",
      "Criação de plano pessoal de desenvolvimento emocional"
    ]
  },
  {
    id: 3,
    slug: "comunicacao-nao-violenta",
    titulo: "Comunicação Não Violenta (CNV)",
    subtitulo: "Diálogo Construtivo e Escuta Ativa",
    descricao: "Aprimorar a comunicação assertiva, a escuta ativa e o diálogo construtivo através da metodologia CNV de Marshall Rosenberg.",
    duracao: "3h",
    nivel: "Intermediário",
    categoria: "Soft Skills",
    icone: "💬",
    cor: "from-green-600 to-teal-600",
    corBadge: "bg-green-100 text-green-700 border-green-200",
    objetivo: "Aprimorar a comunicação assertiva, a escuta ativa e o diálogo construtivo através da metodologia CNV.",
    resultadosEsperados: [
      "Redução significativa de conflitos interpessoais",
      "Aumento da segurança psicológica nas equipes",
      "Fortalecimento da cultura de respeito e empatia",
      "Melhoria na qualidade dos feedbacks e conversas difíceis"
    ],
    modulos: [
      {
        id: 1,
        titulo: "Conceitos e Pilares da CNV",
        duracao: "45 min",
        conteudo: [
          "Os 4 pilares da CNV: Observação, Sentimento, Necessidade e Pedido",
          "Diferença entre observação e julgamento: evitando acusações",
          "Como identificar e expressar sentimentos sem culpar",
          "Necessidades humanas universais: conexão, autonomia, significado",
          "Formulando pedidos claros e específicos, não exigências"
        ]
      },
      {
        id: 2,
        titulo: "Barreiras à Comunicação Empática",
        duracao: "45 min",
        conteudo: [
          "Julgamentos, críticas e rótulos: como eles bloqueiam a conexão",
          "Comparações que geram competição e ressentimento",
          "Negação de responsabilidade: 'eu tive que fazer'",
          "Exigências disfarçadas de pedidos",
          "Exercício: identificando barreiras em diálogos reais"
        ]
      },
      {
        id: 3,
        titulo: "Técnicas de Feedback Construtivo",
        duracao: "45 min",
        conteudo: [
          "Estrutura do feedback não-violento: fatos, impacto, pedido",
          "Como dar feedback negativo sem desmotivar",
          "Recebendo feedback com abertura e sem defensividade",
          "Transformando críticas em oportunidades de diálogo",
          "Prática: role-playing de feedback difícil"
        ]
      },
      {
        id: 4,
        titulo: "Resolução de Conflitos com Escuta Ativa",
        duracao: "45 min",
        conteudo: [
          "Escuta empática: ouvir além das palavras",
          "Validação emocional: reconhecer sem concordar",
          "Mediação de conflitos usando CNV",
          "Como encontrar soluções que atendam necessidades mútuas",
          "Exercícios práticos de CNV em situações de trabalho"
        ]
      }
    ],
    atividadesPraticas: [
      "Análise de diálogos problemáticos e reestruturação com CNV",
      "Simulações de conversas difíceis em duplas",
      "Exercícios de autoempatia e regulação emocional",
      "Criação de scripts de CNV para situações reais do dia a dia"
    ]
  },
  {
    id: 4,
    slug: "gestao-riscos-psicossociais",
    titulo: "Gestão de Riscos Psicossociais e Saúde Mental",
    subtitulo: "Identificação, Avaliação e Ação",
    descricao: "Identificar, avaliar e agir sobre fatores de risco psicossociais, conforme diretrizes da NR01, NR17 e OMS.",
    duracao: "4h",
    nivel: "Avançado",
    categoria: "Gestão de Riscos",
    icone: "🎯",
    cor: "from-red-600 to-orange-600",
    corBadge: "bg-red-100 text-red-700 border-red-200",
    objetivo: "Identificar, avaliar e agir sobre fatores de risco psicossociais, conforme as diretrizes da NR01, NR17 e OMS.",
    resultadosEsperados: [
      "Mapeamento proativo de fatores críticos de risco",
      "Implementação de ações de prevenção e monitoramento eficazes",
      "Redução de adoecimento mental e rotatividade",
      "Criação de planos de ação integrados ao PGR"
    ],
    modulos: [
      {
        id: 1,
        titulo: "Conceitos e Tipos de Riscos Psicossociais",
        duracao: "60 min",
        conteudo: [
          "Definição técnica de riscos psicossociais segundo OMS e OIT",
          "Principais fatores: sobrecarga, insegurança, falta de autonomia, conflitos",
          "Diferença entre estresse positivo (eustress) e negativo (distress)",
          "Burnout: sintomas, causas e consequências organizacionais",
          "Assédio moral e sexual: identificação e impactos"
        ]
      },
      {
        id: 2,
        titulo: "Ferramentas de Diagnóstico e Avaliação",
        duracao: "60 min",
        conteudo: [
          "Questionários validados: Karasek-Siegrist, OMS-5, escala de burnout",
          "Entrevistas individuais e grupos focais: como conduzir com segurança",
          "Observação comportamental: sinais de alerta na equipe",
          "Análise de indicadores: absenteísmo, turnover, acidentes, produtividade",
          "Como interpretar dados e priorizar ações"
        ]
      },
      {
        id: 3,
        titulo: "Planos de Ação Preventiva e Corretiva",
        duracao: "60 min",
        conteudo: [
          "Hierarquia de controles: eliminação, redução, controle administrativo",
          "Intervenções organizacionais: redesenho de processos, redistribuição de carga",
          "Intervenções individuais: apoio psicológico, treinamentos, pausas",
          "Monitoramento contínuo: como medir eficácia das ações",
          "Ciclo PDCA aplicado à saúde psicossocial"
        ]
      },
      {
        id: 4,
        titulo: "Integração dos Resultados ao PGR",
        duracao: "60 min",
        conteudo: [
          "Como documentar riscos psicossociais no PGR",
          "Comunicação de riscos para alta gestão e equipes",
          "Elaboração de relatórios técnicos e executivos",
          "Acompanhamento de metas e indicadores de saúde mental",
          "Auditorias e conformidade legal"
        ]
      }
    ]
  },
  {
    id: 5,
    slug: "desenvolvimento-humano-comunicacao",
    titulo: "Desenvolvimento Humano e Comunicação",
    subtitulo: "Empatia, Colaboração e Clima Positivo",
    descricao: "Fortalecer competências emocionais e relacionais que reduzam comportamentos de risco e melhorem o clima organizacional.",
    duracao: "3h",
    nivel: "Iniciante",
    categoria: "Desenvolvimento Pessoal",
    icone: "🤝",
    cor: "from-indigo-600 to-purple-600",
    corBadge: "bg-indigo-100 text-indigo-700 border-indigo-200",
    objetivo: "Fortalecer competências emocionais e relacionais que reduzam comportamentos de risco e melhorem o clima organizacional.",
    resultadosEsperados: [
      "Líderes mais empáticos e colaborativos",
      "Menor incidência de conflitos interpessoais",
      "Melhoria significativa na integração de equipes",
      "Aumento da confiança mútua e segurança psicológica"
    ],
    modulos: [
      {
        id: 1,
        titulo: "Autoconhecimento e Empatia",
        duracao: "45 min",
        conteudo: [
          "Conhecendo seus valores, crenças e padrões comportamentais",
          "Ferramentas de autoavaliação: DISC, MBTI, Big Five",
          "Desenvolvendo empatia genuína: sair da própria perspectiva",
          "Como a empatia reduz conflitos e aumenta colaboração",
          "Exercício: mapeamento de perfil pessoal"
        ]
      },
      {
        id: 2,
        titulo: "Relações Interpessoais Positivas",
        duracao: "45 min",
        conteudo: [
          "Construindo vínculos saudáveis no ambiente de trabalho",
          "Reciprocidade e confiança: pilares das boas relações",
          "Como lidar com personalidades difíceis sem perder a conexão",
          "Gerenciando expectativas e limites interpessoais",
          "Prática: dinâmica de aproximação e rapport"
        ]
      },
      {
        id: 3,
        titulo: "Comunicação Clara e Respeitosa",
        duracao: "45 min",
        conteudo: [
          "Assertividade: dizer não sem culpa, pedir sem medo",
          "Evitando mal-entendidos: clareza, objetividade e confirmação",
          "Comunicação inclusiva: linguagem que acolhe e respeita",
          "Feedback contínuo como ferramenta de crescimento",
          "Exercício: conversas assertivas simuladas"
        ]
      },
      {
        id: 4,
        titulo: "Trabalho em Equipe e Confiança Mútua",
        duracao: "45 min",
        conteudo: [
          "Características de equipes de alta performance",
          "Como construir segurança psicológica: vulnerabilidade e abertura",
          "Resolução colaborativa de problemas",
          "Celebrando conquistas e aprendendo com erros em conjunto",
          "Dinâmica: desafio em equipe"
        ]
      }
    ],
    atividadesPraticas: [
      "Teste de perfil comportamental",
      "Dinâmicas de integração e confiança",
      "Role-playing de situações de conflito",
      "Construção de plano de desenvolvimento interpessoal"
    ]
  },
  {
    id: 6,
    slug: "compliance-etica-assedio",
    titulo: "Compliance, Ética e Assédio Moral/Sexual",
    subtitulo: "Conduta Ética e Responsabilidade Legal",
    descricao: "Orientar líderes sobre condutas éticas, responsabilidades legais e mecanismos de prevenção a assédios no ambiente de trabalho.",
    duracao: "4h",
    nivel: "Avançado",
    categoria: "Compliance & Legal",
    icone: "🛡️",
    cor: "from-gray-700 to-gray-900",
    corBadge: "bg-gray-100 text-gray-700 border-gray-200",
    objetivo: "Orientar líderes sobre condutas éticas, responsabilidades legais e mecanismos de prevenção a assédios.",
    resultadosEsperados: [
      "Redução drástica de ocorrências de assédio",
      "Cumprimento integral de obrigações legais",
      "Fortalecimento da imagem e reputação institucional",
      "Cultura ética sólida e transparente"
    ],
    modulos: [
      {
        id: 1,
        titulo: "Fundamentos de Ética e Compliance Comportamental",
        duracao: "60 min",
        conteudo: [
          "O que é ética organizacional e por que ela importa",
          "Compliance comportamental: além do financeiro",
          "Código de conduta: como implementar e fiscalizar",
          "Dilemas éticos comuns no ambiente corporativo",
          "Como tomar decisões éticas sob pressão"
        ]
      },
      {
        id: 2,
        titulo: "Legislação Vigente: NR01, Lei 14.457/22 e CLT",
        duracao: "60 min",
        conteudo: [
          "NR01 e a obrigatoriedade de prevenção ao assédio",
          "Lei 14.457/22: políticas de prevenção e canais de denúncia",
          "CLT e direitos trabalhistas relacionados à dignidade",
          "Responsabilidade civil e criminal de líderes e empresas",
          "Jurisprudência recente: casos reais e lições aprendidas"
        ]
      },
      {
        id: 3,
        titulo: "Identificação e Prevenção de Assédio Moral e Sexual",
        duracao: "60 min",
        conteudo: [
          "Assédio moral: humilhações, isolamento, sabotagem, desqualificação",
          "Assédio sexual: avanços indesejados, comentários, chantagem sexual",
          "Como identificar sinais de assédio na equipe",
          "Protocolos de acolhimento e investigação de denúncias",
          "Medidas disciplinares e correção de comportamentos"
        ]
      },
      {
        id: 4,
        titulo: "Canais de Denúncia e Papel do Líder",
        duracao: "60 min",
        conteudo: [
          "Estrutura de canais de denúncia: anonimato, confidencialidade, segurança",
          "Proteção à vítima: evitando retaliação e revitimização",
          "Papel do líder como exemplo e guardião da cultura ética",
          "Como lidar com denúncias envolvendo colegas próximos",
          "Criação de ambiente seguro para falar sobre problemas"
        ]
      }
    ]
  },
  {
    id: 7,
    slug: "etica-assedio-conduta",
    titulo: "Ética, Assédio e Conduta Organizacional",
    subtitulo: "Prevenção e Cultura de Respeito",
    descricao: "Prevenir e lidar com comportamentos inadequados, reforçando o respeito, a justiça organizacional e a inclusão.",
    duracao: "3h",
    nivel: "Intermediário",
    categoria: "Compliance & Legal",
    icone: "⚡",
    cor: "from-yellow-600 to-orange-600",
    corBadge: "bg-yellow-100 text-yellow-700 border-yellow-200",
    objetivo: "Prevenir e lidar com comportamentos inadequados, reforçando o respeito e a justiça organizacional.",
    resultadosEsperados: [
      "Cultura organizacional mais segura, justa e inclusiva",
      "Melhoria da percepção de justiça e confiança",
      "Redução significativa de riscos reputacionais",
      "Ambiente de trabalho verdadeiramente respeitoso"
    ],
    modulos: [
      {
        id: 1,
        titulo: "Conceitos de Ética e Integridade Corporativa",
        duracao: "45 min",
        conteudo: [
          "Ética profissional: princípios universais e valores organizacionais",
          "Integridade: alinhamento entre discurso e prática",
          "Como construir reputação ética sustentável",
          "Conflitos de interesse: identificação e gestão",
          "Casos de violação ética e suas consequências"
        ]
      },
      {
        id: 2,
        titulo: "Tipos de Assédio e Suas Consequências",
        duracao: "45 min",
        conteudo: [
          "Assédio moral organizacional, interpessoal e institucional",
          "Assédio sexual: quid pro quo e ambiente hostil",
          "Cyberbullying e assédio digital no trabalho remoto",
          "Consequências para vítimas: saúde mental, produtividade, carreira",
          "Impactos organizacionais: clima, imagem, processos judiciais"
        ]
      },
      {
        id: 3,
        titulo: "Ambientes Inclusivos e Respeitosos",
        duracao: "45 min",
        conteudo: [
          "Diversidade como valor estratégico e social",
          "Equidade vs. igualdade: tratamentos justos e diferenciados",
          "Pertencimento: todos se sentem parte integral do grupo?",
          "Linguagem inclusiva e comportamentos respeitosos",
          "Microagressões: identificar e corrigir sutilezas prejudiciais"
        ]
      },
      {
        id: 4,
        titulo: "Estratégias de Promoção de Equidade e Pertencimento",
        duracao: "45 min",
        conteudo: [
          "Políticas afirmativas: cotas, mentorias, grupos de afinidade",
          "Treinamentos de viés inconsciente para líderes",
          "Criação de espaços seguros para diálogo aberto",
          "Celebração da diversidade: eventos, comunicação, reconhecimento",
          "Monitoramento de métricas de diversidade e inclusão"
        ]
      }
    ],
    atividadesPraticas: [
      "Análise de casos reais de assédio",
      "Discussões em grupo sobre dilemas éticos",
      "Criação de protocolo de resposta a denúncias",
      "Elaboração de código de conduta personalizado"
    ]
  },
  {
    id: 8,
    slug: "gestao-estresse-qualidade-vida",
    titulo: "Gestão do Estresse e Qualidade de Vida no Trabalho",
    subtitulo: "Autocuidado, Equilíbrio e Bem-estar",
    descricao: "Promover autocuidado, equilíbrio e bem-estar emocional de líderes e equipes através de técnicas práticas e sustentáveis.",
    duracao: "3h",
    nivel: "Iniciante",
    categoria: "Bem-estar",
    icone: "🌱",
    cor: "from-emerald-600 to-green-600",
    corBadge: "bg-emerald-100 text-emerald-700 border-emerald-200",
    objetivo: "Promover autocuidado, equilíbrio e bem-estar emocional de líderes e equipes.",
    resultadosEsperados: [
      "Redução significativa do estresse e do absenteísmo",
      "Aumento da produtividade saudável e sustentável",
      "Equilíbrio emocional e satisfação no trabalho",
      "Melhoria na qualidade de vida pessoal e profissional"
    ],
    modulos: [
      {
        id: 1,
        titulo: "Fatores de Estresse Ocupacional",
        duracao: "45 min",
        conteudo: [
          "Estressores do trabalho moderno: sobrecarga, ambiguidade, conflitos",
          "Estresse agudo vs. crônico: diferenças e riscos",
          "Sintomas físicos, emocionais e comportamentais do estresse",
          "Identificando seus principais gatilhos de estresse",
          "Autoavaliação: qual seu nível atual de estresse?"
        ]
      },
      {
        id: 2,
        titulo: "Técnicas de Gestão Emocional",
        duracao: "45 min",
        conteudo: [
          "Respiração diafragmática: técnica 4-7-8 para acalmar",
          "Atenção plena (mindfulness): estar presente no aqui e agora",
          "Reenquadramento cognitivo: mudando a interpretação dos eventos",
          "Técnicas de ancoragem emocional para momentos críticos",
          "Prática guiada: sessão de mindfulness de 10 minutos"
        ]
      },
      {
        id: 3,
        titulo: "Práticas de Autocuidado",
        duracao: "45 min",
        conteudo: [
          "Sono de qualidade: higiene do sono e rotina noturna",
          "Alimentação equilibrada: nutrientes para o cérebro",
          "Atividade física regular: benefícios para saúde mental",
          "Pausas ativas durante o expediente: movimentação e descompressão",
          "Hobbies e lazer: importância de desconectar do trabalho"
        ]
      },
      {
        id: 4,
        titulo: "Equilíbrio e Apoio Organizacional",
        duracao: "45 min",
        conteudo: [
          "Estabelecendo limites saudáveis entre trabalho e vida pessoal",
          "Como dizer não sem culpa: priorizando o essencial",
          "Programas organizacionais de bem-estar: ginástica laboral, terapia, etc.",
          "Criando cultura de apoio: check-ins regulares, conversas abertas",
          "Plano pessoal de autocuidado: compromissos para os próximos 30 dias"
        ]
      }
    ],
    atividadesPraticas: [
      "Práticas de mindfulness e respiração",
      "Criação de rotina de autocuidado personalizada",
      "Exercícios de pausas ativas e alongamento",
      "Plano de ação para equilíbrio trabalho-vida"
    ]
  }
];

export const getCursoBySlug = (slug: string): Curso | undefined => {
  return cursos.find(curso => curso.slug === slug);
};

export const getCursoById = (id: number): Curso | undefined => {
  return cursos.find(curso => curso.id === id);
};
