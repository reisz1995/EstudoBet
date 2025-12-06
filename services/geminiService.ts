
import { GoogleGenAI } from "@google/genai";
import { SportType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateStudyData = async (
  sport: SportType,
  homeTeam: string,
  awayTeam: string,
  league: string
) => {
  try {
    const model = 'gemini-2.5-flash';
    
    const prompt = `
      Atue como um analista de apostas profissional.
      Gere um estudo inicial para o jogo: ${homeTeam} vs ${awayTeam} (${league} - ${sport}).
      
      TAREFAS:
      1. Use o Google Search para encontrar notícias de última hora (lesões, suspensões, declarações, momento dos times) de HOJE ou ONTEM.
      2. Tente encontrar a URL de uma imagem (logo/escudo) PNG transparente ou JPG para o ${homeTeam} e para o ${awayTeam}. Preferência por links da Wikimedia ou sites oficiais estáveis.
      3. Sugira 2 a 3 mercados com valor esperado positivo baseados na forma recente e nas notícias encontradas.

      FORMATO DE RESPOSTA OBRIGATÓRIO:
      Retorne sua resposta APENAS como um JSON válido, sem blocos de código markdown (como \`\`\`json), seguindo estritamente esta estrutura:
      {
        "homeTeamLogo": "URL encontrada ou null",
        "awayTeamLogo": "URL encontrada ou null",
        "news": [
          "Fato relevante encontrado na busca 1",
          "Fato relevante encontrado na busca 2"
        ],
        "bets": [
          { 
            "market": "Nome do mercado (ex: Casa Vence)", 
            "odds": 1.90, 
            "reasoning": "Justificativa curta (max 10 palavras)" 
          }
        ]
      }
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: "Você é um assistente de 'Value Betting'. Seja crítico. Retorne estritamente JSON.",
      }
    });

    if (response.text) {
      let jsonString = response.text.trim();

      // Remove blocos de código markdown comuns
      if (jsonString.startsWith('```')) {
          jsonString = jsonString.replace(/^```(json)?/, '').replace(/```$/, '').trim();
      }

      try {
        return JSON.parse(jsonString);
      } catch (e) {
        // Fallback: Tenta extrair o objeto JSON do texto se o parse direto falhar
        const match = jsonString.match(/\{[\s\S]*\}/);
        if (match) {
          try {
            return JSON.parse(match[0]);
          } catch (e2) {
             console.error("Falha ao extrair JSON:", e2);
             return null;
          }
        }
        console.error("Erro ao parsear resposta da IA:", e);
        return null;
      }
    }
    return null;
  } catch (error) {
    console.error("Erro ao gerar estudo:", error);
    throw error;
  }
};
