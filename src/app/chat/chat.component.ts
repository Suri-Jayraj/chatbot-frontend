import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { ChatMessage } from '../models/chat.model';
import { ThemeService } from '../services/theme.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  messages: ChatMessage[] = [];
  newMessage: string = '';
  isLoading: boolean = false;
  darkMode: boolean = false; // Initialize darkMode property
  botIcon = 'https://ollama.com/public/ollama.png';
  userIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M399 384.2C376.9 345.8 335.4 320 288 320l-64 0c-47.4 0-88.9 25.8-111 64.2c35.2 39.2 86.2 63.8 143 63.8s107.8-24.7 143-63.8zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm256 16a72 72 0 1 0 0-144 72 72 0 1 0 0 144z"/></svg>'; // Placeholder for user icon

  @ViewChild('messageContainer') private messageContainer!: ElementRef;

  constructor(private chatService: ChatService, private themeService: ThemeService) { }

  ngOnInit(): void {
    this.messages.push({
      content: 'Hi there! How can I help you today?',
      sender: 'bot',
      timestamp: new Date()
    });
  }

  sendMessage(): void {
    if (!this.newMessage.trim()) return;
  
    const userMessage = this.newMessage;
    this.messages.push({
      content: userMessage,
      sender: 'user',
      timestamp: new Date()
    });
  
    this.newMessage = '';
    this.isLoading = true;
  
    let botMessage: ChatMessage = { content: '', sender: 'bot', timestamp: new Date() };
    this.messages.push(botMessage);
  
    this.chatService.sendMessage(userMessage).subscribe({
      next: (chunk) => {
        try {
          // ✅ Extract "response" from JSON chunks and append progressively
          const parsedData = JSON.parse(chunk);
          botMessage.content += parsedData.response; // Append response chunk as it arrives
        } catch (error) {
          console.error('Error parsing streamed chunk:', error);
        }
      },
      complete: () => {
        this.isLoading = false;
      },
      error: () => {
        botMessage.content = '⚠️ Error: Failed to receive response.';
        this.isLoading = false;
      }
    });
  }
  
  

  scrollToBottom(): void {
    setTimeout(() => {
      if (this.messageContainer) {
        this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
      }
    }, 50);
  }

  setTheme(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const theme = selectElement.value;
    document.body.setAttribute('data-theme', theme); // ✅ Apply theme
  }
  
 

  toggleDarkMode(): void {
    this.darkMode = !this.darkMode; // Toggle state
    const newTheme = this.darkMode ? 'dark' : 'light';
    document.body.setAttribute('data-theme', newTheme);
  }
  
}
