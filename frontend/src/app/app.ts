import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Menu } from '@shared/ui/menu/menu';
import { Footer } from './features/components/footer/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Menu, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected router = inject(Router);
}
