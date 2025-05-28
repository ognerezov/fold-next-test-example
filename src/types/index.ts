export interface User {
  id: string;
  email: string;
}

export interface Content {
  text?: string;
  html?: string;
}

export interface Message {
  id: string;
  subject: string;
  recipient: string;
  content: Content;
}

export interface LoginResponse {
  user: User;
  token: string;
}
