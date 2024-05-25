import { Component } from '@angular/core';
import { UserService } from '../../user/user-service';

@Component({
  selector: 'app-navigation-bar',
  standalone: true,
  imports: [],
  templateUrl: './navigation-bar.component.html',
})
export class NavigationBarComponent {

  constructor(private userService: UserService) {    
  }

}
