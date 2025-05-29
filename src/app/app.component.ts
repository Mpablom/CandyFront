import { Component, HostListener } from '@angular/core';
import { HomeComponent } from './components/home/home.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HomeComponent],
  template: `<app-home></app-home>`,
  styleUrl: './app.component.css',
})
export class AppComponent {
  isBouncing = false;
}
