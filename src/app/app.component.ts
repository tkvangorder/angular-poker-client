import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationBarComponent } from './navigation-bar/navigation-bar.component';
import { TitlePageComponent } from './title-page/title-page.component';
import { CardComponent } from './poker/card/card.component';
import { GamePageComponent } from './game-page/game-page.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  imports: [
    RouterOutlet,
    NavigationBarComponent,
    TitlePageComponent,
    CardComponent,
    GamePageComponent,
  ],
})
export class AppComponent {}
