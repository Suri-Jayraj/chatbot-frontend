import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = 'https://localhost:7263/api/chat';

  constructor() {}

  sendMessage(message: string): Observable<string> {
    return new Observable(observer => {
      fetch(this.apiUrl, {
        method: 'POST', // ✅ Use POST instead of GET
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      }).then(response => {
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const reader = response.body?.getReader();
        if (!reader) throw new Error("Failed to get response body reader");

        const decoder = new TextDecoder();
        
        // Read the stream chunk by chunk
        const readStream = async () => {
          while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            observer.next(decoder.decode(value)); // Stream each chunk to UI
          }
          observer.complete();
        };

        readStream().catch(error => observer.error(error));
      }).catch(error => observer.error(error));
    });
  }
}
