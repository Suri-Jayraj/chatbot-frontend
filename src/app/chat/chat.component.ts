import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { ChatMessage } from '../models/chat.model';
import { ThemeService } from '../services/theme.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

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
  userIcon = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80';

  @ViewChild('messageContainer') private messageContainer!: ElementRef;

  constructor(
    private chatService: ChatService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.messages.push({
      content: 'Hi there! How can I help you today?',
      sender: 'bot',
      timestamp: new Date()
    });
  }

  // Format message function to handle spaces and line breaks properly
  formatMessage(content: string): SafeHtml {
    if (!content) return '';

    // Split content into blocks
    const blocks = content.split('\n\n');
    
    const formattedBlocks = blocks.map(block => {
      // Code block with language
      if (block.startsWith('```')) {
        const match = block.match(/```(\w+)?\n?([\s\S]*?)```/);
        if (match) {
          const [_, lang, code] = match;
          return `
            <div class="code-wrapper">
              ${lang ? `<div class="code-language">${lang}</div>` : ''}
              <pre class="code-block"><code>${this.escapeHtml(code.trim())}</code></pre>
            </div>
          `;
        }
      }
      
      // Bullet points
      if (block.match(/^[-*•]\s/m)) {
        const items = block.split('\n')
          .filter(line => line.trim())
          .map(line => `<li>${line.replace(/^[-*•]\s/, '')}</li>`)
          .join('');
        return `<ul class="bullet-list">${items}</ul>`;
      }
      
      // Regular paragraph with inline code
      return `<p>${block.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')}</p>`;
    });

    return this.sanitizer.bypassSecurityTrustHtml(formattedBlocks.join('\n'));
  }

  private escapeHtml(text: string): string {
    const entities: { [key: string]: string } = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };
    return text.replace(/[&<>"']/g, char => entities[char]);
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

    // Initialize empty bot message
    const botMessage: ChatMessage = { 
      content: '', 
      sender: 'bot', 
      timestamp: new Date() 
    };
    this.messages.push(botMessage);

    // Stream chunks into the message
    this.chatService.sendMessage(userMessage).subscribe({
      next: (chunk) => {
        // Directly append the chunk without additional processing
        botMessage.content += chunk;
        this.scrollToBottom();
      },
      complete: () => {
        this.isLoading = false;
        this.scrollToBottom();
      },
      error: () => {
        botMessage.content = '⚠️ Error: Failed to receive response.';
        this.isLoading = false;
        this.scrollToBottom();
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