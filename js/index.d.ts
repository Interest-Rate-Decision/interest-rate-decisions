export type BankId = 'fed' | 'ecb' | 'boe' | 'boj' | 'boc' | 'rba' | 'rbnz' | 'snb' | 'norges' | 'riksbank';

export interface Options {
  /** a fetch to use instead of the global one */
  fetch?: typeof fetch;
  /** another address for the data (tests, a mirror) */
  base?: string;
}

export interface Rate {
  bank: BankId;
  name: string;
  rateName: string;
  /** per cent; the Fed's is the top of its target range */
  rate: number;
  /** the bottom of the Fed's range */
  rangeLow?: number;
  lastChange: string | null;
  nextDecision: string | null;
  page: string;
  history: string;
}

export interface Upcoming {
  bank: BankId;
  name: string;
  short: string;
  rateName: string;
  range: boolean;
  /** the announcement, ISO time in UTC */
  t: string;
  /** the time is an estimate (the Bank of Japan sets no fixed hour) */
  tentative: boolean;
  pressConference?: string;
  projections?: boolean;
  rateBefore: number | null;
  path?: string;
  page?: string;
}

export interface Decision {
  bank: BankId;
  bankName: string;
  time: string;
  date: string;
  /** per cent after the decision; null for the ECB before March 2015 */
  rate: number | null;
  changeBp: number | null;
}

export const BASE: string;
export const BANKS: BankId[];
export function getRates(opts?: Options): Promise<Rate[]>;
export function getRate(bank: BankId, opts?: Options): Promise<Rate>;
export function getUpcoming(bank?: BankId, opts?: Options): Promise<Upcoming[]>;
export function getNext(bank?: BankId, opts?: Options): Promise<Upcoming | null>;
export function getDecisions(bank?: BankId, opts?: Options): Promise<Decision[]>;
export function parseDecisions(csv: string): Decision[];
export function pageOf(bank: BankId): string;
