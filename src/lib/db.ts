import Dexie, { Table } from 'dexie';

export interface Trade {
  id?: number;
  symbol: string;
  action: 'BUY' | 'SELL';
  shares: number;
  price: number;
  date: string;
  fees: number;
  tags: string[];
  emotion?: 'greedy' | 'fear' | 'calm' | 'excited';
  note?: string;
  createdAt: string;
}

export class TradeNoteDB extends Dexie {
  trades!: Table<Trade>;
  
  constructor() {
    super('TradeNoteDB');
    this.version(1).stores({
      trades: '++id, symbol, action, date, tags'
    });
  }
}

export const db = new TradeNoteDB();