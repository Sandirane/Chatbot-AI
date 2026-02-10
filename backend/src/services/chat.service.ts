import { prisma } from '../config/db.js';

export const saveMessage = async (conversationId: string | null, userId: string, content: string, role: 'user' | 'assistant') => {

  const convId = conversationId || (await prisma.conversation.create({
    data: { userId, title: content.substring(0, 30) }
  })).id;

  return await prisma.message.create({
    data: {
      content,
      role,
      conversationId: convId
    }
  });
};

export const getHistory = async (conversationId: string) => {
  return await prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: 'asc' }
  });
};