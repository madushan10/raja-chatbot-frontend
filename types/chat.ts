import { Document } from 'langchain/document';

export type Message = {
  type: 'apiMessage' | 'userMessage' | 'finalMessage'|'productMessage'|'cardMessage';
  message: string;
  isStreaming?: boolean;
  sourceDocs?: Document[];
};
