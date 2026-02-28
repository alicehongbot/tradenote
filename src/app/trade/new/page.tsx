'use client';

import { useState } from 'react';
import { useTradeStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, DollarSign, Hash } from 'lucide-react';

export default function NewTrade() {
  const router = useRouter();
  const { addTrade } = useTradeStore();
  
  const [formData, setFormData] = useState({
    symbol: '',
    action: 'BUY' as 'BUY' | 'SELL',
    shares: '',
    price: '',
    date: new Date().toISOString().split('T')[0],
    fees: '0',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await addTrade({
      symbol: formData.symbol.toUpperCase(),
      action: formData.action,
      shares: parseFloat(formData.shares),
      price: parseFloat(formData.price),
      date: formData.date,
      fees: parseFloat(formData.fees) || 0,
      tags: [],
    });
    
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="p-4 flex items-center gap-4">
        <button onClick={() => router.back()} className="text-slate-400 hover:text-white">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">新增交易</h1>
      </header>

      <form onSubmit={handleSubmit} className="px-4 pb-8">
        <div className="bg-slate-900 rounded-xl p-1 mb-4 flex">
          <button
            type="button"
            onClick={() => setFormData({ ...formData, action: 'BUY' })}
            className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
              formData.action === 'BUY' ? 'bg-emerald-500 text-white' : 'text-slate-400'
            }`}
          >
            買入
          </button>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, action: 'SELL' })}
            className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
              formData.action === 'SELL' ? 'bg-red-500 text-white' : 'text-slate-400'
            }`}
          >
            賣出
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-slate-400 text-sm mb-2">股票代碼</label>
          <div className="bg-slate-900 rounded-xl flex items-center px-4">
            <Hash size={18} className="text-slate-500 mr-3" />
            <input
              type="text"
              value={formData.symbol}
              onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
              placeholder="例如：AAPL"
              className="bg-transparent w-full py-4 outline-none text-white uppercase"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-slate-400 text-sm mb-2">股數</label>
            <input
              type="number"
              value={formData.shares}
              onChange={(e) => setFormData({ ...formData, shares: e.target.value })}
              placeholder="0"
              className="bg-slate-900 rounded-xl w-full py-4 px-4 outline-none text-white"
              required
              min="0"
              step="0.01"
            />
          </div>
          <div>
            <label className="block text-slate-400 text-sm mb-2">價格</label>
            <div className="bg-slate-900 rounded-xl flex items-center px-4">
              <DollarSign size={18} className="text-slate-500 mr-2" />
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="0.00"
                className="bg-transparent w-full py-4 outline-none text-white"
                required
                min="0"
                step="0.01"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-slate-400 text-sm mb-2">日期</label>
            <div className="bg-slate-900 rounded-xl flex items-center px-4">
              <Calendar size={18} className="text-slate-500 mr-3" />
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="bg-transparent w-full py-4 outline-none text-white"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-slate-400 text-sm mb-2">手續費</label>
            <div className="bg-slate-900 rounded-xl flex items-center px-4">
              <DollarSign size={18} className="text-slate-500 mr-2" />
              <input
                type="number"
                value={formData.fees}
                onChange={(e) => setFormData({ ...formData, fees: e.target.value })}
                placeholder="0"
                className="bg-transparent w-full py-4 outline-none text-white"
                min="0"
                step="0.01"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-xl mt-4"
        >
          儲存交易
        </button>
      </form>
    </div>
  );
}