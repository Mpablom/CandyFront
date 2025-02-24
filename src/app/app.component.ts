import { Component, HostListener } from '@angular/core';
import { HomeComponent } from "./components/home/home.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HomeComponent],
  template: `<app-home></app-home>`,
  styleUrl: './app.component.css'
})
export class AppComponent {
  isBouncing = false;

  @HostListener('window:wheel', ['$event'])
  onScroll(event: WheelEvent) {
    if (this.isBouncing) return;

    const delta = event.deltaY;

    // Si intenta "desplazarse" hacia abajo sin scroll
    if (delta > 0) {
      this.triggerBounce();
    }
  }

  @HostListener('window:touchend', ['$event'])
  onTouchEnd() {
    this.triggerBounce();
  }

  triggerBounce() {
    this.isBouncing = true;
    document.body.classList.add('rebound-effect');

    setTimeout(() => {
      document.body.classList.remove('rebound-effect');
      this.isBouncing = false;
    }, 300); // Duración de la animación
  }
}
