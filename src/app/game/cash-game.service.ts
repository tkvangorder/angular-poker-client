import { Injectable } from '@angular/core';
import { PokerRestClient } from '../rest/poker-rest-client';
import { CashGameConfiguration, CashGameDetails } from './game-models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CashGameService {
  constructor(private pokerClient: PokerRestClient) {}

  createGame(
    cashGameConfiguration: CashGameConfiguration
  ): Observable<CashGameDetails> {
    return this.pokerClient.createGame(cashGameConfiguration);
  }
}
