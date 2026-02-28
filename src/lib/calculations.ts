import { Trade } from './db';

export interface PortfolioStats {
  totalValue: number;
  totalCost: number;
  totalPnL: number;
  pnlPercent: number;
  winRate: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  avgWin: number;
  avgLoss: number;
  profitFactor: number;
  cashBalance: number;
}

export function calculateStats(trades: Trade[]): PortfolioStats {
  const closedTrades: { symbol: string; pnl: number }[] = [];
  const positions: Map<string, { shares: number; totalCost: number }> = new Map();
  let cashBalance = 0;

  // Sort trades by date
  const sortedTrades = [...trades].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  for (const trade of sortedTrades) {
    const amount = trade.price * trade.shares;
    const totalAmount = trade.action === 'BUY' ? amount + trade.fees : amount - trade.fees;

    if (trade.action === 'BUY') {
      cashBalance -= totalAmount;
      const pos = positions.get(trade.symbol) || { shares: 0, totalCost: 0 };
      positions.set(trade.symbol, {
        shares: pos.shares + trade.shares,
        totalCost: pos.totalCost + totalAmount,
      });
    } else {
      cashBalance += totalAmount;
      const pos = positions.get(trade.symbol);
      if (pos && pos.shares > 0) {
        const avgCost = pos.totalCost / pos.shares;
        const pnl = (trade.price - avgCost) * trade.shares - trade.fees;
        closedTrades.push({ symbol: trade.symbol, pnl });
        
        const remainingShares = pos.shares - trade.shares;
        if (remainingShares > 0) {
          positions.set(trade.symbol, {
            shares: remainingShares,
            totalCost: avgCost * remainingShares,
          });
        } else {
          positions.delete(trade.symbol);
        }
      }
    }
  }

  // Calculate current positions value
  let totalValue = cashBalance;
  let totalCost = 0;
  for (const [symbol, pos] of positions) {
    // Use last known price or avg cost
    const lastTrade = sortedTrades
      .filter(t => t.symbol === symbol)
      .pop();
    const currentPrice = lastTrade?.price || pos.totalCost / pos.shares;
    totalValue += currentPrice * pos.shares;
    totalCost += pos.totalCost;
  }

  const wins = closedTrades.filter(t => t.pnl > 0);
  const losses = closedTrades.filter(t => t.pnl < 0);
  const totalWin = wins.reduce((sum, t) => sum + t.pnl, 0);
  const totalLoss = Math.abs(losses.reduce((sum, t) => sum + t.pnl, 0));

  return {
    totalValue,
    totalCost,
    totalPnL: totalWin - totalLoss + (totalValue - totalCost - cashBalance),
    pnlPercent: totalCost > 0 ? ((totalValue - totalCost) / totalCost) * 100 : 0,
    winRate: closedTrades.length > 0 ? (wins.length / closedTrades.length) * 100 : 0,
    totalTrades: closedTrades.length,
    winningTrades: wins.length,
    losingTrades: losses.length,
    avgWin: wins.length > 0 ? totalWin / wins.length : 0,
    avgLoss: losses.length > 0 ? totalLoss / losses.length : 0,
    profitFactor: totalLoss > 0 ? totalWin / totalLoss : totalWin > 0 ? Infinity : 0,
    cashBalance,
  };
}

export function getPositions(trades: Trade[]): Map<string, { shares: number; avgCost: number; currentPrice: number }> {
  const positions: Map<string, { shares: number; totalCost: number; lastPrice: number }> = new Map();
  
  for (const trade of trades) {
    const pos = positions.get(trade.symbol) || { shares: 0, totalCost: 0, lastPrice: trade.price };
    
    if (trade.action === 'BUY') {
      const cost = trade.price * trade.shares + trade.fees;
      positions.set(trade.symbol, {
        shares: pos.shares + trade.shares,
        totalCost: pos.totalCost + cost,
        lastPrice: trade.price,
      });
    } else {
      // Revenue calculation for future use
      // const revenue = trade.price * trade.shares - trade.fees;
      const avgCost = pos.shares > 0 ? pos.totalCost / pos.shares : 0;
      const remainingShares = pos.shares - trade.shares;
      
      if (remainingShares > 0) {
        positions.set(trade.symbol, {
          shares: remainingShares,
          totalCost: avgCost * remainingShares,
          lastPrice: trade.price,
        });
      } else {
        positions.delete(trade.symbol);
      }
    }
  }

  const result = new Map();
  for (const [symbol, pos] of positions) {
    result.set(symbol, {
      shares: pos.shares,
      avgCost: pos.shares > 0 ? pos.totalCost / pos.shares : 0,
      currentPrice: pos.lastPrice,
    });
  }
  
  return result;
}