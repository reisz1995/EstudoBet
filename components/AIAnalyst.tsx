
import React, { useState } from 'react';
import { BetOpportunity } from '../types';
import { Target, Plus, Trash2, TrendingUp, Pencil, Check, X } from 'lucide-react';

interface BetsPanelProps {
  bets: BetOpportunity[];
  setBets: React.Dispatch<React.SetStateAction<BetOpportunity[]>>;
}

const BetsPanel: React.FC<BetsPanelProps> = ({ bets, setBets }) => {
  // Estado para adição
  const [market, setMarket] = useState('');
  const [odds, setOdds] = useState('');

  // Estado para edição
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editMarket, setEditMarket] = useState('');
  const [editOdds, setEditOdds] = useState('');
  const [editReasoning, setEditReasoning] = useState('');

  // Funções de Adição
  const addBet = () => {
    if (!market.trim() || !odds) return;
    setBets(prev => [...prev, { 
      id: Date.now().toString(), 
      market, 
      odds: parseFloat(odds),
      reasoning: 'Adicionado manualmente'
    }]);
    setMarket('');
    setOdds('');
  };

  const removeBet = (id: string) => {
    setBets(prev => prev.filter(b => b.id !== id));
  };

  const clearAllBets = () => {
    if (bets.length > 0 && window.confirm('Deseja limpar todas as oportunidades?')) {
      setBets([]);
    }
  };

  // Funções de Edição
  const startEditing = (bet: BetOpportunity) => {
    setEditingId(bet.id);
    setEditMarket(bet.market);
    setEditOdds(bet.odds.toString());
    setEditReasoning(bet.reasoning || '');
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditMarket('');
    setEditOdds('');
    setEditReasoning('');
  };

  const saveEdit = (id: string) => {
    if (!editMarket.trim() || !editOdds) return;

    setBets(prev => prev.map(bet => {
      if (bet.id === id) {
        return {
          ...bet,
          market: editMarket,
          odds: parseFloat(editOdds),
          reasoning: editReasoning
        };
      }
      return bet;
    }));
    setEditingId(null);
  };

  const isValidAdd = market.trim() && odds;

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 h-full flex flex-col shadow-xl">
      <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <Target className="text-orange-400" size={20} />
          <h2 className="text-lg font-bold text-white">3. Melhores Oportunidades</h2>
        </div>
        <div className="flex items-center gap-2">
           <span className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-400">{bets.length} picks</span>
           <button 
             onClick={clearAllBets}
             disabled={bets.length === 0}
             className={`transition-colors p-1 rounded ${
               bets.length === 0 
               ? 'text-slate-700 cursor-not-allowed' 
               : 'text-slate-500 hover:text-red-400 hover:bg-red-500/10'
             }`}
             title="Limpar todas as apostas"
           >
             <Trash2 size={16} />
           </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-slate-700 mb-4 min-h-[200px]">
        {bets.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-600 border-2 border-dashed border-slate-800 rounded-xl p-6">
            <Target size={32} className="mb-2 opacity-50" />
            <p className="text-sm text-center">Nenhuma aposta selecionada.<br/>Adicione oportunidades com valor.</p>
          </div>
        ) : (
          bets.map((bet) => {
            const isEditing = editingId === bet.id;

            if (isEditing) {
              return (
                <div key={bet.id} className="bg-slate-800 border border-orange-500/50 rounded-lg p-3 flex flex-col gap-2 shadow-lg shadow-orange-900/10">
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={editMarket}
                      onChange={(e) => setEditMarket(e.target.value)}
                      className="flex-[2] bg-slate-900 border border-slate-600 rounded px-2 py-1 text-sm text-white focus:border-orange-500 outline-none"
                      placeholder="Mercado"
                    />
                    <input 
                      type="number" 
                      value={editOdds}
                      onChange={(e) => setEditOdds(e.target.value)}
                      className="flex-1 bg-slate-900 border border-slate-600 rounded px-2 py-1 text-sm text-white focus:border-orange-500 outline-none font-bold text-orange-400"
                      placeholder="Odd"
                    />
                  </div>
                  <input 
                      type="text" 
                      value={editReasoning}
                      onChange={(e) => setEditReasoning(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-600 rounded px-2 py-1 text-xs text-slate-300 focus:border-orange-500 outline-none"
                      placeholder="Justificativa (opcional)"
                    />
                  <div className="flex justify-end gap-2 mt-1">
                    <button 
                      onClick={cancelEditing}
                      className="p-1 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors"
                      title="Cancelar"
                    >
                      <X size={16} />
                    </button>
                    <button 
                      onClick={() => saveEdit(bet.id)}
                      className="p-1 text-emerald-400 hover:bg-emerald-500/10 rounded transition-colors"
                      title="Salvar"
                    >
                      <Check size={16} />
                    </button>
                  </div>
                </div>
              );
            }

            // Modo Visualização
            return (
              <div key={bet.id} className="group bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-orange-500/30 rounded-lg p-3 transition-all flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <div>
                     <h3 className="text-emerald-400 font-bold text-lg">{bet.odds.toFixed(2)}</h3>
                     <p className="text-white font-medium text-sm">{bet.market}</p>
                  </div>
                  <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => startEditing(bet)}
                      className="p-1.5 text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 rounded transition-colors"
                      title="Editar"
                    >
                      <Pencil size={14} />
                    </button>
                    <button 
                      onClick={() => removeBet(bet.id)}
                      className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                      title="Excluir"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                {bet.reasoning && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-900/50 px-2 py-1 rounded">
                    <TrendingUp size={10} />
                    {bet.reasoning}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <div className="mt-auto space-y-2 bg-slate-800/50 p-3 rounded-lg border border-slate-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={market}
            onChange={(e) => setMarket(e.target.value)}
            placeholder="Mercado (ex: Over 2.5)"
            className="flex-[2] bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500 transition-all"
          />
           <input
            type="number"
            value={odds}
            onChange={(e) => setOdds(e.target.value)}
            placeholder="Odd"
            className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500 transition-all"
          />
        </div>
        <button 
          onClick={addBet}
          disabled={!isValidAdd}
          className="w-full bg-orange-600 hover:bg-orange-500 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-medium rounded-lg py-2 flex items-center justify-center gap-2 transition-colors text-sm"
        >
          <Plus size={16} /> Adicionar Aposta
        </button>
      </div>
    </div>
  );
};

export default BetsPanel;
