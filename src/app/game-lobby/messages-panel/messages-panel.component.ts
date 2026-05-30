import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientGameMessage, UserMessageEvent } from '../../game/game-events';

@Component({
  selector: 'app-messages-panel',
  imports: [CommonModule],
  templateUrl: './messages-panel.component.html',
})
export class MessagesPanelComponent {
  @Input() messages: (ClientGameMessage | UserMessageEvent)[] = [];

  getMessageClass(msg: ClientGameMessage | UserMessageEvent): string {
    if (msg.eventType === 'user-message') {
      switch (msg.severity) {
        case 'ERROR': return 'text-error';
        case 'WARNING': return 'text-warning';
      }
    }
    return '';
  }
}
