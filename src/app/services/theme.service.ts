import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private currentTheme: string = 'light';
  private darkMode: boolean = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.applyTheme();
  }

  setTheme(theme: string): void {
    this.currentTheme = theme;
    this.applyTheme();
  }

  toggleDarkMode(): void {
    this.darkMode = !this.darkMode;
    this.applyTheme();
  }

  private applyTheme(): void {
    if (isPlatformBrowser(this.platformId)) {
      console.log('Applying theme:', this.currentTheme); // Debugging
      const body = document.body;
      body.classList.remove('light-theme', 'dark-theme', 'deep-teal', 'lemon-yellow', 'bright-orange-red', 'vanilla', 'jet-black', 'pale-taupe', 'taupe-brown', 'fog-gray', 'cool-gray', 'steel-blue-gray', 'crimson-red', 'pale-yellow');
      body.classList.add(this.currentTheme);
    }
  }

  getCurrentTheme(): string {
    console.log('Current theme:', this.currentTheme); // Debugging
    return this.currentTheme;
  }

  isDarkMode(): boolean {
    return this.darkMode;
  }
}