import type { Request, Response } from 'express';
import * as OllamaService from '../services/ollama.service.js';

export const handleChat = async (req: Request, req_res: Response) => {
  try {
    const { message } = req.body;
    if (!message) {
      return req_res.status(400).json({ error: "Le message est vide" });
    }
    const aiResponse = await OllamaService.askQuestion(message);
    req_res.json({ response: aiResponse });
  } catch (error: any) {
    req_res.status(500).json({ error: error.message });
  }
};