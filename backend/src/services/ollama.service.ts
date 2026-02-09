import { Ollama } from "ollama";

const ollama = new Ollama({
  host: process.env.OLLAMA_URL || "http://localhost:11434",
});

export const askQuestion = async (message: string) => {
  try {
    const response = await ollama.chat({
      model: "mistral",
      messages: [{ role: "user", content: message }],
    });
    return response.message.content;
  } catch (error) {
    console.error("Erreur Ollama Service:", error);
    throw new Error("Impossible de communiquer avec l'IA");
  }
};
