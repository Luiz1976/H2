// Trilha de Capacitacao - Lideranca e Saude Psicossocial - Conforme NR01
// IMPORTANTE: Este arquivo contem TODOS os 8 cursos completos da trilha

export interface Modulo {
  id: number;
  titulo: string;
  duracao: string;
  topicos: string[];
  materialDidatico: string;
}

export interface Curso {
  id: number;
  slug: string;
  titulo: string;
  subtitulo: string;
  descricao: string;
  duracao: string;
  nivel: "Iniciante" | "Intermediario" | "Avancado";
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
    titulo: "Fundamentos Legais e Tecnicos dos Riscos Psicossociais",
    subtitulo: "Base Legal e Tecnica para Gestao Preventiva",
    descricao: "Compreenda o contexto legal, tecnico e organizacional da gestao dos riscos psicossociais no ambiente de trabalho, conforme NR01.",
    duracao: "4h",
    nivel: "Intermediario",
    categoria: "Compliance e Legal",
    icone: "⚖️",
    cor: "from-blue-600 to-cyan-600",
    corBadge: "bg-blue-100 text-blue-700 border-blue-200",
    objetivo: "Capacitar os lideres para compreender o contexto legal, tecnico e organizacional da gestao dos riscos psicossociais no ambiente de trabalho.",
    resultadosEsperados: [
      "Lideres conscientes da base legal e suas responsabilidades",
      "Capacidade de identificar riscos psicossociais no dia a dia",
      "Integracao pratica com o PGR (Programa de Gerenciamento de Riscos)",
      "Compreensao dos impactos organizacionais e financeiros"
    ],
    modulos: [
      {
        id: 1,
        titulo: "Introducao a NR01 e ao PGR",
        duracao: "60 min",
        topicos: [
          "O que sao riscos ocupacionais e psicossociais",
          "Estrutura completa da NR01",
          "Objetivo central do PGR",
          "Por que a saude psicossocial tornou-se obrigatoria",
          "Casos reais de empresas penalizadas"
        ],
        materialDidatico: `
INTRODUCAO A NR01 E AO PROGRAMA DE GERENCIAMENTO DE RISCOS

O QUE SAO RISCOS OCUPACIONAIS

Riscos ocupacionais sao agentes, fatores ou situacoes presentes no ambiente de trabalho que podem causar danos a saude fisica, mental ou social dos trabalhadores.

Classificacao dos Riscos Ocupacionais:
- Riscos Fisicos: ruido, vibracao, temperaturas extremas, radiacao
- Riscos Quimicos: poeiras, fumos, nevoas, gases, vapores
- Riscos Biologicos: virus, bacterias, fungos, parasitas
- Riscos Ergonomicos: esforco fisico intenso, postura inadequada, ritmo excessivo
- Riscos Psicossociais: carga mental excessiva, assedio, pressao por metas, falta de autonomia

O QUE SAO RISCOS PSICOSSOCIAIS

Riscos psicossociais sao aspectos da organizacao do trabalho, das relacoes interpessoais e do conteudo das tarefas que podem causar estresse cronico, sofrimento psiquico e adoecimento mental.

Principais Riscos Psicossociais:
1. Sobrecarga de trabalho
2. Pressao por metas inatingiveis
3. Jornadas excessivas
4. Assedio moral e sexual
5. Falta de reconhecimento
6. Inseguranca no emprego
7. Conflitos interpessoais
8. Falta de autonomia
9. Trabalho monotono ou sem sentido
10. Desequilibrio entre vida pessoal e profissional

ESTRUTURA DA NR01 - GESTAO DE RISCOS OCUPACIONAIS

A Norma Regulamentadora 01 foi completamente reformulada em 2020 e estabelece as diretrizes gerais para a gestao de riscos ocupacionais.

Historico e Atualizacoes:
- 1978: NR01 original (disposicoes gerais)
- 2020: Reformulacao completa com foco em gestao de riscos
- 2021: Inclusao explicita dos riscos psicossociais
- 2022: Detalhamento de criterios de avaliacao

Objetivo da NR01:
Estabelecer as diretrizes e os requisitos para o gerenciamento de riscos ocupacionais e as medidas de prevencao em Seguranca e Saude no Trabalho (SST).

Principais Exigencias da NR01:
1. Implementacao do PGR (Programa de Gerenciamento de Riscos)
2. Identificacao de perigos e avaliacao de riscos
3. Implementacao de medidas de prevencao
4. Acompanhamento do controle dos riscos
5. Analise de acidentes e doencas do trabalho

O PROGRAMA DE GERENCIAMENTO DE RISCOS (PGR)

O PGR e um programa obrigatorio que deve conter:

1. Levantamento Preliminar de Perigos
Identificacao de todos os riscos presentes no ambiente de trabalho, incluindo os psicossociais.

2. Avaliacao de Riscos
Analise da probabilidade e gravidade de cada risco identificado.

3. Plano de Acao
Definicao de medidas preventivas e corretivas com prazos e responsaveis.

4. Monitoramento
Acompanhamento periodico da efetividade das acoes implementadas.

Integracao com Outras Normas:
- NR07 (PCMSO): Exames medicos e monitoramento de saude
- NR09 (Avaliacao e controle): Criterios tecnicos
- NR17 (Ergonomia): Organizacao do trabalho
- NR35, NR33, etc: Riscos especificos

INCLUSAO DOS RISCOS PSICOSSOCIAIS NA NR01

Desde 2021, a NR01 reconhece explicitamente que os riscos psicossociais devem ser considerados no PGR.

Por que essa mudanca aconteceu:
1. Aumento de 300% nos afastamentos por transtornos mentais entre 2010-2020
2. Pressao de organismos internacionais (OIT, OMS)
3. Custos bilionarios com afastamentos e indenizacoes
4. Reconhecimento cientifico do impacto na saude

Obrigacoes Legais das Empresas:
- Identificar riscos psicossociais em todas as areas
- Avaliar nivel de exposicao dos trabalhadores
- Implementar medidas preventivas
- Monitorar indicadores de saude mental
- Registrar e investigar casos de adoecimento
- Treinar liderancas para prevencao

CASOS REAIS DE EMPRESAS PENALIZADAS

Caso 1: Empresa de Telemarketing (2019)
Situacao: Metas abusivas, controle excessivo, assedio moral sistematico
Resultado: 120 trabalhadores afastados por transtornos mentais
Penalidade: Multa de R$ 800.000 + indenizacoes de R$ 15 milhoes
Aprendizado: Metas devem ser realistas e o clima monitorado

Caso 2: Banco (2021)
Situacao: Pressao excessiva por vendas, jornadas de 12h diarias
Resultado: 45 casos de burnout diagnosticados
Penalidade: Multa de R$ 2,5 milhoes + obrigacao de reestruturar processos
Aprendizado: Jornada e metas precisam respeitar limites humanos

Caso 3: Hospital (2022)
Situacao: Falta de treinamento, sobrecarga, ausencia de suporte psicologico
Resultado: 30 profissionais afastados, 5 tentativas de suicidio
Penalidade: Intervencao do MPT, paralisa cao de setores, multa de R$ 1,2 milhao
Aprendizado: Ambientes de alta pressao exigem suporte estruturado

RESPONSABILIDADES LEGAIS E CONSEQUENCIAS

Responsabilidade da Empresa:
- Cumprir integralmente a NR01
- Implementar e manter o PGR atualizado
- Garantir ambiente de trabalho saudavel
- Responder civil e criminalmente por omissao

Responsabilidade do Lider:
- Identificar e reportar riscos
- Implementar medidas preventivas na sua area
- Monitorar saude da equipe
- Nao praticar ou tolerar assedio

Multas e Penalidades:
- Notificacao: R$ 1.000 a R$ 10.000
- Auto de Infracao Grave: R$ 10.000 a R$ 50.000
- Auto de Infracao Muito Grave: R$ 50.000 a R$ 300.000
- Embargo ou Interdicao: Paralisa cao de atividades
- Processos Trabalhistas: Indenizacoes milionarias
- Processo Criminal: Prisao em casos extremos

INTEGRACAO DO PGR COM A ESTRATEGIA ORGANIZACIONAL

O PGR nao e apenas uma obrigacao legal - e uma ferramenta estrategica.

Beneficios Organizacionais:
- Reducao de 40% em afastamentos
- Aumento de 25% na produtividade
- Diminuicao de 60% em processos trabalhistas
- Melhoria de 35% no clima organizacional
- Retencao de talentos (reducao de 50% no turnover)

ROI (Retorno sobre Investimento):
Cada R$ 1,00 investido em prevencao retorna R$ 4,00 a R$ 6,00 em:
- Reducao de custos com afastamentos
- Menor rotatividade
- Maior produtividade
- Menos processos judiciais
- Melhor imagem corporativa

EXERCICIOS PRATICOS

Exercicio 1: Mapeamento Inicial
Liste 5 riscos psicossociais presentes na sua area de atuacao.

Exercicio 2: Analise de Conformidade
Sua empresa tem PGR implementado? Os riscos psicossociais estao incluidos?

Exercicio 3: Caso Pratico
Imagine que 3 colaboradores da sua equipe foram afastados por estresse nos ultimos 6 meses. Quais acoes voce deveria ter tomado preventivamente?

CONCLUSAO DO MODULO

A NR01 e o PGR nao sao burocracias - sao ferramentas de protecao da vida e da saude. Como lider, voce tem responsabilidade legal e moral de garantir um ambiente de trabalho saudavel.

Proximos Passos:
1. Verifique se sua empresa tem PGR implementado
2. Solicite ao RH/SESMT inclusao de riscos psicossociais
3. Mapeie os riscos da sua area
4. Proponha acoes preventivas concretas

Lembre-se: Prevenir e mais barato, mais humano e mais estrategico que remediar.
        `
      },
      {
        id: 2,
        titulo: "Responsabilidades da Lideranca",
        duracao: "60 min",
        topicos: [
          "Obrigacoes legais do gestor",
          "Papel preventivo do lider",
          "Identificacao de comportamentos criticos",
          "Documentacao e reporte adequado",
          "Responsabilidade civil e criminal"
        ],
        materialDidatico: `
RESPONSABILIDADES DA LIDERANCA NA GESTAO DE RISCOS PSICOSSOCIAIS

OBRIGACOES LEGAIS DO GESTOR

Como lider, voce nao e apenas responsavel por resultados - voce e legalmente responsavel pela saude e seguranca da sua equipe.

Base Legal:
- NR01: Obrigacao de identificar e controlar riscos
- CLT Art. 157: Dever de cumprir normas de seguranca
- Lei 14.457/22: Prevencao ao assedio
- Codigo Civil: Responsabilidade por danos
- Codigo Penal: Crimes de omissao

O que a Lei Exige de Voce:
1. Conhecer os riscos psicossociais da sua area
2. Identificar situacoes de risco precocemente
3. Reportar imediatamente casos graves
4. Implementar medidas preventivas
5. Nao praticar ou tolerar assedio
6. Documentar acoes tomadas
7. Participar de treinamentos obrigatorios

PAPEL PREVENTIVO DO LIDER

Voce e a primeira linha de defesa contra riscos psicossociais.

Funcoes Preventivas do Lider:
1. Observador Atento: Perceber mudancas de comportamento
2. Facilitador: Criar ambiente de seguranca psicologica
3. Comunicador: Manter dialogo aberto
4. Mediador: Resolver conflitos rapidamente
5. Educador: Conscientizar a equipe
6. Modelo: Dar o exemplo de comportamento saudavel

Por que o Lider e Crucial:
- Voce tem contato diario com a equipe
- Pode identificar sinais antes de virarem doenca
- Tem poder para mudar processos de trabalho
- Influencia diretamente o clima da area
- E a ponte entre colaboradores e organizacao

IDENTIFICACAO DE COMPORTAMENTOS CRITICOS

Sinais de Alerta que Voce DEVE Observar:

1. Mudancas de Comportamento
ANTES: Colaborador comunicativo e engajado
AGORA: Isolado, silencioso, evita interacao
ACAO: Conversa individual para entender o que mudou

2. Queda de Performance
ANTES: Entregas no prazo e com qualidade
AGORA: Atrasos, erros, trabalho incompleto
ACAO: Investigar causas (sobrecarga, problemas pessoais, desmotivacao)

3. Problemas de Saude Frequentes
SINAIS: Faltas recorrentes, atestados frequentes, queixas de dor
ACAO: Encaminhar ao SESMT/medicina do trabalho

4. Sinais de Estresse Cronico
FISICOS: Cansaco extremo, dores de cabeca, problemas digestivos
EMOCIONAIS: Irritabilidade, choro facil, apatia
COMPORTAMENTAIS: Agressividade, isolamento, erros
ACAO: Conversa empática e avaliacao de carga de trabalho

5. Indicios de Assedio
SINAIS: Colaborador relata humilhacoes, isolamento proposital, comentarios inadequados
ACAO IMEDIATA: Reportar ao RH/Compliance, nao minimizar a situacao

6. Pensamentos ou Falas sobre Desistir
FRASES: "Nao aguento mais", "Quero sumir", "Seria melhor se eu nao estivesse aqui"
ACAO URGENTE: Acionar RH, SESMT, sugerir apoio psicologico

Tecnica do Semaforo:

VERDE (Tudo OK):
- Produtividade normal
- Bom humor
- Engajamento
- Relacionamentos saudaveis

AMARELO (Atencao):
- Pequenas mudancas de comportamento
- Cansaco ocasional
- Irritabilidade leve
ACAO: Conversa preventiva

VERMELHO (Intervencao Necessaria):
- Mudancas drasticas
- Multiplos sinais de alerta
- Afastamentos frequentes
ACAO: Intervencao imediata

DOCUMENTACAO E REPORTE ADEQUADO

A documentacao correta protege o colaborador, a empresa e voce.

O que Documentar:
1. Data e hora da observacao/conversa
2. Descricao objetiva do comportamento observado
3. Acoes tomadas
4. Pessoas envolvidas/acionadas
5. Resultado das acoes

Modelo de Registro:

Data: 15/03/2024 - 14:30h
Colaborador: Joao Silva (ID: 12345)
Situacao Observada: Colaborador apresentou irritabilidade excessiva em reuniao, levantou a voz com colegas (comportamento atipico). Nos ultimos 15 dias, observei 4 atrasos e 2 faltas.
Acao Tomada: Conversa individual realizada. Colaborador relatou sobrecarga e problemas pessoais. Redistribui 2 demandas para equilibrar carga.
Encaminhamento: Sugeri apoio do PAE (Programa de Apoio ao Empregado). Agendarei acompanhamento em 7 dias.
Registro: Comunicado ao RH via email (protocolo 2024-0315-001)

Quando Reportar ao RH/SESMT:
IMEDIATO (nas proximas 2 horas):
- Relato de assedio moral ou sexual
- Ideacao suicida ou auto-lesao
- Crise de panico ou colapso emocional
- Ameaca de violencia

URGENTE (em 24 horas):
- Multiplos sinais de burnout
- Afastamento iminente por saude mental
- Conflito grave entre colaboradores
- Situacao de risco evidente

BREVE (em 3-5 dias):
- Mudancas comportamentais persistentes
- Queda consistente de performance
- Relatos de sobrecarga
- Clima ruim na equipe

Como Reportar:
1. Use canais oficiais (email, sistema interno, formulario)
2. Seja objetivo e factual (sem julgamentos)
3. Proteja a confidencialidade
4. Solicite orientacao sobre proximos passos
5. Documente que reportou

RESPONSABILIDADE CIVIL E CRIMINAL

Voce pode ser responsabilizado pessoalmente por omissao ou ma conducao.

Responsabilidade Civil:

Casos de Condenacao de Lideres:
- Lider que praticou assedio moral: Indenizacao de R$ 50.000
- Gestor que ignorou sinais de burnout: R$ 80.000 por danos morais
- Supervisor que tolerou assedio sexual: R$ 120.000 + perda do cargo

O que Gera Responsabilidade Civil:
- Praticar assedio pessoalmente
- Tolerar assedio de terceiros
- Ignorar sinais evidentes de adoecimento
- Nao tomar providencias quando informado
- Criar ambiente toxico sistematicamente

Responsabilidade Criminal:

Crimes Possiveis:
- Assedio Sexual (Art. 216-A CP): 1 a 2 anos
- Constrangimento Ilegal (Art. 146 CP): 3 meses a 1 ano
- Lesao Corporal (quando causa adoecimento): 3 meses a 3 anos
- Omissao de Socorro (casos extremos): 1 a 6 meses

Caso Real - Gestor Condenado:
Gerente de vendas cobrava metas publicamente humilhando equipe. Uma colaboradora desenvolveu depressao grave e tentou suicidio. O gestor foi condenado a:
- 1 ano de prisao (convertida em servicos comunitarios)
- R$ 200.000 de indenizacao
- Perda definitiva do cargo de lideranca
- Ficha criminal

PROTEGENDO-SE LEGALMENTE

Boas Praticas para Protecao Legal:
1. Documente TODAS as acoes e conversas importantes
2. Nunca pratique ou tolere assedio
3. Reporte situacoes de risco imediatamente
4. Participe de treinamentos oferecidos
5. Busque orientacao do RH quando em duvida
6. Trate todos com respeito e profissionalismo
7. Mantenha comunicacao transparente

O que NUNCA Fazer:
- Minimizar relatos de assedio ("e so brincadeira")
- Ignorar sinais evidentes de adoecimento
- Pressionar colaborador doente a trabalhar
- Tomar decisoes sozinho em casos graves
- Omitir informacoes em investigacoes
- Retaliar quem denunciou problemas

EXERCICIOS PRATICOS

Exercicio 1: Analise de Caso
Maria, sua analista, antes pontual e alegre, nas ultimas 3 semanas tem chegado atrasada, apresenta olhos vermelhos e chora no banheiro. O que voce faz?

Exercicio 2: Pratica de Documentacao
Escreva um registro documentado da situacao de Maria seguindo o modelo apresentado.

Exercicio 3: Auto-Avaliacao
Voce esta cumprindo suas responsabilidades legais? Liste 3 acoes que precisa melhorar.

CONCLUSAO DO MODULO

Ser lider e ter poder - e poder implica responsabilidade. Voce pode ser o fator que previne um adoecimento ou que o causa.

Reflexao Final:
Como voce quer ser lembrado pela sua equipe? Como o lider que cuidou ou como aquele que ignorou?

Proximos Passos:
1. Revise sua forma de liderar
2. Identifique situacoes de risco na sua equipe
3. Documente acoes importantes
4. Busque treinamento continuo

Lembre-se: Cuidar da saude mental da equipe nao e bondade - e obrigacao legal e moral.
        `
      },
      {
        id: 3,
        titulo: "Integracao com Outras Normas e Leis",
        duracao: "60 min",
        topicos: [
          "NR07 - PCMSO e saude mental",
          "NR17 - Ergonomia organizacional",
          "Lei 14.457/22 - Prevencao ao assedio",
          "CLT e direitos trabalhistas",
          "Como garantir conformidade integral"
        ],
        materialDidatico: `
INTEGRACAO DAS NORMAS E LEIS DE PROTECAO PSICOSSOCIAL

VISAO INTEGRADA DA LEGISLACAO

A protecao da saude mental no trabalho nao depende de uma unica norma, mas de um conjunto integrado de legislacoes.

Ecossistema Legal Brasileiro:
- NR01: Gestao de riscos (incluindo psicossociais)
- NR07: Monitoramento de saude (PCMSO)
- NR17: Ergonomia (incluindo cognitiva)
- Lei 14.457/22: Prevencao ao assedio
- CLT: Direitos trabalhistas fundamentais
- Lei 13.467/17: Reforma trabalhista
- Codigo Civil: Responsabilidade civil
- Codigo Penal: Crimes relacionados

NR07 - PROGRAMA DE CONTROLE MEDICO DE SAUDE OCUPACIONAL

O que e o PCMSO:
Programa obrigatorio que visa a preservacao da saude dos trabalhadores atraves de exames medicos periodicos e monitoramento de saude.

Integracao com Saude Mental:

Exames Obrigatorios que Incluem Avaliacao Psicossocial:
1. Admissional: Avaliacao do estado de saude mental inicial
2. Periodico: Monitoramento anual ou semestral
3. Retorno ao Trabalho: Apos afastamentos
4. Mudanca de Funcao: Quando houver mudanca de riscos
5. Demissional: Avaliacao final do estado de saude

Novidades da NR07 (Atualizacao 2022):
- Inclusao obrigatoria de riscos psicossociais no inventario
- Avaliacao de fatores de estresse ocupacional
- Rastreamento de transtornos mentais
- Nexo causal entre trabalho e adoecimento mental
- Indicadores de saude mental da empresa

O que o Medico do Trabalho Avalia:
- Sinais de estresse cronico
- Indicadores de burnout
- Sintomas de ansiedade e depressao
- Uso de substancias (alcool, drogas)
- Qualidade do sono
- Relacao entre sintomas e trabalho

Papel do Lider no PCMSO:
1. Liberar o colaborador para exames periodicos
2. Fornecer informacoes sobre a funcao e riscos
3. Implementar recomendacoes medicas
4. Respeitar restricoes e limitacoes
5. Nao pressionar retorno antes do apto medico

Caso Real - PCMSO Salvou Vidas:
Empresa de TI implementou avaliacao psicossocial no periodico. Identificou 15 casos de burnout em estagio inicial. Intervencao precoce evitou afastamentos e 2 casos de ideacao suicida foram tratados a tempo.

NR17 - ERGONOMIA (ASPECTOS COGNITIVOS E ORGANIZACIONAIS)

A ergonomia nao e apenas sobre cadeiras e mesas - inclui a organizacao do trabalho.

Ergonomia Organizacional - O que Avalia:
1. Carga de trabalho mental
2. Ritmo de trabalho
3. Pausas e descansos
4. Turnos e jornadas
5. Conteudo das tarefas
6. Autonomia e controle
7. Comunicacao organizacional
8. Pressao temporal

Aspectos da NR17 Relacionados a Saude Mental:

17.6.3 - Organizacao do Trabalho:
Deve levar em consideracao:
- Normas de producao REALISTICAS
- Modo operatorio HUMANIZADO
- Exigencia de tempo ADEQUADA
- Conteudo das tarefas SIGNIFICATIVO
- Ritmo de trabalho SUSTENTAVEL

Elementos Que Geram Risco Psicossocial:
- Metas inalcancaveis
- Pressao temporal excessiva
- Trabalho monotono
- Falta de pausas
- Jornadas irregulares
- Trabalho noturno mal gerenciado
- Ausencia de autonomia

Aplicacao Pratica para Lideres:

Metas Realistas (NR17):
ERRADO: "Voces precisam dobrar a producao sem aumentar a equipe"
CERTO: "Vamos analisar a capacidade atual e definir metas alcancaveis"

Pausas Adequadas (NR17):
ERRADO: Trabalho de 4 horas corridas em computador
CERTO: Pausa de 10 min a cada 50 min de trabalho intenso

Conteudo Significativo (NR17):
ERRADO: Tarefas fragmentadas sem visao do todo
CERTO: Colaborador entende o impacto do seu trabalho

LEI 14.457/22 - PROGRAMA EMPREGA + MULHERES

Lei Federal que torna obrigatoria a prevencao e combate ao assedio sexual e moral.

Principais Exigencias:

Para Empresas com Mais de 10 Empregados:
1. Politica de Prevencao ao Assedio (escrita e divulgada)
2. Canais de Denuncia (confidenciais e seguros)
3. Treinamentos Periodicos (obrigatorios)
4. Procedimentos de Investigacao (imparciais e rapidos)
5. Punicoes Claras (proporciona is a gravidade)

Definicoes Legais:

Assedio Moral:
Conducao reiterada com objetivo de degradar condicoes de trabalho, ofender dignidade, causar dano psicologico.
Exemplos: humilhacao publica, isolamento proposital, sobrecarga intencional, comentarios depreciativos

Assedio Sexual:
Constranger alguem com intuito de obter vantagem ou favorecimento sexual.
Exemplos: cantadas insistentes, toques nao consensuais, comentarios sobre corpo, chantagem sexual

Responsabilidades do Lider (Lei 14.457/22):
1. Conhecer a politica de prevencao
2. Nao praticar assedio (obvio, mas precisa ser dito)
3. Nao tolerar assedio na equipe
4. Acolher denuncias sem revitimizar
5. Colaborar com investigacoes
6. Aplicar punicoes quando comprovado

Penalidades por Descumprimento:
- Multas de R$ 10.000 a R$ 100.000
- Processsos trabalhistas individuais
- Dano a reputacao da empresa
- Perda de contratos publicos
- Responsabilizacao pessoal de lideres

Caso Real - Lei 14.457 em Acao:
Gerente fazia comentarios sobre aparencia fisica de funcionarias. Apos denuncia via canal interno, empresa investigou em 7 dias, comprovou o assedio e demitiu o gerente por justa causa. Custo: R$ 0 para empresa (agiu corretamente). Se tivesse ignorado: processo de R$ 500.000.

CLT E DIREITOS TRABALHISTAS RELACIONADOS A SAUDE MENTAL

Artigos da CLT Relevantes:

Art. 157 - Dever do Empregador:
"Cumprir e fazer cumprir as normas de seguranca e medicina do trabalho"
Interpretacao: Inclui prevencao de riscos psicossociais

Art. 158 - Dever do Empregado:
"Colaborar com a empresa na aplicacao das normas de SST"
Interpretacao: Participar de treinamentos, reportar riscos

Art. 483 - Rescisao Indireta:
O empregado pode romper contrato se o empregador:
- Exigir servicos superiores as suas forcas (sobrecarga)
- Tratar com rigor excessivo (assedio moral)
- Correr perigo manifesto de mal consideravel

Resultado: Funcionario "demite" a empresa com todos os direitos

Art. 482 - Justa Causa:
Empregador pode demitir por justa causa em caso de:
- Ato de indisciplina ou insubordinacao
- Desídia no desempenho
Cuidado: Nao confunda baixa performance por doenca com desídia

Direito ao Auxilio-Doenca:
Transtornos mentais relacionados ao trabalho dao direito a:
- Afastamento com beneficio do INSS
- Estabilidade de 12 meses apos retorno
- Indenizacao se comprovado nexo causal

GARANTINDO CONFORMIDADE INTEGRAL

Checklist de Conformidade para Lideres:

NR01 - PGR:
- Riscos psicossociais da minha area estao mapeados?
- Participo do PGR com informacoes da minha area?
- Implemento as medidas preventivas definidas?

NR07 - PCMSO:
- Libero colaboradores para exames periodicos?
- Respeito restricoes medicas?
- Reporto casos de adoecimento?

NR17 - Ergonomia:
- Metas sao realisticas?
- Jornadas sao adequadas?
- Ha pausas suficientes?
- Trabalho tem significado?

Lei 14.457/22:
- Conheco a politica de prevencao ao assedio?
- Sei como acionar canal de denuncia?
- Fiz treinamento obrigatorio?
- Trato todos com respeito?

CLT:
- Respeito jornadas legais?
- Pago horas extras corretamente?
- Nao exijo alem das forcas do colaborador?
- Trato todos sem rigor excessivo?

Plano de Acao para Conformidade Total:

Mes 1:
- Estudar todas as normas
- Fazer auto-avaliacao
- Identificar gaps

Mes 2:
- Participar de treinamentos
- Mapear riscos da area
- Propor melhorias

Mes 3:
- Implementar acoes corretivas
- Documentar processos
- Monitorar resultados

EXERCICIOS PRATICOS

Exercicio 1: Integracao de Normas
Um colaborador relata sobrecarga e sintomas de ansiedade. Quais normas se aplicam e que acoes voce deve tomar em cada uma?

Exercicio 2: Analise de Conformidade
Avalie sua area usando o checklist apresentado. Em qual norma voce esta mais vulneravel?

Exercicio 3: Caso Pratico
Funcionaria denuncia assedio sexual de colega. Como voce age considerando Lei 14.457/22, CLT e responsabilidades de lider?

CONCLUSAO DO MODULO

A protecao da saude mental no trabalho e garantida por multiplas camadas de legislacao. Ignorar qualquer uma delas coloca colaboradores em risco e expoe voce e a empresa a consequencias legais graves.

Reflexao: Conformidade legal nao e burocracia - e cuidado sistematizado com pessoas.

Proximos Passos:
1. Estude cada norma mencionada
2. Verifique conformidade da sua area
3. Corrija imediatamente desvios identificados
4. Documente todas as acoes

Lembre-se: A lei protege quem se protege. Aja preventivamente, sempre.
        `
      }
    ],
    integracaoPGR: [
      "Atuacao preventiva conforme NR01 - Gestao de Riscos Ocupacionais",
      "Identificacao e comunicacao de fatores de riscos psicossociais",
      "Promocao de ambiente saudavel, etico e seguro",
      "Fortalecimento da cultura de prevencao continua"
    ]
  },
  {
    id: 2,
    slug: "inteligencia-emocional-lideranca",
    titulo: "Inteligencia Emocional Aplicada a Lideranca",
    subtitulo: "Autoconsciencia, Empatia e Autorregulacao",
    descricao: "Desenvolva autoconsciencia, empatia e autorregulacao emocional, essenciais para uma lideranca equilibrada e humana.",
    duracao: "3h",
    nivel: "Intermediario",
    categoria: "Desenvolvimento Pessoal",
    icone: "🧠",
    cor: "from-purple-600 to-pink-600",
    corBadge: "bg-purple-100 text-purple-700 border-purple-200",
    objetivo: "Desenvolver autoconsciencia, empatia e autorregulacao emocional, essenciais para uma lideranca equilibrada e humana.",
    resultadosEsperados: [
      "Reducao de reacoes impulsivas e decisoes baseadas em emocoes negativas",
      "Melhoria significativa do clima organizacional",
      "Aumento do engajamento e confianca da equipe",
      "Maior capacidade de lidar com pressao e conflitos"
    ],
    modulos: [
      {
        id: 1,
        titulo: "Fundamentos da Inteligencia Emocional",
        duracao: "45 min",
        topicos: [
          "O que e Inteligencia Emocional",
          "Diferenca entre IE e QI",
          "As 5 competencias da IE segundo Daniel Goleman",
          "Importancia para lideres",
          "Aplicacao pratica na lideranca"
        ],
        materialDidatico: `
FUNDAMENTOS DA INTELIGENCIA EMOCIONAL

O QUE E INTELIGENCIA EMOCIONAL

A Inteligencia Emocional e a capacidade de reconhecer, compreender e gerenciar nossas proprias emocoes, bem como reconhecer, compreender e influenciar as emocoes dos outros.

Este conceito foi popularizado pelo psicologo Daniel Goleman em 1995 e revolucionou nossa compreensao sobre o que torna uma pessoa bem-sucedida profissionalmente e pessoalmente.

Definicao Tecnica (Salovey e Mayer, 1990):
Inteligencia Emocional e um subconjunto da inteligencia social que envolve a capacidade de monitorar os sentimentos e emocoes proprios e dos outros, discriminar entre eles e usar essa informacao para guiar pensamentos e acoes.

Por que a IE e Importante para Lideres:

Estudos mostram que lideres com alta inteligencia emocional:
- Tem equipes 20% mais produtivas
- Reduzem turnover em ate 50%
- Criam ambientes de trabalho mais saudaveis
- Tomam decisoes mais equilibradas
- Gerenciam conflitos de forma mais eficaz
- Sao promovidos mais rapidamente
- Tem equipes mais engajadas

Pesquisa da Harvard Business Review:
90% dos lideres de alta performance tem alta IE, enquanto apenas 20% dos lideres de baixa performance apresentam essa caracteristica.

DIFERENCA ENTRE INTELIGENCIA EMOCIONAL E QI

Enquanto o QI (Quociente de Inteligencia) mede a capacidade cognitiva e logica, a IE mede a capacidade de lidar com emocoes.

Pesquisas demonstram que:
- QI contribui apenas 20% para o sucesso profissional
- IE contribui ate 80% para o sucesso profissional

Comparacao Pratica:

QI Alto + IE Baixa = Profissional Tecnico Excelente mas Lider Problematico
Exemplo: Engenheiro brilhante que humilha equipe, cria clima toxico, gera altissimo turnover

QI Medio + IE Alta = Lider Inspirador e Eficaz
Exemplo: Gerente que nao e o mais inteligente tecnicamente, mas motiva equipe, resolve conflitos, gera resultados extraordinarios

QI Alto + IE Alta = Lider Excepcional
Exemplo: Executivo que une competencia tecnica com capacidade de inspirar, desenvolver pessoas e criar cultura de alta performance

Por que IE Importa Mais que QI na Lideranca:

1. Lideranca e sobre pessoas, nao apenas sobre processos
2. Decisoes complexas envolvem emocoes, nao apenas dados
3. Conflitos sao emocionais, nao logicos
4. Motivacao e emocional, nao racional
5. Cultura organizacional e emocional, nao tecnica

AS 5 COMPETENCIAS DA IE SEGUNDO DANIEL GOLEMAN

1. AUTOCONSCIENCIA EMOCIONAL

Definicao: A capacidade de reconhecer e entender suas proprias emocoes, pontos fortes, fraquezas, valores e impactos nos outros.

Por que e Fundamental:
Se voce nao sabe o que sente, nao pode controlar como reage. Autoconsciencia e a base de todas as outras competencias emocionais.

Como Desenvolver:
- Pratique a autorreflexao diaria (10 minutos por dia)
- Mantenha um diario emocional
- Peca feedback honesto de pessoas de confianca
- Observe seus gatilhos emocionais (o que te tira do eixo?)
- Faca terapia ou coaching
- Pratique mindfulness

Exemplo no Trabalho:
"Percebo que quando recebo criticas em publico, fico defensivo e agressivo. Isso me ajuda a pedir feedback em particular, onde consigo processar melhor."

Lideres com Alta Autoconsciencia:
- Conhecem seus limites e pedem ajuda quando necessario
- Reconhecem quando emocoes estao afetando julgamento
- Aceitam feedback sem defensividade
- Admitem erros publicamente

Lideres com Baixa Autoconsciencia:
- Culpam outros por tudo
- Nao percebem impacto negativo em pessoas
- Repetem os mesmos erros
- Tem pontos cegos gigantescos

2. AUTORREGULACAO EMOCIONAL

Definicao: A habilidade de controlar ou redirecionar impulsos e humores perturbadores. Pensar antes de agir.

Por que e Essencial:
Um lider que explode, grita ou toma decisoes impulsivas cria um ambiente de medo e instabilidade.

Tecnicas Praticas:
- Respiracao diafragmatica 4-7-8 (inspire 4s, segure 7s, expire 8s)
- Pausa de 90 segundos antes de reagir (tempo que uma emocao leva para se processar)
- Reenquadramento cognitivo (mudar perspectiva)
- Exercicio fisico regular (reduz cortisol)
- Sono adequado (7-9 horas)
- Tecnicas de grounding

Exemplo no Trabalho:
"Quando um colaborador comete um erro grave, em vez de explodir, respiro fundo, saio da sala por 2 minutos e retorno com calma para conversar construtivamente."

Beneficios da Autorregulacao:
- Decisoes mais racionais
- Menos arrependimentos
- Maior respeito da equipe
- Ambiente mais seguro
- Menos conflitos

Sinais de Baixa Autorregulacao:
- Explosoes de raiva
- Decisoes impulsivas que precisa reverter
- Fala coisas que depois se arrepende
- Cria clima de medo
- Alta rotatividade na equipe

3. MOTIVACAO INTRINSECA

Definicao: O impulso interno para realizar, independente de recompensas externas. Paixao pelo que faz.

Caracteristicas de Lideres Motivados:
- Paixao pelo trabalho alem de dinheiro ou status
- Energia e persistencia mesmo diante de obstaculos
- Otimismo mesmo diante de fracassos
- Foco em objetivos de longo prazo
- Buscam desafios que os fazem crescer

Como Cultivar:
- Conecte seu trabalho a um proposito maior (Por que isso importa?)
- Celebre pequenas vitorias (nao espere apenas grandes conquistas)
- Mantenha objetivos desafiadores mas alcancaveis
- Inspire outros com seu exemplo
- Encontre significado no que faz

Exemplo Pratico:
Lider de vendas que ama desenvolver pessoas, nao apenas bater metas. Resultado: equipe engajada que supera expectativas porque se sente valorizada.

Impacto no Time:
Motivacao e contagiosa. Um lider motivado cria uma equipe motivada.

4. EMPATIA

Definicao: A capacidade de compreender e compartilhar os sentimentos dos outros. Colocar-se no lugar do outro.

Tres Tipos de Empatia:

Empatia Cognitiva: Entender intelectualmente a perspectiva do outro
Quando usar: Negociacoes, resolucao de problemas, tomada de decisoes

Empatia Emocional: Sentir fisicamente o que o outro esta sentindo
Quando usar: Situacoes de sofrimento, construcao de vinculo profundo
Cuidado: Pode levar a sobrecarga emocional se nao houver limites

Empatia Compassiva: Entender + Sentir + Agir para ajudar (a mais poderosa)
Quando usar: Sempre que possivel - e o equilibrio perfeito

Exercicio Pratico:
Quando um colaborador apresentar um problema, antes de dar solucoes, pergunte:
1. Como voce esta se sentindo com isso?
2. O que seria mais util para voce agora?
3. Como posso apoiar voce nessa situacao?

Lideres Empaticos:
- Tem equipes mais leais
- Reduzem conflitos
- Aumentam engajamento
- Sao procurados para conversas dificeis
- Criam ambientes de seguranca psicologica

5. HABILIDADES SOCIAIS

Definicao: A capacidade de gerenciar relacionamentos e construir redes. Comunicacao eficaz e influencia positiva.

Competencias-Chave:
- Comunicacao clara e assertiva
- Gestao de conflitos
- Trabalho em equipe
- Influencia e persuasao
- Lideranca de mudancas
- Networking estrategico
- Colaboracao entre areas

Como Desenvolver:
- Pratique escuta ativa (ouvir para compreender, nao para responder)
- Aprenda a dar feedback construtivo
- Desenvolva habilidades de negociacao
- Estude linguagem corporal
- Pratique comunicacao nao-violenta
- Amplie sua rede profissional

APLICACAO PRATICA NA LIDERANCA

Situacao 1: Colaborador com Baixa Performance

SEM IE:
"Voce esta pessimo! Se continuar assim, vai ser demitido."
Resultado: Colaborador fica pior, clima prejudicado, possivel processo trabalhista

COM IE:
"Notei que seu desempenho mudou nas ultimas semanas. Esta tudo bem? Ha algo acontecendo que eu possa ajudar?"
Resultado: Descobre problema pessoal ou sobrecarga, ajusta demandas, colaborador se recupera

Situacao 2: Conflito entre Membros da Equipe

SEM IE:
"Parem de brigar e voltem ao trabalho!"
Resultado: Conflito continua subterraneo, clima toxico, formacao de grupos

COM IE:
"Vejo que ha tensao. Vamos conversar individualmente e depois juntos para entender os pontos de vista e encontrar uma solucao construtiva."
Resultado: Conflito resolvido, aprendizado coletivo, equipe mais madura

Situacao 3: Pressao por Resultados

SEM IE:
Descontar frustracao na equipe, criar ambiente de medo, cobrar de forma agressiva
Resultado: Equipe paralisada, erros aumentam, pessoas adoecem ou pedem demissao

COM IE:
Comunicar transparentemente os desafios, mobilizar a equipe com otimismo, reconhecer esforcos, buscar solucoes coletivas
Resultado: Equipe engajada, criatividade aumenta, resultados aparecem

EXERCICIOS PRATICOS

Exercicio 1: Mapeamento Emocional
Liste 3 situacoes da ultima semana onde voce:
1. Reagiu emocionalmente
2. Como se sentiu
3. Como gostaria de ter reagido
4. O que aprendeu sobre si mesmo

Exercicio 2: Observacao de Emocoes
Durante 1 dia completo, anote cada vez que sentir uma emocao forte:
- Que emocao foi? (raiva, medo, alegria, tristeza, surpresa, nojo)
- O que a provocou?
- Como voce reagiu?
- Qual foi o resultado?
- Se pudesse voltar no tempo, reagiria diferente?

Exercicio 3: Pratica de Empatia
Escolha 3 pessoas da sua equipe e responda com honestidade:
- Quais sao seus principais desafios atualmente?
- O que os motiva profissionalmente?
- Como posso apoiar o desenvolvimento deles?
- O que posso fazer diferente como lider?

CONCLUSAO DO MODULO

A Inteligencia Emocional nao e um dom inato - e uma habilidade que pode ser desenvolvida com pratica deliberada e constante.

Lideres emocionalmente inteligentes criam equipes mais engajadas, produtivas e saudaveis. Eles nao apenas alcancam resultados - alcancam resultados sustentaveis cuidando das pessoas.

Proximos Passos:
1. Comece um diario emocional hoje mesmo
2. Pratique a regra dos 90 segundos antes de reagir
3. Faca pelo menos 1 conversa empatica por dia
4. Peca feedback sobre como suas emocoes impactam outros

Lembre-se: O desenvolvimento da IE e uma jornada continua, nao um destino. Seja paciente consigo mesmo.
        `
      }
    ],
    atividadesPraticas: [
      "Diario Emocional de 7 dias",
      "Role-play de conversas empaticas",
      "Pratica de respiracao consciente",
      "Simulacao de decisao sob pressao",
      "Plano pessoal de prevencao de burnout"
    ]
  },
  {
    id: 3,
    slug: "comunicacao-nao-violenta",
    titulo: "Comunicacao Nao Violenta (CNV)",
    subtitulo: "Tecnicas de Comunicacao Empatica e Construtiva",
    descricao: "Aprimore a escuta ativa e o dialogo construtivo atraves da Comunicacao Nao Violenta para reduzir conflitos e criar ambientes de seguranca psicologica.",
    duracao: "3h",
    nivel: "Intermediario",
    categoria: "Comunicacao",
    icone: "💬",
    cor: "from-green-600 to-teal-600",
    corBadge: "bg-green-100 text-green-700 border-green-200",
    objetivo: "Desenvolver habilidades de comunicacao empatica e assertiva para prevenir conflitos e criar dialogo construtivo.",
    resultadosEsperados: [
      "Reducao significativa de conflitos interpessoais",
      "Melhoria na qualidade das conversas dificeis",
      "Ambiente de seguranca psicologica fortalecido",
      "Aumento da colaboracao e confianca na equipe"
    ],
    modulos: [
      {
        id: 1,
        titulo: "Fundamentos da CNV",
        duracao: "60 min",
        topicos: [
          "O que e Comunicacao Nao Violenta",
          "Os 4 componentes da CNV",
          "Observacao sem julgamento",
          "Expressao de sentimentos",
          "Identificacao de necessidades",
          "Formulacao de pedidos claros"
        ],
        materialDidatico: `
FUNDAMENTOS DA COMUNICACAO NAO VIOLENTA

O QUE E COMUNICACAO NAO VIOLENTA

A Comunicacao Nao Violenta (CNV) e uma abordagem de comunicacao desenvolvida por Marshall Rosenberg que nos ensina a expressar necessidades e sentimentos de forma honesta sem atacar, julgar ou culpar os outros.

Por que se chama Nao Violenta?
Porque evita a violencia psicologica presente em julgamentos, criticas, rotulos, comparacoes e exigencias que causam dor emocional e conflitos.

Principio Fundamental:
Por tras de cada acao humana ha uma necessidade que esta tentando ser atendida. Quando compreendemos as necessidades (nossas e dos outros), criamos conexao e possibilidade de cooperacao.

Impacto da CNV nas Organizacoes:
- Reducao de 60% em conflitos interpessoais
- Aumento de 45% na produtividade de equipes
- Melhoria de 70% no clima organizacional
- Reducao de 50% em processos trabalhistas relacionados a assedio

OS 4 COMPONENTES DA CNV

A CNV segue uma estrutura simples mas poderosa de 4 passos:

1. OBSERVACAO (Sem Julgamento)
2. SENTIMENTO (Expressar Emocao)
3. NECESSIDADE (O que esta por tras)
4. PEDIDO (Especifico e Realizavel)

Vamos aprofundar cada componente:

COMPONENTE 1: OBSERVACAO SEM JULGAMENTO

O que e:
Descrever os FATOS observaveis sem adicionar interpretacao, avaliacao ou julgamento.

Diferenca Critica:

JULGAMENTO (Violento):
"Voce e irresponsavel e sempre se atrasa!"
Problema: "Irresponsavel" e julgamento. "Sempre" e generalizacao.

OBSERVACAO (Nao Violenta):
"Voce chegou 20 minutos atrasado nas ultimas 3 reunioes."
Solucao: Fatos especificos, sem julgamento.

Por que isso importa?
Quando julgamos, a pessoa se defende. Quando observamos, ela escuta.

Exercicio Pratico - Transforme Julgamentos em Observacoes:

JULGAMENTO: "Voce e preguicoso"
OBSERVACAO: "Notei que nos ultimos 5 dias voce entregou 2 tarefas dos 5 prazos combinados"

JULGAMENTO: "Voce nao se importa com a equipe"
OBSERVACAO: "Voce nao participou das ultimas 4 reunioes de equipe"

JULGAMENTO: "Voce e grosso"
OBSERVACAO: "Quando fiz a pergunta, voce respondeu sem olhar para mim e saiu da sala"

Palavras que Indicam Julgamento (Evite):
- Sempre, nunca (generalizacoes)
- Voce e... (rotulos)
- Preguicoso, irresponsavel, egoista (caracterizacoes)
- Deveria, tem que (exigencias)

COMPONENTE 2: SENTIMENTO (Expressar Emocao)

O que e:
Expressar honestamente como VOCE se sente em relacao a situacao observada.

Diferenca entre Sentimento Real e Falso Sentimento:

SENTIMENTO REAL (Como EU me sinto):
- "Eu me sinto frustrado..."
- "Eu me sinto preocupado..."
- "Eu me sinto desapontado..."

FALSO SENTIMENTO (Julgamento disfarçado):
- "Eu sinto que VOCE nao se importa..." (julgamento)
- "Eu sinto que VOCE e irresponsavel..." (rotulo)
- "Eu me sinto ignorado..." (interpretacao)

Lista de Sentimentos Reais para Praticar:

Sentimentos Agradaveis:
- Feliz, alegre, entusiasmado
- Grato, comovido, tocado
- Esperancoso, otimista, confiante
- Aliviado, tranquilo, em paz
- Animado, energizado, inspirado

Sentimentos Desagradaveis:
- Frustrado, irritado, impaciente
- Preocupado, ansioso, apreensivo
- Triste, desapontado, desencorajado
- Confuso, incomodado, perturbado
- Cansado, esgotado, sobrecarregado

Por que expressar sentimentos?
Humaniza a comunicacao. Quando compartilhamos como nos sentimos, criamos conexao emocional e empatia.

COMPONENTE 3: NECESSIDADE (O que esta por tras)

O que e:
Identificar a necessidade humana universal que nao esta sendo atendida e que gera o sentimento.

Conceito Fundamental:
Sentimentos sao indicadores de necessidades. Se me sinto frustrado, ha uma necessidade minha nao atendida.

Necessidades Humanas Universais:

Autonomia:
- Escolher sonhos, objetivos, valores
- Escolher planos para realizar sonhos

Celebracao:
- Comemorar conquistas e perdas
- Celebrar a vida

Integridade:
- Autenticidade, criatividade
- Significado, auto-estima

Interdependencia:
- Aceitacao, apreciacao, proximidade
- Comunidade, consideracao, confianca
- Empatia, honestidade, respeito

Necessidades Fisicas:
- Ar, agua, alimento
- Descanso, abrigo, seguranca
- Movimento, protecao de virus/bacterias

Paz Mental:
- Beleza, harmonia, inspiracao
- Ordem, paz

Exemplos Praticos:

"Me sinto frustrado porque preciso de respeito no trabalho"
Necessidade: Respeito

"Me sinto ansioso porque preciso de clareza sobre expectativas"
Necessidade: Clareza/Seguranca

"Me sinto sobrecarregado porque preciso de equilibrio entre trabalho e vida pessoal"
Necessidade: Equilibrio/Bem-estar

Por que identificar necessidades?
Porque necessidades sao neutras e universais. Podemos discordar de estrategias, mas todos temos as mesmas necessidades.

COMPONENTE 4: PEDIDO (Especifico e Realizavel)

O que e:
Fazer um pedido claro, especifico, positivo e realizavel para atender a necessidade.

Diferenca entre Pedido e Exigencia:

PEDIDO: "Voce poderia chegar 5 minutos antes das reunioes?"
Caracteristicas: Especifico, respeitoso, deixa espaco para dialogo

EXIGENCIA: "Voce TEM QUE parar de se atrasar!"
Caracteristicas: Vago, ameacador, nao ha espaco para nego ciacao

Caracteristicas de um Pedido Eficaz:

1. POSITIVO (diga o que quer, nao o que NAO quer)
RUIM: "Pare de me interromper"
BOM: "Voce poderia me deixar terminar meu raciocinio antes de comentar?"

2. ESPECIFICO (detalhes claros)
RUIM: "Seja mais responsavel"
BOM: "Voce poderia enviar os relatorios ate sexta as 17h?"

3. REALIZAVEL (possivel de fazer)
RUIM: "Quero que voce nunca mais erre"
BOM: "Voce poderia revisar o trabalho antes de enviar?"

4. COM PRAZO (quando aplicavel)
RUIM: "Me mande quando puder"
BOM: "Voce conseguiria me enviar ate amanha as 14h?"

Tipos de Pedidos:

Pedido de Acao:
"Voce poderia organizar a planilha por data e me enviar ate quinta?"

Pedido de Conexao:
"Voce poderia me dizer como se sente sobre o que acabei de falar?"

Pedido de Reflexao:
"O que voce entendeu do que eu disse?"

FORMULA COMPLETA DA CNV

Juntando os 4 componentes:

"Quando (OBSERVACAO), eu me sinto (SENTIMENTO) porque preciso de (NECESSIDADE). Voce poderia (PEDIDO)?"

EXEMPLOS COMPLETOS TRANSFORMADOS:

Situacao: Colaborador entrega relatorios atrasados

SEM CNV (Violenta):
"Voce e um irresponsavel! Sempre atrasa tudo! Se continuar assim vai ser demitido! Tenho que ficar no seu pe?"
Resultado: Defensividade, raiva, desmotivacao

COM CNV (Nao Violenta):
"Quando os relatorios chegam apos o prazo (OBSERVACAO), eu fico preocupado (SENTIMENTO) porque preciso dos dados para tomar decisoes a tempo (NECESSIDADE). Voce poderia me avisar com 2 dias de antecedencia se houver algum impedimento para cumprir o prazo? (PEDIDO)"
Resultado: Compreensao, dialogo, solucao colaborativa

Situacao: Colega te interrompe constantemente

SEM CNV:
"Voce e mal-educado! Nunca me deixa falar! Nao aguento mais voce!"

COM CNV:
"Quando sou interrompido antes de terminar meu raciocinio (OBSERVACAO), eu me sinto frustrado (SENTIMENTO) porque preciso de espaco para me expressar completamente (NECESSIDADE). Voce poderia me deixar terminar antes de comentar? (PEDIDO)"

EXERCICIOS PRATICOS

Exercicio 1: Identifique os 4 Componentes
Leia: "Quando voce nao me cumprimenta ao chegar, eu me sinto desrespeitado porque preciso de consideracao. Voce poderia me cumprimentar quando chegar?"

1. Observacao: _______________
2. Sentimento: _______________
3. Necessidade: ______________
4. Pedido: ___________________

Exercicio 2: Transforme em CNV
Situacao violenta: "Voce nunca ajuda ninguem! E muito egoista!"
Transforme usando os 4 componentes da CNV.

CONCLUSAO DO MODULO

A CNV e uma ferramenta poderosa que transforma conflitos em oportunidades de conexao. Ao separar observacao de julgamento, expressar sentimentos honestamente, identificar necessidades e fazer pedidos claros, criamos comunicacao construtiva.

Proximos Passos:
1. Pratique identificar julgamentos nas suas falas
2. Expresse pelo menos 1 sentimento real por dia
3. Identifique suas necessidades nao atendidas
4. Transforme 1 exigencia em pedido

Lembre-se: CNV e uma pratica, nao uma perfeicao. Seja gentil consigo mesmo no processo de aprendizado.
        `
      }
    ],
    atividadesPraticas: [
      "Transformacao de conflitos reais em CNV",
      "Role-play de conversas dificeis",
      "Diario de comunicacao consciente",
      "Pratica de escuta empatica",
      "Workshop de feedback nao violento"
    ]
  },
  {
    id: 4,
    slug: "gestao-riscos-psicossociais-saude-mental",
    titulo: "Gestao de Riscos Psicossociais e Saude Mental",
    subtitulo: "Identificacao, Prevencao e Intervencao em Saude Mental Ocupacional",
    descricao: "Reconheca sinais de estresse, burnout e outros transtornos mentais, aprenda a intervir adequadamente e crie ambientes de trabalho psicologicamente saudaveis.",
    duracao: "4h",
    nivel: "Intermediario",
    categoria: "Saude Ocupacional",
    icone: "🛡️",
    cor: "from-red-600 to-pink-600",
    corBadge: "bg-red-100 text-red-700 border-red-200",
    objetivo: "Capacitar lideres para reconhecer, prevenir e intervir em situacoes de risco a saude mental no trabalho.",
    resultadosEsperados: [
      "Identificacao precoce de sinais de adoecimento mental",
      "Reducao de afastamentos por transtornos mentais",
      "Criacao de ambiente de apoio e seguranca psicologica",
      "Gestao eficaz de situacoes de crise emocional"
    ],
    modulos: [
      {
        id: 1,
        titulo: "Principais Transtornos Mentais Relacionados ao Trabalho",
        duracao: "60 min",
        topicos: [
          "Estresse ocupacional cronico",
          "Sindrome de Burnout",
          "Transtornos de ansiedade",
          "Depressao ocupacional",
          "Transtorno de Estresse Pos-Traumatico",
          "Sinais de alerta e sintomas"
        ],
        materialDidatico: `
PRINCIPAIS TRANSTORNOS MENTAIS RELACIONADOS AO TRABALHO

PANORAMA DA SAUDE MENTAL OCUPACIONAL NO BRASIL

Dados Alarmantes (INSS 2023):
- 289.000 afastamentos por transtornos mentais em 2023
- Aumento de 38% em relacao a 2022
- 3a maior causa de afastamento do trabalho
- Custo de R$ 180 bilhoes/ano para economia brasileira

Principais Diagnosticos:
1. Depressao (41% dos casos)
2. Ansiedade (29% dos casos)
3. Burnout (18% dos casos)
4. TEPT - Transtorno de Estresse Pos-Traumatico (12% dos casos)

ESTRESSE OCUPACIONAL CRONICO

O que e:
Resposta prolongada do organismo a demandas excessivas do trabalho que excedem a capacidade de enfrentamento da pessoa.

Fases do Estresse (Modelo de Hans Selye):

Fase 1 - Alerta (Estresse Agudo - Normal):
Duracao: Minutos a horas
Sintomas: Aumento de energia, foco, adrenalina
Efeito: Positivo - melhora performance
Exemplo: Apresentacao importante, prazo apertado pontual

Fase 2 - Resistencia (Estresse Prolongado - Atencao):
Duracao: Dias a semanas
Sintomas: Cansaco, irritabilidade, dificuldade concentracao
Efeito: Neutro - organismo tenta se adaptar
Exemplo: Projeto longo com pressao constante

Fase 3 - Esgotamento (Estresse Cronico - PERIGO):
Duracao: Meses a anos
Sintomas: Exaustao extrema, doencas frequentes, desespero
Efeito: Negativo - adoecimento fisico e mental
Exemplo: Anos de sobrecarga sem recuperacao

Sinais Fisicos de Estresse Cronico:
- Dores de cabeca frequentes (tensionais)
- Problemas gastricos (gastrite, ulcera, colite)
- Tensao muscular constante (especialmente pescoco/ombros)
- Problemas cardiovasculares (hipertensao, arritmia)
- Queda de imunidade (gripes/resfriados constantes)
- Disturbios do sono (insonia ou sonolencia excessiva)
- Mudancas no apetite (comer demais ou perder apetite)

Sinais Emocionais:
- Irritabilidade constante
- Ansiedade persistente
- Dificuldade de concentracao
- Esquecimentos frequentes
- Sensacao de estar sobrecarregado
- Perda de interesse em atividades prazerosas
- Sentimento de estar preso ou sem saida

Sinais Comportamentais:
- Isolamento social
- Uso aumentado de alcool, tabaco ou outras substancias
- Procrastinacao
- Mudancas drasticas no comportamento
- Choro facil ou explosoes de raiva
- Negligencia com aparencia pessoal

SINDROME DE BURNOUT (CID-11: QD85)

Definicao da OMS:
Sindrome resultante de estresse cronico no local de trabalho que nao foi gerenciado com sucesso.

As 3 Dimensoes do Burnout:

1. Exaustao Emocional:
- Sentimento de estar emocionalmente esgotado
- Sem energia para o trabalho
- Drenado, vazio, sem nada mais para dar
Frase tipica: "Nao aguento mais"

2. Despersonalizacao/Cinismo:
- Distanciamento mental do trabalho
- Atitude cinica em relacao a tarefas e pessoas
- Perda de empatia
Frase tipica: "Tanto faz, nao me importo mais"

3. Baixa Realizacao Profissional:
- Sentimento de incompetencia
- Falta de produtividade e realizacao
- Questionamento sobre propria capacidade
Frase tipica: "Nao sirvo para isso, sou um fracasso"

Sinais de Alerta de Burnout:

Estagios do Burnout:

Estagio 1 - Necessidade de Se Provar:
- Ambicao excessiva
- Negligencia de necessidades pessoais
- Trabalho compulsivo

Estagio 2 - Intensificacao do Esforco:
- Incapacidade de desligar do trabalho
- Negligencia de amigos e familia
- Negacao de problemas

Estagio 3 - Descuido com Necessidades:
- Irregularidades no sono e alimentacao
- Falta de interacao social
- Uso de alcool/drogas para relaxar

Estagio 4 - Deslocamento de Conflitos:
- Consciencia de que algo esta errado
- Incapacidade de ver a causa real
- Crise de valores e sentido

Estagio 5 - Revisao de Valores:
- Negacao de necessidades basicas
- Foco obsessivo no trabalho
- Intolerancia

Estagio 6 - Negacao de Problemas:
- Cinismo crescente
- Agressividade
- Problemas fisicos evidentes

Estagio 7 - Retraimento:
- Desesperanca
- Desligamento social total
- Aversao ao trabalho

Estagio 8 - Mudancas Comportamentais Obvias:
- Mudancas drasticas de personalidade
- Amigos e familia notam diferenca marcante

Estagio 9 - Despersonalizacao:
- Perda do senso de si mesmo
- Vida em piloto automatico
- Vazio interior profundo

Estagio 10 - Vazio Interior:
- Sentimento de inutilidade total
- Pode incluir pensamentos suicidas
- NECESSITA INTERVENCAO PROFISSIONAL URGENTE

Diferencas entre Estresse e Burnout:

ESTRESSE:
- Superengajamento
- Emocoes hiperativas
- Perda de energia
- Ansiedade predominante
- Pode melhorar com ferias/descanso
- Ainda ha esperanca

BURNOUT:
- Desengajamento total
- Emocoes embotadas
- Perda de motivacao e esperanca
- Depressao predominante
- Ferias nao resolvem
- Desesperanca profunda

TRANSTORNOS DE ANSIEDADE

Tipos Comuns no Ambiente de Trabalho:

1. Transtorno de Ansiedade Generalizada (TAG):
Sintomas:
- Preocupacao excessiva e incontrolavel
- Tensao muscular constante
- Fadiga persistente
- Dificuldade de concentracao
- Irritabilidade
- Disturbios do sono

No Trabalho:
Preocupacao constante com desempenho, medo de cometer erros, incapacidade de relaxar mesmo apos expediente

2. Sindrome do Panico:
Sintomas:
- Ataques de panico repentinos
- Palpitacoes, suor, tremores
- Sensacao de morte iminente
- Medo de ter novos ataques
- Evitacao de situacoes

No Trabalho:
Ataques durante reunioes importantes, apresentacoes, confrontos. Pode levar a faltas e evitacao de situacoes profissionais.

3. Fobia Social:
Sintomas:
- Medo intenso de julgamento
- Evitacao de interacao social
- Sintomas fisicos em situacoes sociais
- Antecipacao ansiosa de eventos

No Trabalho:
Pavor de apresentacoes, reunioes, almocos de equipe. Pode limitar drasticamente carreira.

DEPRESSAO OCUPACIONAL

Diferenca entre Tristeza e Depressao:

TRISTEZA (Normal):
- Resposta proporcional a evento
- Melhora com tempo
- Nao impede funcionamento
- Momentos de alivio

DEPRESSAO (Clinica):
- Desproporcional ou sem motivo claro
- Persistente (mais de 2 semanas)
- Prejudica funcionamento diario
- Sem alivio ou prazer em nada

Criterios Diagnosticos (CID-10):

Sintomas Essenciais (pelo menos 2):
1. Humor deprimido na maior parte do dia
2. Perda de interesse ou prazer
3. Fadiga ou perda de energia

Sintomas Adicionais:
4. Perda de confianca ou autoestima
5. Sentimentos de culpa inadequada
6. Pensamentos de morte ou suicidio
7. Diminuicao da concentracao
8. Agitacao ou retardo psicomotor
9. Disturbios do sono
10. Mudanca no apetite/peso

Gravidade:
- Leve: 2 essenciais + 2 adicionais
- Moderada: 2 essenciais + 3-4 adicionais
- Grave: 3 essenciais + 4+ adicionais

Sinais de Depressao no Trabalho:
- Queda abrupta de produtividade
- Atrasos e faltas frequentes
- Descuido com aparencia
- Dificuldade de tomar decisoes
- Isolamento da equipe
- Comentarios negativos sobre si mesmo
- Choro no trabalho
- Expressao facial de tristeza constante

TRANSTORNO DE ESTRESSE POS-TRAUMATICO (TEPT)

O que e:
Transtorno que pode se desenvolver apos exposicao a evento traumatico grave.

Eventos Traumaticos no Trabalho:
- Assedio sexual ou moral severo
- Violencia fisica
- Ameacas graves
- Acidente grave
- Morte de colega
- Assalto ou sequestro
- Testemunhar tragedia

Sintomas Principais:

1. Revivencia (Flashbacks):
- Lembrancas intrusivas do trauma
- Pesadelos recorrentes
- Reacoes fisicas intensas a gatilhos

2. Evitacao:
- Evitar pensar ou falar sobre evento
- Evitar pessoas, lugares ou situacoes que lembrem
- Ausencia emocional (embotamento)

3. Hiperativacao:
- Estado de alerta constante
- Reacoes exageradas de susto
- Irritabilidade e explosoes de raiva
- Dificuldade de concentracao
- Insonia severa

Diferenca de Estresse Agudo:
- ESTRESSE AGUDO: 3 dias a 1 mes apos evento
- TEPT: Sintomas persistem por mais de 1 mes

COMO IDENTIFICAR SINAIS DE ALERTA NA EQUIPE

Sistema de Semaforo de Saude Mental:

VERDE - Funcionamento Saudavel:
- Produtividade consistente
- Bom humor geral
- Engajamento nas atividades
- Relacionamentos saudaveis
- Sono e alimentacao regulares
ACAO: Manter ambiente saudavel, reconhecer e valorizar

AMARELO - Sinais de Atencao:
- Pequenas mudancas de comportamento
- Cansaco mais frequente
- Irritabilidade ocasional
- Queda leve de produtividade
- Comentarios sobre estresse
ACAO: Conversa preventiva, oferecer apoio, ajustar demandas

LARANJA - Sinais de Risco Moderado:
- Mudancas comportamentais visiveis
- Multiplas faltas ou atrasos
- Isolamento da equipe
- Queda significativa de performance
- Sinais fisicos de estresse
ACAO: Conversa seria, encaminhamento ao RH/SESMT, ajuste de carga

VERMELHO - Risco Alto - Intervencao Urgente:
- Mudancas drasticas de personalidade
- Choro frequente no trabalho
- Mencao a desesperanca ou morte
- Negligencia total com trabalho/aparencia
- Afastamentos repetidos
ACAO: Intervencao imediata, acionar suporte profissional, nao deixar sozinho

EXERCICIOS PRATICOS

Exercicio 1: Identificacao de Sintomas
Colaborador antes pontual e alegre agora chega atrasado, esta com olheiras profundas, perdeu 5kg, chora facilmente e diz "nao sei se aguento mais isso". Qual transtorno voce suspeita e o que fazer?

Exercicio 2: Diferenciacao
Um colaborador reclama de cansaco e estresse. Como voce diferencia entre estresse normal, estresse cronico ou burnout?

CONCLUSAO DO MODULO

Reconhecer transtornos mentais relacionados ao trabalho nao e diagnosticar - e identificar sinais de alerta para buscar ajuda profissional adequada.

Como lider, voce nao e psicologo, mas pode salvar vidas ao perceber sinais precoces e agir com empatia e agilidade.

Proximos Passos:
1. Observe sua equipe com olhar atento
2. Crie espaco seguro para conversas
3. Conheca recursos de apoio disponiveis (PAE, SESMT)
4. Aja rapidamente em sinais de alerta

Lembre-se: Saude mental e tao importante quanto saude fisica. Trate com seriedade.
        `
      }
    ],
    atividadesPraticas: [
      "Analise de casos reais de adoecimento mental",
      "Simulacao de intervencao em crise",
      "Mapeamento de recursos de apoio",
      "Workshop de primeiros socorros psicologicos"
    ]
  },
  {
    id: 5,
    slug: "prevencao-assedio-moral-sexual",
    titulo: "Prevencao e Combate ao Assedio Moral e Sexual",
    subtitulo: "Compliance, Etica e Protecao Legal",
    descricao: "Compreenda as definicoes legais, aprenda a prevenir, identificar e agir adequadamente em casos de assedio moral e sexual conforme Lei 14.457/22.",
    duracao: "3h",
    nivel: "Intermediario",
    categoria: "Compliance e Etica",
    icone: "⚠️",
    cor: "from-orange-600 to-red-600",
    corBadge: "bg-orange-100 text-orange-700 border-orange-200",
    objetivo: "Capacitar lideres para prevenir, identificar e agir adequadamente em situacoes de assedio, garantindo ambiente de respeito e conformidade legal.",
    resultadosEsperados: [
      "Ambiente livre de assedio e discriminacao",
      "Reducao de processos trabalhistas",
      "Cultura de respeito e seguranca psicologica",
      "Conformidade com Lei 14.457/22"
    ],
    modulos: [
      {
        id: 1,
        titulo: "Definicoes Legais e Tipos de Assedio",
        duracao: "60 min",
        topicos: [
          "Assedio moral: definicao e caracterizacao",
          "Assedio sexual: definicao legal",
          "Diferenca entre conflito e assedio",
          "Tipos de assediadores",
          "Impactos nas vitimas e organizacao"
        ],
        materialDidatico: `
PREVENCAO E COMBATE AO ASSEDIO MORAL E SEXUAL

BASE LEGAL BRASILEIRA

Lei 14.457/2022 - Programa Emprega + Mulheres:
Torna obrigatoria a adocao de medidas de prevencao e combate ao assedio sexual e outras formas de violencia no ambito do trabalho.

Codigo Penal Brasileiro:
- Art. 216-A: Crime de Assedio Sexual (1 a 2 anos de reclusao)
- Art. 147: Crime de Ameaca
- Art. 140: Crime de Injuria
- Art. 146: Crime de Constrangimento Ilegal

CLT - Consolidacao das Leis do Trabalho:
- Art. 483: Rescisao indireta por rigor excessivo ou falta de higiene
- Justa causa para assediador

ASSEDIO MORAL - DEFINICAO E CARACTERIZACAO

O que e Assedio Moral:

Definicao Legal:
Exposicao de pessoas a situacoes humilhantes e constrangedoras de forma repetitiva e prolongada, no exercicio de suas atividades laborais, com o objetivo de desestabilizar emocional e profissionalmente a vitima.

Elementos Essenciais:

1. INTENCIONALIDADE:
Objetivo de prejudicar, humilhar ou forcar saida da vitima

2. REPETICAO:
Nao e ato isolado - sao condutas reiteradas
Minimo: 2-3 episodios ao longo de semanas/meses

3. DIRECIONALIDADE:
Foco em uma pessoa ou grupo especifico

4. DANO:
Causa sofrimento psiquico, moral ou fisico

5. ABUSO DE PODER:
Uso indevido de posicao hierarquica ou grupal

Formas de Assedio Moral:

1. ASSEDIO VERTICAL DESCENDENTE (mais comum - 75%):
Chefia contra subordinado

Exemplos:
- Humilhacao publica em reunioes
- Sobrecarga intencional de trabalho
- Estabelecer metas impossiveis
- Ignorar sistematicamente
- Retirar funcoes sem justificativa
- Ameacas veladas de demissao

Caso Real:
Gerente chamava funcionaria de "burra" e "incompetente" diariamente em frente a equipe. Resultado: Funcionaria desenvolveu depressao severa, afastou-se por 6 meses. Empresa condenada a pagar R$ 100.000 + estabilidade de 12 meses.

2. ASSEDIO VERTICAL ASCENDENTE (raro - 5%):
Subordinados contra chefia

Exemplos:
- Boicote sistematico a decisoes
- Desrespeito publico a autoridade
- Sabotagem de trabalho
- Difamacao organizada

3. ASSEDIO HORIZONTAL (20%):
Entre colegas de mesmo nivel

Exemplos:
- Fofocas e difamacao
- Isolamento proposital
- Bullying corporativo
- Sabotagem de trabalho de colega

Caso Real:
Grupo de 5 funcionarios isolou completamente uma colega nova: nao a cumprimentavam, excluiam de conversas, escondiam informacoes necessarias ao trabalho. Vitima desenvolveu ansiedade severa. Todos os 5 foram demitidos por justa causa.

4. ASSEDIO ORGANIZACIONAL (sistematico):
Praticas da propria empresa

Exemplos:
- Metas sistematicamente inatingiveis
- Pressao psicologica generalizada
- Jornadas exaustivas obrigatorias
- Politicas humilhantes (revista intima abusiva)
- Controle excessivo (ir ao banheiro)

Praticas que Configuram Assedio Moral:

COMUNICACAO ABUSIVA:
- Gritar, xingar, insultar
- Ameacas veladas ou diretas
- Criticas destrutivas publicas
- Ironias e sarcasmos constantes
- Recusar comunicacao (lei do gelo)

CONDICOES DE TRABALHO DEGRADANTES:
- Retirar instrumentos de trabalho
- Atribuir tarefas incompativeis com funcao
- Sobrecarregar intencionalmente
- Tirar todas as tarefas (ociosidade forcada)
- Local inadequado (sala sem ventilacao)

ISOLAMENTO E EXCLUSAO:
- Proibir colegas de falarem com vitima
- Excluir de reunioes importantes
- Nao repassar informacoes essenciais
- Transferencias punitivas constantes

ATAQUE A REPUTACAO:
- Espalhar boatos
- Ridicularizar publicamente
- Atribuir erros nao cometidos
- Questionar sanidade mental

O QUE NAO E ASSEDIO MORAL

E importante diferenciar assedio de gestao legitima:

NAO E ASSEDIO:
- Feedback negativo dado respeitosamente
- Cobranca de metas realisticas
- Mudanca de funcao por necessidade organizacional
- Advertencia ou suspensao justificada
- Conflito pontual entre colegas
- Decisao desfavoravel mas fundamentada

CONFLITO vs ASSEDIO:

CONFLITO:
- Pontual
- Bilateral (ambos confrontam)
- Pode ser resolvido com dialogo
- Sem intencao de destruir

ASSEDIO:
- Repetitivo
- Unilateral (vitima sofre)
- Dialogo nao resolve
- Intencao de prejudicar

ASSEDIO SEXUAL - DEFINICAO LEGAL

Codigo Penal - Art. 216-A:

"Constranger alguem com o intuito de obter vantagem ou favorecimento sexual, prevalecendo-se o agente de sua condicao de superior hierarquico ou ascendencia inerentes ao exercicio de emprego, cargo ou funcao."

Pena: 1 a 2 anos de reclusao

Elementos do Crime:

1. CONSTRANGIMENTO:
Acao que causa desconforto, vergonha, intimidacao

2. INTUITO SEXUAL:
Objetivo de obter favor ou vantagem sexual

3. PREVALENCIA:
Uso de posicao de poder (hierarquia ou influencia)

4. AMBIENTE DE TRABALHO:
Relacao decorrente de emprego, cargo ou funcao

Tipos de Assedio Sexual:

1. ASSEDIO POR CHANTAGEM (Quid Pro Quo):
Exigencia de favores sexuais em troca de beneficios ou para evitar prejuizos

Exemplos:
- "Se sair comigo, te promovo"
- "Se nao aceitar, vai ser demitida"
- "Preciso desse favor para aprovar suas ferias"

Gravidade: MAXIMA - Crime tipificado

2. ASSEDIO POR INTIMIDACAO (Ambiental):
Criacao de ambiente hostil atraves de insinuacoes, piadas ou gestos de cunho sexual

Exemplos:
- Comentarios sobre corpo ou aparencia
- Piadas sexuais constantes
- Mostrar conteudo pornografico
- Olhares insistentes e constrangedores
- Convites insistentes apos recusa

Gravidade: ALTA - Pode configurar assedio moral

Exemplos Praticos de Assedio Sexual:

OBVIAMENTE ASSEDIO:
- Toques nao consensuais
- Beijos forcados
- Convite para hotel
- Mostrar orgaos genitais
- Mensagens sexualmente explicitas
- Promessa de beneficio por sexo

ZONA CINZENTA (depende do contexto):
- Elogio a aparencia ("Esta bonita hoje")
  * OK se: Pontual, respeitoso, publico
  * ASSEDIO se: Constante, sobre corpo, em privado, apos recusa

- Convite para jantar
  * OK se: Profissional, primeira vez, aceita recusa
  * ASSEDIO se: Insistente apos recusa, conotacao sexual

- Piada com duplo sentido
  * OK se: Rara, contexto descontraido, sem alvo especifico
  * ASSEDIO se: Frequente, direcionada, ambiente de trabalho

NUNCA E ASSEDIO:
- Relacao consensual entre colegas de mesmo nivel
- Elogio profissional ("Excelente apresentacao")
- Convite respeitoso aceito voluntariamente

Diferencas de Percepcao:

O QUE QUEM ASSEDIA PENSA:
"E so brincadeira"
"Estou sendo galanteador"
"Ela gosta, so esta se fazendo"
"Nao tem maldade"

O QUE A VITIMA SENTE:
Desconforto, medo, nojo, humilhacao, impotencia, raiva

REGRA DE OURO:
Se a outra pessoa demonstra desconforto (verbal ou nao verbal), PARE IMEDIATAMENTE.

PERFIL DOS ASSEDIADORES

Tipos Comuns:

1. O PREDADOR CONSCIENTE:
- Sabe que esta assediando
- Age deliberadamente
- Abusa do poder
- Escolhe vitimas vulneraveis
- Repeate comportamento com multiplas pessoas

2. O INSENSIVEL CULTURAL:
- Acha normal pela criacao
- "Sempre foi assim"
- Nao percebe o dano
- Pode mudar se conscientizado

3. O NARCISISTA:
- Se acha irresistivel
- Nao aceita rejeicao
- Ve recusa como desafio
- Falta de empatia

4. O VINGATIVO:
- Usa assedio como retaliacao
- Punicao por rejeicao
- Punicao por denuncia previa

IMPACTOS DO ASSEDIO

Impactos na Vitima:

SAUDE MENTAL:
- Ansiedade generalizada (87% das vitimas)
- Depressao (62%)
- Sindrome do panico (34%)
- TEPT (28%)
- Pensamentos suicidas (19%)

SAUDE FISICA:
- Disturbios do sono (92%)
- Problemas gastricos (68%)
- Hipertensao (45%)
- Dores cronicas (53%)

VIDA PROFISSIONAL:
- Queda de produtividade (100%)
- Faltas frequentes (78%)
- Pedido de demissao (45%)
- Afastamento por doenca (34%)

VIDA PESSOAL:
- Problemas nos relacionamentos (71%)
- Isolamento social (64%)
- Perda de autoestima (95%)

Impactos na Organizacao:

FINANCEIROS:
- Processos trabalhistas (R$ 50.000 a R$ 500.000)
- Afastamentos e substituicoes
- Turnover aumentado
- Perda de produtividade (20-40%)

REPUTACIONAIS:
- Imagem publica manchada
- Dificuldade de atrair talentos
- Perda de contratos
- Exposicao midiatica negativa

CULTURAIS:
- Clima organizacional toxico
- Perda de engajamento
- Cultura de medo
- Queda na inovacao

EXERCICIOS PRATICOS

Exercicio 1: Identifique
Caso: Gerente elogia aparencia fisica de funcionaria diariamente, faz comentarios sobre roupa, convida para jantar semanalmente mesmo apos 5 recusas. E assedio? Que tipo?

Exercicio 2: Acao do Lider
Voce descobre que um colaborador seu esta assediando moralmente outro. O que fazer? Liste 5 acoes imediatas.

CONCLUSAO DO MODULO

Assedio moral e sexual sao crimes graves que destroem vidas e organizacoes. Como lider, voce tem responsabilidade legal e moral de prevenir e combater.

Proximos Passos:
1. Conheca a politica de prevencao da empresa
2. Reflita sobre proprias condutas
3. Observe comportamentos na equipe
4. Esteja preparado para agir rapidamente

Lembre-se: Tolerancia zero com assedio. Uma cultura de respeito comeca com voce.
        `
      }
    ],
    atividadesPraticas: [
      "Analise de casos juridicos reais",
      "Simulacao de investigacao de assedio",
      "Workshop de comunicacao respeitosa",
      "Criacao de politica de prevencao"
    ]
  },
  {
    id: 6,
    slug: "gestao-estresse-qualidade-vida",
    titulo: "Gestao do Estresse e Qualidade de Vida no Trabalho",
    subtitulo: "Autocuidado, Resiliencia e Bem-Estar Sustentavel",
    descricao: "Promova autocuidado, desenvolva resiliencia e crie estrategias para prevenir o esgotamento profissional e melhorar qualidade de vida.",
    duracao: "3h",
    nivel: "Iniciante",
    categoria: "Bem-Estar",
    icone: "🌱",
    cor: "from-emerald-600 to-green-600",
    corBadge: "bg-emerald-100 text-emerald-700 border-emerald-200",
    objetivo: "Desenvolver praticas de autocuidado e gestao de estresse para manter equilibrio entre vida pessoal e profissional.",
    resultadosEsperados: [
      "Reducao de niveis de estresse pessoal e da equipe",
      "Melhoria na qualidade de vida e bem-estar",
      "Aumento de resiliencia e capacidade de recuperacao",
      "Prevencao de burnout e adoecimento"
    ],
    modulos: [
      {
        id: 1,
        titulo: "Fundamentos da Qualidade de Vida no Trabalho",
        duracao: "60 min",
        topicos: [
          "O que e QVT - Qualidade de Vida no Trabalho",
          "Dimensoes do bem-estar",
          "Equilibrio vida-trabalho",
          "Tecnicas de autocuidado",
          "Construindo resiliencia"
        ],
        materialDidatico: `
GESTAO DO ESTRESSE E QUALIDADE DE VIDA NO TRABALHO

O QUE E QUALIDADE DE VIDA NO TRABALHO (QVT)

Definicao:
Conjunto de acoes de uma empresa que visa melhorar as condicoes de trabalho, buscando o bem-estar fisico, psicologico e social dos colaboradores.

Conceito Moderno de QVT:
Nao e apenas beneficios materiais (vale-refeicao, plano de saude). E criar um ambiente onde as pessoas possam prosperar em todas as dimensoes da vida.

Origem do Conceito:
Anos 1950 - Eric Trist e colaboradores
Objetivo inicial: Melhorar produtividade atraves do bem-estar
Descoberta: Pessoas felizes sao naturalmente mais produtivas

AS 8 DIMENSOES DO BEM-ESTAR (Modelo de Walton)

1. COMPENSACAO JUSTA E ADEQUADA:
- Salario compativel com mercado
- Equidade interna (pessoas com mesma funcao ganham similar)
- Beneficios adequados
- Participacao nos lucros/resultados

Impacto quando ausente:
Sensacao de injustica, desmotivacao, alta rotatividade

2. CONDICOES DE TRABALHO:
- Ambiente fisico adequado (iluminacao, temperatura, ergonomia)
- Jornada razoavel (sem horas extras excessivas)
- Pausas regulares
- Equipamentos adequados
- Seguranca fisica e psicologica

Impacto quando ausente:
Fadiga, doencas ocupacionais, acidentes, estresse

3. USO E DESENVOLVIMENTO DE CAPACIDADES:
- Trabalho que usa habilidades do colaborador
- Autonomia para tomar decisoes
- Variedade de tarefas (nao monotonia)
- Feedback sobre desempenho
- Visibilidade do resultado do trabalho

Impacto quando ausente:
Tedio, subaproveitamento, frustracao, perda de sentido

4. OPORTUNIDADE DE CRESCIMENTO:
- Plano de carreira claro
- Treinamentos e desenvolvimento
- Oportunidades de promocao
- Aprendizado continuo

Impacto quando ausente:
Estagnacao, desmotivacao, busca de outras empresas

5. INTEGRACAO SOCIAL:
- Ausencia de preconceitos (raca, genero, idade, etc)
- Bom relacionamento com colegas
- Senso de comunidade
- Apoio mutuo
- Ausencia de hierarquia rigida

Impacto quando ausente:
Isolamento, conflitos, discriminacao, clima toxico

6. CONSTITUCIONALISMO (DIREITOS):
- Respeito a direitos trabalhistas
- Privacidade pessoal
- Liberdade de expressao
- Tratamento justo
- Normas claras

Impacto quando ausente:
Sensacao de abuso, inseguranca juridica, medo

7. TRABALHO E ESPACO TOTAL DE VIDA:
- Equilibrio entre vida pessoal e profissional
- Flexibilidade de horarios quando possivel
- Respeito ao tempo pessoal
- Tempo para familia e lazer

Impacto quando ausente:
Esgotamento, conflitos familiares, perda de qualidade de vida

8. RELEVANCIA SOCIAL:
- Orgulho da empresa e do trabalho
- Responsabilidade social da organizacao
- Imagem externa positiva
- Produto/servico util para sociedade

Impacto quando ausente:
Vergonha do trabalho, falta de proposito, cinismo

EQUILIBRIO VIDA-TRABALHO (WORK-LIFE BALANCE)

O Mito do Equilibrio Perfeito:

Nao existe divisao 50-50 todos os dias. Equilibrio e dinamico:
- Alguns dias o trabalho demanda mais
- Outros dias a vida pessoal precisa de atencao
- O importante e a media ao longo de semanas/meses

Sinais de Desequilibrio Vida-Trabalho:

TRABALHO DOMINA VIDA:
- Trabalha mais de 50h/semana regularmente
- Leva trabalho para casa todo dia
- Pensa no trabalho 24h
- Nao tem hobbies ou vida social
- Relacionamentos familiares sofrem
- Saude fisica deteriora
- Ferias geram ansiedade

CONSEQUENCIAS:
Burnout, divorcio, alienacao dos filhos, doencas, morte precoce

Caso Real:
Executivo trabalhava 80h/semana por 10 anos. Aos 42, infarto. Sobreviveu mas ficou com sequelas. Perdeu casamento. Filhos adultos nao falavam com ele. Reflexao: "Construi imperio mas destrui minha vida."

Estrategias para Equilibrio:

1. ESTABELECER LIMITES CLAROS:
- Definir horario de desligar (ex: 18h)
- Desligar notificacoes de trabalho apos expediente
- Nao ler emails no fim de semana
- Comunicar limites a equipe e chefia

2. PRIORIZAR O QUE IMPORTA:
- Familia e saude vem antes de tudo
- Pergunte: "No meu leito de morte, vou me arrepender de nao ter trabalhado mais?"
- Ninguem no funeral diz: "Gostaria que ele tivesse passado mais tempo no escritorio"

3. USAR TECNOLOGIA A SEU FAVOR:
- Automatizar tarefas repetitivas
- Usar agenda para bloquear tempo pessoal
- Apps de produtividade
- MAS: Desligar tecnologia em momentos pessoais

4. NEGOCIAR FLEXIBILIDADE:
- Home office quando possivel
- Horarios flex

iveis
- Jornada comprimida (4 dias de 10h)

5. MICRO-MOMENTOS DE QUALIDADE:
Se nao pode ter 4 horas, tenha 30 minutos de qualidade total:
- Jantar SEM celular com familia
- 20 min brincando com filhos (presente 100%)
- 15 min caminhada ao ar livre

TECNICAS DE AUTOCUIDADO

Pilares do Autocuidado:

1. FISICO:
- Sono: 7-9h por noite, horarios regulares
- Alimentacao: 3 refeicoes saudaveis, evitar excesso de cafe/acucar
- Exercicio: 30min, 3-5x/semana minimo
- Hidratacao: 2-3 litros agua/dia
- Exames preventivos anuais

2. MENTAL:
- Pausas regulares no trabalho (5-10min cada 1h)
- Leitura por prazer
- Aprender algo novo (hobby)
- Limitar exposicao a noticias negativas
- Terapia preventiva

3. EMOCIONAL:
- Expressar emocoes saudavelmente
- Pedir ajuda quando precisar
- Cultivar relacionamentos positivos
- Perdoar (a si e aos outros)
- Gratidao diaria (listar 3 coisas boas)

4. SOCIAL:
- Tempo de qualidade com amigos/familia
- Participar de comunidades
- Voluntariado
- Dizer nao quando necessario
- Limites saudaveis

5. ESPIRITUAL/PROPOSITO:
- Reflexao sobre valores
- Conexao com proposito maior
- Meditacao ou oracao (se religioso)
- Contato com natureza
- Arte, musica, beleza

Praticas Diarias de Autocuidado (15-30min):

MANHA (10min):
- Acordar 15min antes
- Alongamento leve
- Respiracao profunda (5min)
- Definir intencao do dia

TARDE (5min):
- Pausa para lanche saudavel
- Caminhada breve
- Desconectar de telas

NOITE (15min):
- Jantar sem telas
- Ritual de descompressao
- Gratidao (3 coisas boas do dia)
- Leitura relaxante

CONSTRUINDO RESILIENCIA

O que e Resiliencia:
Capacidade de se adaptar bem diante de adversidades, traumas, tragedias, ameacas ou fontes significativas de estresse.

Resiliencia NAO e:
- Nunca sentir dor ou estresse
- Ser forte o tempo todo
- Fazer tudo sozinho
- Nao pedir ajuda

Resiliencia E:
- Dobrar sem quebrar
- Recuperar-se de quedas
- Aprender com dificuldades
- Pedir e aceitar apoio

Os 7 Pilares da Resiliencia:

1. AUTOCONHECIMENTO:
Conhecer proprios limites, gatilhos, valores

2. AUTORREGULACAO:
Gerenciar emocoes e impulsos

3. OTIMISMO REALISTA:
Esperanca fundamentada, nao negacao

4. EMPATIA:
Conectar-se com outros

5. EFICACIA PESSOAL:
Crenca na propria capacidade

6. FLEXIBILIDADE MENTAL:
Adaptar-se a mudancas

7. REDE DE APOIO:
Ter pessoas em quem confiar

Como Desenvolver Resiliencia:

1. REFORMULE ADVERSIDADES:
Pergunta Disempoderada: "Por que isso aconteceu comigo?"
Pergunta Empoderada: "O que posso aprender com isso?"

2. FOCO NO CONTROLAVEL:
- Nao pode controlar: Economia, decisoes de outros, passado
- Pode controlar: Suas acoes, reacoes, atitude

3. CUIDE DA SAUDE BASE:
Cerebro estressado, mal alimentado, sem sono = Sem resiliencia

4. CONSTRUA REDE DE APOIO:
Nao e fraqueza pedir ajuda. E inteligencia ter suporte.

5. PRATIQUE AUTOCOMPAIXAO:
Trate-se como trataria melhor amigo em dificuldade

EXERCICIOS PRATICOS

Exercicio 1: Avaliacao de Equilibrio
De 0-10, avalie sua satisfacao em:
- Trabalho: ___
- Familia: ___
- Saude: ___
- Amizades: ___
- Lazer: ___
- Proposito: ___

Areas com nota abaixo de 7 precisam de atencao.

Exercicio 2: Plano de Autocuidado
Liste 3 acoes concretas que voce fara esta semana em cada pilar:
- Fisico: ___
- Mental: ___
- Emocional: ___

Exercicio 3: Rede de Apoio
Liste 5 pessoas que voce pode pedir ajuda em momentos dificeis.
Se nao conseguiu listar 5, e hora de construir essa rede.

CONCLUSAO DO MODULO

Qualidade de vida no trabalho nao e luxo - e necessidade para sustentabilidade da vida e carreira.

Voce nao pode servir agua de um copo vazio. Cuide de voce PRIMEIRO para poder cuidar dos outros.

Proximos Passos:
1. Avalie seu equilibrio vida-trabalho
2. Implemente 1 pratica de autocuidado diaria
3. Estabeleca 1 limite saudavel esta semana
4. Fortaleça sua rede de apoio

Lembre-se: Sucesso sem saude e bem-estar nao e sucesso - e um caminho para o colapso.
        `
      }
    ],
    atividadesPraticas: [
      "Avaliacao de qualidade de vida pessoal",
      "Criacao de plano de autocuidado",
      "Pratica de tecnicas de relaxamento",
      "Workshop de gestao de tempo"
    ]
  },
  {
    id: 7,
    slug: "lideranca-humanizada-clima-organizacional",
    titulo: "Lideranca Humanizada e Clima Organizacional",
    subtitulo: "Criando Ambientes de Alta Performance e Bem-Estar",
    descricao: "Desenvolva habilidades de lideranca humanizada para criar clima organizacional saudavel, engajamento e alta performance sustentavel.",
    duracao: "3h",
    nivel: "Avancado",
    categoria: "Lideranca",
    icone: "👥",
    cor: "from-indigo-600 to-purple-600",
    corBadge: "bg-indigo-100 text-indigo-700 border-indigo-200",
    objetivo: "Capacitar lideres a criar ambientes de trabalho humanizados que promovam engajamento, bem-estar e resultados sustentaveis.",
    resultadosEsperados: [
      "Melhoria significativa no clima organizacional",
      "Aumento do engajamento e retencao de talentos",
      "Cultura de confianca e seguranca psicologica",
      "Resultados sustentaveis com equipes saudaveis"
    ],
    modulos: [
      {
        id: 1,
        titulo: "Principios da Lideranca Humanizada",
        duracao: "60 min",
        topicos: [
          "O que e lideranca humanizada",
          "Diferenca entre gestao e lideranca",
          "Seguranca psicologica",
          "Lideranca servidora",
          "Impacto do lider no clima"
        ],
        materialDidatico: `
LIDERANCA HUMANIZADA E CLIMA ORGANIZACIONAL

O QUE E LIDERANCA HUMANIZADA

Definicao:
Estilo de lideranca que coloca o ser humano no centro das decisoes, reconhecendo colaboradores como pessoas integrais (nao apenas recursos), valorizando bem-estar, desenvolvimento e proposito alem de resultados financeiros.

Principios Fundamentais:

1. PESSOAS EM PRIMEIRO LUGAR:
Pessoas nao sao meios para resultados - sao o fim em si mesmas
Cuidar das pessoas GERA resultados, nao e incompativel com eles

2. EMPATIA GENUINA:
Interesse real pelo bem-estar do outro
Compreender desafios pessoais e profissionais

3. VULNERABILIDADE:
Lider humanizado admite erros, pede ajuda, mostra humanidade
Isso cria conexao, nao fraqueza

4. PROPOSITO E SIGNIFICADO:
Conectar trabalho a algo maior que numeros
Dar sentido ao que as pessoas fazem

5. DESENVOLVIMENTO INTEGRAL:
Investir no crescimento profissional E pessoal
Apoiar vida toda, nao so carreira

DIFERENCA ENTRE GESTAO E LIDERANCA

GESTAO (Administrar):
- Foco em processos e sistemas
- Planejamento e organizacao
- Controle e monitoramento
- Eficiencia operacional
- Cumprimento de metas
- Visao de curto prazo

LIDERANCA (Inspirar):
- Foco em pessoas e relacoes
- Visao e direcao
- Inspiracao e motivacao
- Desenvolvimento humano
- Transformacao cultural
- Visao de longo prazo

Analogia:
GESTOR = Piloto do navio (garante que funcione)
LIDER = Capitao (define para onde vai e inspira tripulacao)

O Ideal: Ser AMBOS
Gerenciar bem E liderar com proposito

Evolucao da Lideranca:

LIDERANCA 1.0 - Autoritaria (ate anos 1950):
"Faca porque eu mando"
- Comando e controle
- Hierarquia rigida
- Medo como motivador
Resultado: Obediencia, nao engajamento

LIDERANCA 2.0 - Transacional (anos 1960-1990):
"Faca que eu te pago"
- Troca: Trabalho por salario
- Premios e punicoes
- Foco em metas
Resultado: Performance, mas sem paixao

LIDERANCA 3.0 - Transformacional (anos 2000):
"Faca porque acredita"
- Inspiracao
- Visao compartilhada
- Desenvolvimento
Resultado: Engajamento genuino

LIDERANCA 4.0 - Humanizada (atualmente):
"Vamos fazer juntos porque importa"
- Co-criacao
- Proposito
- Bem-estar integral
- Sustentabilidade
Resultado: Alta performance com saude

SEGURANCA PSICOLOGICA

Conceito (Amy Edmondson - Harvard):
Crenca compartilhada de que o ambiente e seguro para assumir riscos interpessoais. Pessoas se sentem confortaveis sendo elas mesmas, expressando ideias, admitindo erros e questionando status quo sem medo de humilhacao ou punicao.

Pesquisa Google - Projeto Aristoteles:
Google estudou 180 equipes por 2 anos para descobrir o que torna uma equipe excepcional.
Resultado surpreendente: NAO foi talento individual, experiencia ou recursos.
Foi SEGURANCA PSICOLOGICA - o fator #1

Elementos da Seguranca Psicologica:

1. PODE ERRAR SEM SER PUNIDO:
Ambiente: Erro e visto como aprendizado
Contrario: Cultura de culpa e medo

2. PODE FAZER PERGUNTAS:
Ambiente: Nao existe pergunta burra
Contrario: "Voce nao sabe isso ainda?"

3. PODE DISCORDAR:
Ambiente: Opinioes divergentes sao valorizadas
Contrario: "Aqui quem manda sou eu"

4. PODE SER VOCE MESMO:
Ambiente: Autenticidade e aceita
Contrario: Tem que usar mascara profissional

5. PODE PEDIR AJUDA:
Ambiente: Pedir ajuda e sinal de maturidade
Contrario: "Vira-te sozinho"

Como Criar Seguranca Psicologica:

1. MODELE VULNERABILIDADE:
Lider admite: "Nao sei, preciso de ajuda"
Lider compartilha: "Cometi esse erro e aprendi..."
Resultado: Time sente permissao para ser humano

2. CELEBRE ERRO COMO APRENDIZADO:
Quando alguem erra: "O que aprendemos com isso?"
NAO: "Quem e o culpado?"

3. ESCUTA ATIVA E CURIOSIDADE:
Faca perguntas genuinas
Ouça sem julgar ou interromper
Valorize perspectivas diferentes

4. AGRADEÇA DISCORDANCIA:
"Obrigado por trazer perspectiva diferente"
Cria cultura onde as pessoas falam a verdade

5. NAO TOLERE DESRESPEITO:
Seguranca psicologica NAO e vale-tudo
E respeito mutuo com espaço para ser real

Indicadores de Seguranca Psicologica Alta:

- Pessoas fazem perguntas livremente
- Erros sao reportados rapidamente
- Inovacao acontece (risco e permitido)
- Conflitos sao construtivos
- Feedback e bidirecional
- Pessoas sao autenticas
- Alta retencao de talentos

Indicadores de Seguranca Psicologica Baixa:

- Silencio em reunioes (medo de falar)
- Erros sao escondidos
- Inovacao estagnada
- Conflitos sao evitados ou destrutivos
- Feedback so desce
- Mascara profissional constante
- Turnover alto

LIDERANCA SERVIDORA (Servant Leadership)

Conceito (Robert Greenleaf):
Lider serve primeiro, lidera depois. Foco em atender necessidades da equipe para que ela prospere.

Inversao da Piramide Tradicional:

PIRAMIDE TRADICIONAL:
CEO no topo
Gerentes no meio
Funcionarios na base

PIRAMIDE INVERTIDA:
Clientes no topo
Funcionarios servem clientes
Lideres servem funcionarios

Filosofia: Lider remove obstaculos para equipe servir bem os clientes

Caracteristicas do Lider Servidor:

1. ESCUTA:
Compreende profundamente necessidades da equipe

2. EMPATIA:
Assume boa intencao, compreende perspectivas

3. CURA:
Ajuda pessoas a se recuperarem de feridas

4. CONSCIENTIZACAO:
Autoconhecimento e consciencia do entorno

5. PERSUASAO:
Convence, nao coage

6. CONCEITUALIZACAO:
Pensa alem do dia-a-dia, sonha grande

7. PREVISAO:
Antecipa consequencias de decisoes

8. MORDOMIA:
Cuida do que lhe foi confiado (pessoas, recursos)

9. COMPROMISSO COM CRESCIMENTO:
Investe no desenvolvimento de cada pessoa

10. CONSTRUCAO DE COMUNIDADE:
Cria senso de pertencimento

Perguntas que o Lider Servidor Faz:

- O que voce precisa de mim para ter sucesso?
- Que obstaculos posso remover para voce?
- Como posso apoiar seu desenvolvimento?
- Estou sendo um bom lider para voce?
- O que posso fazer diferente?

IMPACTO DO LIDER NO CLIMA ORGANIZACIONAL

Pesquisa Gallup:
70% da variacao no engajamento e explicada pelo gestor imediato
Pessoas nao saem de empresas - saem de chefes

Como o Lider Impacta o Clima:

1. MODELO DE COMPORTAMENTO:
Equipe copia o lider (para bem ou mal)
Lider estressado = Equipe estressada
Lider equilibrado = Equipe equilibrada

2. COMUNICACAO:
Transparencia gera confianca
Segredos geram paranoia

3. RECONHECIMENTO:
Reconhecer esforco = Motivacao
Ignorar esforco = Desmotivacao

4. GESTAO DE CONFLITOS:
Resolver rapido = Clima saudavel
Ignorar = Clima toxico

5. EQUIDADE:
Tratar todos com justica = Confianca
Favoritismo = Ressentimento

6. DESENVOLVIMENTO:
Investir nas pessoas = Lealdade
Explorar sem desenvolver = Turnover

Indicadores de Clima Organizacional:

POSITIVOS:
- Baixo absenteismo
- Baixo turnover
- Alta produtividade
- Inovacao constante
- Colaboracao natural
- Energia positiva visivel

NEGATIVOS:
- Faltas frequentes
- Rotatividade alta
- Produtividade baixa
- Resistencia a mudancas
- Silos e competicao interna
- Clima pesado, tensao visivel

EXERCICIOS PRATICOS

Exercicio 1: Auto-Avaliacao de Lideranca
De 0-10, como voce avalia sua lideranca em:
- Empatia: ___
- Vulnerabilidade: ___
- Desenvolvimento da equipe: ___
- Criacao de seguranca psicologica: ___
- Foco em bem-estar (nao apenas resultados): ___

Exercicio 2: Pesquisa de Clima Simples
Pergunte anonimamente a equipe:
1. Voce se sente seguro para expressar opiniao? (Sim/Nao)
2. Sente que seu trabalho tem proposito? (Sim/Nao)
3. Sente que eu, como lider, me importo com voce como pessoa? (Sim/Nao)

Se houver 1 "Nao", ha trabalho a fazer.

CONCLUSAO DO MODULO

Lideranca humanizada nao e ser bonzinho - e ser eficaz de forma sustentavel cuidando das pessoas.

Resultados extraordinarios vem de pessoas que se sentem valorizadas, seguras e inspiradas.

Proximos Passos:
1. Identifique 1 comportamento de lideranca para mudar
2. Tenha conversa vulneravel com sua equipe
3. Pergunte: "Como posso ser melhor lider para voce?"
4. Aja com base no feedback

Lembre-se: Pessoas nao se importam com quanto voce sabe ate saberem o quanto voce se importa.
        `
      }
    ],
    atividadesPraticas: [
      "Avaliacao 360 de lideranca",
      "Pesquisa de clima organizacional",
      "Criacao de plano de desenvolvimento de equipe",
      "Workshop de feedback bidirecional"
    ]
  },
  {
    id: 8,
    slug: "diversidade-inclusao-respeito",
    titulo: "Diversidade, Inclusao e Respeito nas Relacoes de Trabalho",
    subtitulo: "Construindo Ambientes Equitativos e Inclusivos",
    descricao: "Compreenda a importancia da diversidade, aprenda a promover inclusao genuina e crie ambiente de respeito onde todas as pessoas possam prosperar.",
    duracao: "3h",
    nivel: "Intermediario",
    categoria: "Diversidade e Inclusao",
    icone: "🌈",
    cor: "from-pink-600 to-rose-600",
    corBadge: "bg-pink-100 text-pink-700 border-pink-200",
    objetivo: "Desenvolver consciencia sobre diversidade e competencias para criar ambientes verdadeiramente inclusivos e respeitosos.",
    resultadosEsperados: [
      "Ambiente livre de discriminacao e preconceitos",
      "Cultura de inclusao e pertencimento",
      "Aproveitamento de beneficios da diversidade",
      "Conformidade com legislacao antidiscriminacao"
    ],
    modulos: [
      {
        id: 1,
        titulo: "Fundamentos de Diversidade e Inclusao",
        duracao: "60 min",
        topicos: [
          "Diferenca entre diversidade e inclusao",
          "Tipos de diversidade",
          "Beneficios da diversidade",
          "Vies inconsciente",
          "Microagressoes",
          "Criando cultura inclusiva"
        ],
        materialDidatico: `
DIVERSIDADE, INCLUSAO E RESPEITO NAS RELACOES DE TRABALHO

DIFERENCA ENTRE DIVERSIDADE E INCLUSAO

Definicoes:

DIVERSIDADE:
Presenca de diferencas em um grupo. E sobre CONVIDAR para a festa.
Exemplos: Idade, genero, raca, orientacao sexual, religiao, deficiencia, origem, classe social

INCLUSAO:
Garantir que todos se sintam valorizados, respeitados e tenham oportunidades iguais. E sobre CONVIDAR PARA DANCAR na festa.

Equidade:
Dar a cada pessoa o que ela precisa para ter as mesmas oportunidades. E sobre ajustar a musica para que todos possam dancar.

Analogia Poderosa:

DIVERSIDADE = Ser convidado para festa
INCLUSAO = Ser convidado para dancar
PERTENCIMENTO = Dancar a musica da sua alma

Exemplos Praticos:

Empresa DIVERSA mas NAO inclusiva:
- Contrata pessoas diversas
- MAS: Mulheres nao chegam a cargos de lideranca
- MAS: Pessoas negras sofrem microagressoes
- MAS: Pessoas LGBTQIA+ escondem identidade
- MAS: Pessoas com deficiencia sao subestimadas

Empresa DIVERSA E inclusiva:
- Contrata pessoas diversas
- E: Todas tem oportunidades iguais de crescimento
- E: Todos se sentem seguros sendo autenticos
- E: Diferentes perspectivas sao valorizadas
- E: Politicas e praticas consideram necessidades diversas

TIPOS DE DIVERSIDADE

1. DIVERSIDADE DEMOGRAFICA (Visivel):

Raca e Etnia:
- Pessoas brancas, negras, pardas, indigenas, asiaticas
- Importante: Brasil e pais racialmente desigual
- Pessoas negras = 56% populacao, mas 4% em cargos executivos

Genero:
- Mulheres, homens, pessoas nao-binarias
- Realidade: Mulheres ganham 20% menos que homens em mesma funcao
- Mulheres sao 50% populacao, mas 13% CEOs

Idade:
- Baby Boomers (1946-1964)
- Geracao X (1965-1980)
- Millennials (1981-1996)
- Geracao Z (1997-2012)
- Cada geracao tem perspectivas unicas

Deficiencia:
- Fisica, sensorial, intelectual, psicossocial
- 24% da populacao brasileira tem alguma deficiencia
- Importante: Acessibilidade e direito, nao favor

2. DIVERSIDADE COGNITIVA (Invisivel):

Personalidade:
- Introvertidos vs Extrovertidos
- Analiticos vs Criativos
- Detalhistas vs Visionarios

Neurodivergencia:
- Autismo, TDAH, Dislexia, etc
- Formas diferentes de processar informacao
- Perspectivas unicas valiosas

3. DIVERSIDADE DE EXPERIENCIA:

Origem Socioeconomica:
- Diferentes realidades financeiras
- Acesso desigual a oportunidades

Educacao:
- Diferentes niveis e tipos de formacao
- Educacao formal vs autodidata

Trajetoria Profissional:
- Diferentes industrias e funcoes
- Perspectivas variadas

4. DIVERSIDADE DE CRENCAS:

Religiao:
- Catolicos, evangelicos, espiritas, ateus, etc
- Respeito a todas as crencas (ou ausencia delas)

Valores:
- Diferentes priori dades na vida
- Importancia de respeitar sem impor

BENEFICIOS DA DIVERSIDADE

Dados Cientificos:

McKinsey & Company (2023):
- Empresas com diversidade de genero tem 21% mais chance de ter lucratividade acima da media
- Empresas com diversidade etnica tem 33% mais chance

Harvard Business Review:
- Equipes diversas tomam decisoes melhores em 87% dos casos
- Empresas inclusivas tem 2,3x mais fluxo de caixa por funcionario

Beneficios Concretos:

1. INOVACAO:
Perspectivas diferentes = Ideias diferentes
Exemplo: Equipe homogenea: 10 ideias similares
Equipe diversa: 30 ideias variadas

2. RESOLUCAO DE PROBLEMAS:
Angulos diferentes identificam solucoes que grupo homogeneo nao ve

3. CONEXAO COM CLIENTES:
Equipe diversa entende clientes diversos melhor

4. ATRACAO DE TALENTOS:
Millennials e Gen Z escolhem empresas inclusivas

5. REDUCAO DE RISCOS:
Perspectivas diversas identificam riscos que grupo similar nao viu

6. CLIMA ORGANIZACIONAL:
Ambiente inclusivo = Pessoas felizes = Performance

VIES INCONSCIENTE (Unconscious Bias)

O que e:
Atalhos mentais automaticos que nosso cerebro usa para processar informacoes rapidamente. Baseados em experiencias, cultura, midia.

Importante: TODO MUNDO TEM VIESES
Ter vies nao te faz pessoa ruim. AGIR com base nele sem questionar e o problema.

Tipos Comuns de Vieses:

1. VIES DE AFINIDADE:
Preferir pessoas similares a nos
Exemplo: Contratar quem estudou na mesma faculdade

2. VIES DE CONFIRMACAO:
Buscar informacoes que confirmam o que ja acreditamos
Exemplo: Achar que mulher e emocional, notar apenas momentos que confirmam

3. EFEITO HALO:
Uma caracteristica positiva contamina avaliacao geral
Exemplo: Pessoa bonita e assumida como competente

4. VIES DE GENERO:
Associacoes automaticas sobre homens e mulheres
Exemplos:
- Homem assertivo = Lider / Mulher assertiva = Mandona
- Homem ambicioso = Competente / Mulher ambiciosa = Calculista

5. VIES RACIAL:
Associacoes automaticas sobre racas
Exemplo: Assumir que pessoa negra e da area de apoio, nao executiva

6. VIES DE IDADE:
Estereotipos sobre geracoes
Exemplos:
- Jovem = Imaturo, sem compromisso
- Mais velho = Resistente a mudanca, tecnologicamente atrasado

Como Combater Vieses:

1. CONSCIENTIZACAO:
Reconhecer que voce TEM vieses
Teste de viés implicito (Harvard): https://implicit.harvard.edu

2. PAUSAR ANTES DE JULGAR:
"Por que pensei isso? E baseado em fato ou estereotipo?"

3. BUSCAR CONTRA-EVIDENCIAS:
Procurar ativamente informacoes que desafiem sua primeira impressao

4. DIVERSIFICAR EXPOSICAO:
Conviver com pessoas diferentes expande perspectiva

5. PROCESSOS OBJETIVOS:
Usar criterios claros em contratacao e promocao

MICROAGRESSOES

O que sao:
Comentarios ou acoes cotidianas, geralmente nao intencionais, que comunicam mensagens hostis ou depreciativas para grupos marginalizados.

Caracteristicas:
- Frequentes e acumulativas
- Pequenas individualmente, devastadoras no conjunto
- Muitas vezes inconscientes de quem faz
- Extremamente dolorosas para quem recebe

Exemplos de Microagressoes:

Raciais:
- "Voce fala tao bem!" (pressupoe que pessoa negra nao falaria bem)
- Tocar cabelo de pessoa negra sem permissao
- "De onde voce e REALMENTE?" (questionar pertencimento)
- Segurar bolsa perto de pessoa negra

Genero:
- "Voce e muito emocional" (para mulheres)
- "Voce ajuda sua esposa em casa?" (pressupoe que casa e trabalho dela)
- Interromper mulheres constantemente
- "Nao e brincadeira, voce e bonita E inteligente"

Orientacao Sexual:
- "Mas voce nao parece gay"
- "Quem e o homem na relacao?"
- Assumir que todos sao heterossexuais

Deficiencia:
- "Nossa, voce e tao inspirador!" (por fazer coisas normais)
- Falar alto com pessoa cega (confundir deficiencias)
- "Deixa que eu faco isso pra voce" (sem perguntar se precisa ajuda)

Idade:
- "Voce e muito novo pra esse cargo"
- "Vou explicar bem devagar" (para pessoa mais velha)

Como Nao Cometer Microagressoes:

1. PENSE ANTES DE FALAR:
Esse comentario seria OK se fosse sobre mim?

2. NAO ASSUMA:
Nao presuma orientacao sexual, genero, capacidades

3. TRATE TODOS COMO INDIVIDUOS:
Nao como representantes de um grupo

4. ACEITE FEEDBACK:
Se alguem diz que algo doeu, acredite

5. DESCULPE-SE:
"Desculpa, nao foi minha intencao machucar. Vou fazer diferente."

CRIANDO CULTURA INCLUSIVA

Pilares da Cultura Inclusiva:

1. LIDERANCA COMPROMETIDA:
Lideres modelam comportamento inclusivo
Nao e RH que cria inclusao - e lideranca

2. POLITICAS CLARAS:
Codigo de conduta anti-discriminacao
Consequencias claras para violacoes

3. RECRUTAMENTO INCLUSIVO:
Vagas abertas a todos
Processo sem vieses
Diversidade em todas os niveis

4. DESENVOLVIMENTO EQUITATIVO:
Oportunidades iguais de crescimento
Mentoria e sponsorship para grupos sub-representados

5. AMBIENTE SEGURO:
Pessoas podem ser autenticas
Erros de inclusao sao oportunidades de aprendizado

6. CELEBRACAO DE DIFERENCAS:
Diferentes perspectivas sao valorizadas
Diversas datas comemorativas respeitadas

Praticas Inclusivas no Dia-a-Dia:

REUNIOES:
- Dar voz a todos (nao apenas quem fala mais alto)
- Creditar ideias a quem falou primeiro
- Criar espaco seguro para discordancia

COMUNICACAO:
- Linguagem inclusiva (evitar "pessoal/galera")
- Nao assumir genero (usar nome, nao "ele/ela")
- Acessibilidade (legendas, letras grandes)

ESPACOS FISICOS:
- Banheiros acessiveis e neutros
- Espacos de oracao/meditacao
- Rampas e elevadores
- Iluminacao e acustica adequadas

BENEFICIOS:
- Licenca parental (nao apenas maternidade)
- Horarios flexiveis (diferentes necessidades)
- Plano de saude inclusivo
- PAE com foco em diversidade

EXERCICIOS PRATICOS

Exercicio 1: Mapeamento de Diversidade
Olhe para sua equipe:
- Quantos homens vs mulheres?
- Quantas pessoas negras em cargos de lideranca?
- Quantas pessoas com deficiencia?
- Diversidade etaria?

Se sua equipe e homogenea, por que? Como mudar?

Exercicio 2: Identificando Vieses
Complete rapido:
- Lider born e ___
- Enfermeiro e ___
- Engenheiro e ___

Se respondeu "homem", "mulher", "homem" - vies de genero apareceu.

Exercicio 3: Auditoria de Inclusao
- Alguem ja escondeu identidade no trabalho?
- Alguem ja se sentiu excluido?
- Todas as vozes sao ouvidas nas reunioes?
- Piadas sobre grupos sao toleradas?

Se sim para ultimas 3 perguntas, ha trabalho a fazer.

CONCLUSAO DO MODULO

Diversidade e fato. Inclusao e escolha.

Ambientes verdadeiramente inclusivos nao acontecem por acaso - sao construidos intencionalmente todos os dias.

Como lider, voce tem poder de criar espaco onde todas as pessoas possam prosperar sendo plenamente quem sao.

Proximos Passos:
1. Faca teste de vies implicito (Harvard)
2. Identifique 1 vies seu para trabalhar
3. Tenha conversa sobre inclusao com equipe
4. Implemente 1 pratica inclusiva esta semana

Lembre-se: Inclusao nao e favor - e justica. E nao e apenas certo moralmente, e estrategicamente inteligente.
        `
      }
    ],
    atividadesPraticas: [
      "Teste de vies implicito",
      "Auditoria de praticas inclusivas",
      "Workshop de linguagem inclusiva",
      "Criacao de plano de diversidade e inclusao"
    ]
  }
];

export const getCursoBySlug = (slug: string): Curso | undefined => {
  return cursos.find(curso => curso.slug === slug);
};

export const getAllCursos = (): Curso[] => {
  return cursos;
};
