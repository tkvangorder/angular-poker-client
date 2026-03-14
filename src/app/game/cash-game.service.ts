import { Injectable } from '@angular/core';
import { PokerRestClient } from '../rest/poker-rest-client';
import { CashGameConfiguration, CashGameDetails, GameCriteria, GameStatus } from './game-models';
import { BehaviorSubject, Observable, tap } from 'rxjs';

const ACTIVE_STATUSES: GameStatus[] = ['SCHEDULED', 'SEATING', 'ACTIVE', 'BALANCING', 'PAUSED'];

@Injectable({
  providedIn: 'root',
})
export class CashGameService {
  private games$ = new BehaviorSubject<CashGameDetails[]>([]);
  private selectedGame$ = new BehaviorSubject<CashGameDetails | null>(null);

  constructor(private pokerClient: PokerRestClient) {}

  loadGames(includeCompleted = false): void {
    const criteria: GameCriteria = includeCompleted
      ? {}
      : { statuses: ACTIVE_STATUSES };
    this.pokerClient.searchGames(criteria).subscribe((games) => {
      this.games$.next(games);
      const selected = this.selectedGame$.value;
      if (selected && !games.find((g) => g.id === selected.id)) {
        this.selectedGame$.next(null);
      }
    });
  }

  getGames(): Observable<CashGameDetails[]> {
    return this.games$.asObservable();
  }

  selectGame(game: CashGameDetails | null): void {
    if (game) {
      this.pokerClient.getGame(game.id).subscribe((details) => {
        this.selectedGame$.next(details);
      });
    } else {
      this.selectedGame$.next(null);
    }
  }

  getSelectedGame(): Observable<CashGameDetails | null> {
    return this.selectedGame$.asObservable();
  }

  createGame(
    cashGameConfiguration: CashGameConfiguration
  ): Observable<CashGameDetails> {
    return this.pokerClient.createGame(cashGameConfiguration).pipe(
      tap(() => this.loadGames())
    );
  }

  registerForGame(gameId: string): Observable<CashGameDetails> {
    return this.pokerClient.registerForGame(gameId).pipe(
      tap((updatedGame) => this.updateGameState(updatedGame))
    );
  }

  unregisterFromGame(gameId: string): Observable<CashGameDetails> {
    return this.pokerClient.unregisterFromGame(gameId).pipe(
      tap((updatedGame) => this.updateGameState(updatedGame))
    );
  }

  private updateGameState(updatedGame: CashGameDetails): void {
    // Update the game in the games list
    const games = this.games$.value.map((g) =>
      g.id === updatedGame.id ? updatedGame : g
    );
    this.games$.next(games);

    // Update the selected game if it matches
    if (this.selectedGame$.value?.id === updatedGame.id) {
      this.selectedGame$.next(updatedGame);
    }
  }
}
