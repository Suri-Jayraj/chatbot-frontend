export interface ChatMessage {
    content: string;
    sender: 'user' | 'bot';
    timestamp: Date;
  }
  
  export interface ChatRequest {
    message: string;
  }
  
  export interface ChatResponse {
    response: string;
    model: string;
    created_At: string;
  }
  