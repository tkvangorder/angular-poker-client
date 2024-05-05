import { Component, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { User } from '../user/user-models';
import { NavigationBarComponent } from "./navigation-bar/navigation-bar.component";
import { TitlePageComponent } from "./title-page/title-page.component";

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [RouterOutlet, NavigationBarComponent, TitlePageComponent]
})
export class AppComponent {
  user?: User = undefined;
}
