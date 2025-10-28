import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function generateChatResponse(
  message: string,
  chatHistory: ChatMessage[] = []
): Promise<string> {
  try {
    console.log('🤖 [CHATBOT] Processando mensagem do usuário...');

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.9,
        maxOutputTokens: 2048,
      },
    });

    const contextPrompt = `
Você é um assistente virtual inteligente e prestativo de uma plataforma de saúde mental e bem-estar organizacional.

SUAS CAPACIDADES:
- Responder dúvidas sobre testes psicológicos (Karasek-Siegrist, Estresse Ocupacional, Clima Organizacional, etc.)
- Explicar conceitos de saúde mental no trabalho
- Orientar sobre como usar a plataforma
- Fornecer informações sobre gestão de riscos psicossociais
- Ajudar com interpretação de resultados
- Dar suporte geral aos usuários

DIRETRIZES:
- Seja empático, claro e objetivo
- Use linguagem acessível, evitando termos muito técnicos quando possível
- Se não souber algo, seja honesto e sugira onde buscar mais informações
- Sempre incentive o bem-estar e a saúde mental
- Não forneça diagnósticos médicos - recomende buscar profissionais qualificados quando apropriado
- Mantenha um tom amigável mas profissional

HISTÓRICO DA CONVERSA:
${chatHistory.map(msg => `${msg.role === 'user' ? 'Usuário' : 'Assistente'}: ${msg.content}`).join('\n')}

PERGUNTA ATUAL DO USUÁRIO:
${message}

Responda de forma natural, útil e contextualizada:`;

    const result = await model.generateContent(contextPrompt);
    const response = result.response;
    const responseText = response.text();

    console.log('✅ [CHATBOT] Resposta gerada com sucesso');
    return responseText;

  } catch (error) {
    console.error('❌ [CHATBOT] Erro ao gerar resposta:', error);
    
    return 'Desculpe, estou tendo dificuldades técnicas no momento. Por favor, tente novamente em alguns instantes ou reformule sua pergunta.';
  }
}

export async function generateWelcomeMessage(): Promise<string> {
  return `Olá! 👋 Sou seu assistente virtual de bem-estar e saúde mental no trabalho.

Como posso ajudar você hoje? Posso responder dúvidas sobre:

• 📊 Testes psicológicos disponíveis
• 🧠 Saúde mental e bem-estar
• 📈 Interpretação de resultados
• 🔧 Como usar a plataforma
• ⚖️ Gestão de riscos psicossociais

Fique à vontade para fazer qualquer pergunta!`;
}
