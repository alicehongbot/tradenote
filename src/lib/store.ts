import { create } from 'zustand';
import { db, Trade } from './db';

interface TradeStore {
  trades: Trade[];
  addTrade: (trade: Omit<Trade, 'id' | 'createdAt'>) => Promise<void>;
  deleteTrade: (id: number) => Promise<void>;
  loadTrades: () => Promise<void>;
}

export const useTradeStore = create<TradeStore>((set) => ({
  trades: [],
  addTrade: async (trade) => {
    const newTrade = {
      ...trade,
      createdAt: new Date().toISOString(),
    };
    await db.trades.add(newTrade);
    const trades = await db.trades.toArray();
    set({ trades });
  },
  deleteTrade: async (id) => {
    await db.trades.delete(id);
    const trades = await db.trades.toArray();
    set({ trades });
  },
  loadTrades: async () => {
    const trades = await db.trades.toArray();
    set({ trades });
  },
}));