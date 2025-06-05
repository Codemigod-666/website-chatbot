export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export interface Chat {
  _id?: string;
  messages: Message[];
  userId?: string;
  createdAt: Date;
  updatedAt: Date;
}