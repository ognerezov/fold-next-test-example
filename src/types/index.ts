export interface User {
  id: string;
  email: string;
}

export interface Message {
  id: string;
  subject: string;
  recipient: string;
  content: string;
  isHtml: boolean;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface MessagesResponse {
  messages: Message[];
} 