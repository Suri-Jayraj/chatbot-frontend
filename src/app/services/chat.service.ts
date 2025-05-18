import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private readonly apiUrl = 'https://jayweb-hzdtdjcfgzfwfec4.canadacentral-01.azurewebsites.net/chat';
  private lastData = ''; // Track last processed data to find only new chunks

  sendMessage(message: string): Observable<string> {
    return new Observable((observer: Observer<string>) => {
      const xhr = new XMLHttpRequest();
      
      // Reset the lastData for new message
      this.lastData = '';

      xhr.open('POST', this.apiUrl, true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.responseType = 'text';

      xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status === 200) {
            observer.complete();
          } else {
            observer.error(xhr.statusText);
          }
        }
      };

      xhr.onprogress = () => {
        const currentData = xhr.responseText;
        
        // Only process new data since last time
        if (currentData.length > this.lastData.length) {
          // Extract only the new portion
          const newData = currentData.substring(this.lastData.length);
          
          // Split into SSE lines
          const lines = newData.split('\n');
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const content = line.slice(6); // Remove "data: " prefix but preserve whitespace
              if (content) {
                observer.next(content);
              }
            }
          }
          
          // Update last processed data
          this.lastData = currentData;
        }
      };

      xhr.send(JSON.stringify({ userInput: message, history: [] }));
    });
  }
}