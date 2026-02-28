'use client';

import { useEffect } from 'react';
import { useTradeStore } from '@/lib/store';
import { calculateStats, getPositions } from '@/lib/calculations';
import { TrendingUp, TrendingDown, Wallet, Percent, Activity, DollarSign } from 'lucide-react';

export default function Dashboard() {
  const { trades, loadTrades } = useTradeStore();

  useEffect(() => {
    loadTrades();
  }, [loadTrades]);

  const stats = calculateStats(trades);
  const positions = getPositions(trades);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-24">
      {/* Header */}
      <header className="p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">TradeNote</h1>
        <button className="text-slate-400 hover:text-white">
          <Activity size={20} />
        </button>
      </header>

      {/* Portfolio Overview */}
      <section className="px-4 mb-4">
        <div className="bg-slate-900 rounded-xl p-4">
          <div className="text-slate-400 text-sm mb-1">總資產</div>
          <div className="text-3xl font-bold">{formatCurrency(stats.totalValue)}</div>
          <div className="flex items-center mt-2">
            <span className={`text-sm ${stats.totalPnL >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {stats.totalPnL >= 0 ? '+' : ''}{formatCurrency(stats.totalPnL)} ({formatPercent(stats.pnlPercent)})
            </span>
            <span className="text-slate-500 text-xs ml-2">累計</span>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="px-4 mb-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-900 rounded-xl p-4">
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
              <Wallet size={14} /> 現金比例
            </div>
            <div className="text-xl font-bold">
              {stats.totalValue > 0 ? ((stats.cashBalance / stats.totalValue) * 100).toFixed(1) : 0}%
            </div>
            {stats.cashBalance / stats.totalValue > 0.5 && (
              <div className="text-amber-500 text-xs">⚠️ 過高</div>
            )}
          </div>

          <div className="bg-slate-900 rounded-xl p-4">
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
              <Percent size={14} /> 勝率
            </div>
            <div className="text-xl font-bold">{stats.winRate.toFixed(1)}%</div>
            <div className="text-slate-500 text-xs">{stats.totalTrades} 筆交易</div>
          </div>

          <div className="bg-slate-900 rounded-xl p-4">
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
              <DollarSign size={14} /> 平均獲利
            </div>
            <div className="text-xl font-bold text-emerald-400">{formatCurrency(stats.avgWin)}</div>
            <div className="text-slate-500 text-xs">{stats.winningTrades} 勝</div>
          </div>

          <div className="bg-slate-900 rounded-xl p-4">
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
              <DollarSign size={14} /> 平均虧損
            </div>
            <div className="text-xl font-bold text-red-400">{formatCurrency(stats.avgLoss)}</div>
            <div className="text-slate-500 text-xs">{stats.losingTrades} 負</div>
          </div>
        </div>
      </section>

      {/* Positions */}
      {positions.size > 0 && (
        <section className="px-4 mb-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-bold">當前持倉</h2>
            <span className="text-slate-400 text-sm">{positions.size} 檔</span>
          </div>
          <div className="bg-slate-900 rounded-xl p-4">
            {Array.from(positions.entries()).map(([symbol, pos]) => {
              const pnl = (pos.currentPrice - pos.avgCost) * pos.shares;
              const pnlPercent = pos.avgCost > 0 ? (pnl / (pos.avgCost * pos.shares)) * 100 : 0;
              const marketValue = pos.currentPrice * pos.shares;
              
              return (
                <div key={symbol} className="flex justify-between items-center py-3 border-b border-slate-800 last:border-0">
                  <div>
                    <div className="font-bold">{symbol}</div>
                    <div className="text-slate-400 text-sm">{pos.shares} 股 @ ${pos.avgCost.toFixed(2)}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{formatCurrency(marketValue)}</div>
                    <div className={`text-sm ${pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {pnl >= 0 ? '+' : ''}{pnlPercent.toFixed(1)}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Recent Trades */}
      <section className="px-4 mb-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-bold">近期交易</h2>
          <a href="/trades" className="text-slate-400 text-sm">查看全部</a>
        </div>
        <div className="bg-slate-900 rounded-xl p-4">
          {trades.slice(-3).reverse().map((trade) => (
            <div key={trade.id} className="flex justify-between items-center py-3 border-b border-slate-800 last:border-0">
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                  trade.action === 'BUY' ? 'bg-emerald-500/20' : 'bg-red-500/20'
                }`}>
                  {trade.action === 'BUY' ? (
                    <TrendingDown className="text-emerald-400" size={18} />
                  ) : (
                    <TrendingUp className="text-red-400" size={18} />
                  )}
                </div>
                <div>
                  <div className="font-bold">{trade.action === 'BUY' ? '買入' : '賣出'} {trade.symbol}</div>
                  <div className="text-slate-400 text-sm">{new Date(trade.date).toLocaleDateString('zh-TW')}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold">{trade.shares} 股</div>
                <div className="text-slate-400 text-sm">@ ${trade.price.toFixed(2)}</div>
              </div>
            </div>
          ))}
          {trades.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              尚無交易記錄，點擊右下角 + 新增
            </div>
          )}
        </div>
      </section>

      {/* AI Insights */}
      <section className="px-4 mb-24">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-bold">AI 分析</h2>
          <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded">BETA</span>
        </div>
        <div className="bg-slate-900 rounded-xl p-4">
          {stats.cashBalance / stats.totalValue > 0.5 && (
            <div className="flex items-start mb-3">
              <div className="text-amber-400 mt-1 mr-3">⚠️</div>
              <div>
                <div className="font-medium mb-1">現金比例過高</div>
                <div className="text-slate-400 text-sm">建議逐步建倉，將現金比例降至 20-30%</div>
              </div>
            </div>
          )}
          {stats.totalTrades > 10 && stats.winRate < 40 && (
            <div className="flex items-start">
              <div className="text-blue-400 mt-1 mr-3">📊</div>
              <div>
                <div className="font-medium mb-1">交易頻率過高</div>
                <div className="text-slate-400 text-sm">勝率僅 {stats.winRate.toFixed(1)}%，建議減少交易次數，提高勝率</div>
              </div>
            </div>
          )}
          {stats.cashBalance / stats.totalValue <= 0.5 && stats.winRate >= 40 && (
            <div className="flex items-start">
              <div className="text-emerald-400 mt-1 mr-3">✓</div>
              <div>
                <div className="font-medium mb-1">投資組合健康</div>
                <div className="text-slate-400 text-sm">現金比例適中，繼續保持！</div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}