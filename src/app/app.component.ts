import { Component } from '@angular/core';
import { ChatComponent } from './chat/chat.component';
import { CommonModule } from '@angular/common'; // Import CommonModule

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ChatComponent, CommonModule], // Use CommonModule here
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'my-chat-app';
}