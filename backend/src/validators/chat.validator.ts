import { z } from 'zod';

export const ChatSchema = z.object({
  message: z.string().min(1, "Le message ne peut pas être vide").max(2000, "Message trop long"),
  conversationId: z.string().uuid().optional(),
});

export type ChatInput = z.infer<typeof ChatSchema>;