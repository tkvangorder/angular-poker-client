import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameMessageEvent, UserMessageEvent } from '../../game/game-events';

@Component({
  selector: 'app-messages-panel',
  imports: [CommonModule],
  templateUrl: './messages-panel.component.html',
})
export class MessagesPanelComponent {
  @Input() messages: (GameMessageEvent | UserMessageEvent)[] = [];
}
