
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const summarizeVideo = async (title: string, description: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Summarize this video content based on its title and description. 
                 Provide 3 key takeaways and a "vibe check".
                 Title: ${title}
                 Description: ${description}`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            keyTakeaways: { type: Type.ARRAY, items: { type: Type.STRING } },
            vibe: { type: Type.STRING }
          },
          required: ['summary', 'keyTakeaways', 'vibe']
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini summary error:", error);
    return null;
  }
};

export const semanticSearch = async (query: string, videos: any[]) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Given the following user query: "${query}", rank the most relevant videos from this list:
                 ${JSON.stringify(videos.map(v => ({ id: v.id, title: v.title })))}
                 Return an array of video IDs in order of relevance.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Semantic search error:", error);
    return videos.map(v => v.id);
  }
};

export const chatWithVideo = async (query: string, history: any[], videoContext: string) => {
  try {
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: `You are Nova, an AI assistant for the NovaTube platform. 
                            You are helping the user discuss a video with the following context: ${videoContext}. 
                            Be insightful, slightly futuristic, and helpful.`,
      }
    });
    
    // We simplified for the sake of the chat API requirements
    const result = await chat.sendMessage({ message: query });
    return result.text;
  } catch (error) {
    console.error("Chat error:", error);
    return "I'm having trouble connecting to my neural core. Try again in a moment.";
  }
};
