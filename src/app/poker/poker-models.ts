export type CardValueString =
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '10'
  | 'JACK'
  | 'QUEEN'
  | 'KING'
  | 'ACE';

export enum CardValue {
  TWO = '2',
  THREE = '3',
  FOUR = '4',
  FIVE = '5',
  SIX = '6',
  SEVEN = '7',
  EIGHT = '8',
  NINE = '9',
  TEN = '10',
  JACK = 'J',
  QUEEN = 'Q',
  KING = 'K',
  ACE = 'A',
}

export type CardSuitString = 'HEARTS' | 'DIAMONDS' | 'CLUBS' | 'SPADES';

export enum CardSuit {
  HEARTS = 'H',
  DIAMONDS = 'D',
  CLUBS = 'C',
  SPADES = 'S',
}

export interface Card {
  value: CardValue;
  suit: CardSuit;
}
