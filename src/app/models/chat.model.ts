export interface ChatMessage {
    content: string;
    sender: 'user' | 'bot';
    timestamp: Date;
    type?: 'text' | 'code' | 'bullet-list';
  }
  
  export interface ChatRequest {
    message: string;
  }
  
  export interface ChatResponse {
    response: string;
    model: string;
    created_At: string;
  }
