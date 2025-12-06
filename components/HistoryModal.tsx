
import React, { useState } from 'react';
import { SavedSession, SportType } from '../types';
import { X, Calendar, Trophy, Trash2, Upload, Clock, Eye, Newspaper, Target, ChevronUp, ChevronDown } from 'lucide-react';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: SavedSession[];
  onLoad: (item: SavedSession) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

const HistoryModal: React.FC<HistoryModalProps> = ({ 
  isOpen, 
  onClose, 
  history, 
  onLoad, 
  onDelete,
  onClearAll
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleExpand = (id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div 
        className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-500/10 p-2 rounded-lg text-indigo-400">
              <Clock size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Histórico de Estudos</h2>
              <p className="text-sm text-slate-400">Gerencie e visualize suas análises salvas</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {history.length > 0 && (
                <button 
                  onClick={onClearAll}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-red-400 hover:text-white hover:bg-red-500/20 rounded-lg transition-colors border border-red-500/20 hover:border-red-500/50 mr-2"
                >
                  <Trash2 size={14} />
                  Limpar Tudo
                </button>
            )}
            <button 
                onClick={onClose}
                className="text-slate-500 hover:text-white transition-colors p-2 hover:bg-slate-800 rounded-full"
            >
                <X size={24} />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {history.length === 0 ? (
            <div className="text-center py-12 text-slate-500 border-2 border-dashed border-slate-800 rounded-xl m-2">
              <Clock size={48} className="mx-auto mb-4 opacity-20" />
              <p>Nenhum estudo arquivado encontrado.</p>
            </div>
          ) : (
            history.map((item) => {
              const isExpanded = expandedId === item.id;
              
              return (
                <div 
                  key={item.id} 
                  className={`group bg-slate-800/40 border transition-all rounded-xl overflow-hidden ${
                    isExpanded 
                    ? 'border-indigo-500/50 bg-slate-800/80' 
                    : 'border-slate-700/50 hover:bg-slate-800 hover:border-indigo-500/30'
                  }`}
                >
                  {/* Card Main Info */}
                  <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold border shrink-0 ${
                        item.session.sport === SportType.FOOTBALL 
                          ? 'bg-emerald-900/30 border-emerald-500/30 text-emerald-400' 
                          : 'bg-orange-900/30 border-orange-500/30 text-orange-400'
                      }`}>
                        {item.session.sport === SportType.FOOTBALL ? '⚽' : '🏀'}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-white text-base">
                          {item.session.homeTeam} <span className="text-slate-500 text-sm font-normal">vs</span> {item.session.awayTeam}
                        </h3>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400 mt-1">
                          <span className="flex items-center gap-1">
                            <Trophy size={12} /> {item.session.league || 'Sem liga'}
                          </span>
                          <span className="hidden sm:inline w-1 h-1 bg-slate-600 rounded-full"></span>
                          <span className="flex items-center gap-1">
                            <Calendar size={12} /> {new Date(item.savedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 w-full sm:w-auto justify-end border-t sm:border-t-0 border-slate-700/50 pt-3 sm:pt-0 mt-2 sm:mt-0">
                      <button 
                        onClick={() => toggleExpand(item.id)}
                        className={`p-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium ${
                          isExpanded ? 'bg-indigo-500/20 text-indigo-300' : 'text-slate-400 hover:text-white hover:bg-slate-700'
                        }`}
                        title="Visualizar detalhes"
                      >
                        {isExpanded ? <ChevronUp size={18} /> : <Eye size={18} />}
                        <span className="sm:hidden">Detalhes</span>
                      </button>

                      <div className="w-px h-6 bg-slate-700 mx-1 hidden sm:block"></div>

                      <button 
                        onClick={() => onLoad(item)}
                        className="p-2 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 rounded-lg transition-colors"
                        title="Carregar para edição"
                      >
                        <Upload size={18} />
                      </button>
                      <button 
                        onClick={() => onDelete(item.id)}
                        className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Excluir"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Expanded Preview Details */}
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-0 animate-in slide-in-from-top-2 duration-200">
                      <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                        
                        {/* Preview: News */}
                        <div>
                          <h4 className="font-semibold text-blue-400 mb-3 flex items-center gap-2 border-b border-blue-500/20 pb-2">
                            <Newspaper size={14}/> Notícias ({item.news.length})
                          </h4>
                          {item.news.length > 0 ? (
                            <ul className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                              {item.news.map(n => (
                                <li key={n.id} className="text-slate-400 text-xs leading-relaxed pl-2 border-l-2 border-slate-700">
                                  {n.text}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <span className="text-slate-600 text-xs italic">Nenhuma notícia salva.</span>
                          )}
                        </div>

                        {/* Preview: Bets */}
                        <div>
                          <h4 className="font-semibold text-orange-400 mb-3 flex items-center gap-2 border-b border-orange-500/20 pb-2">
                            <Target size={14}/> Picks ({item.bets.length})
                          </h4>
                          {item.bets.length > 0 ? (
                            <ul className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                              {item.bets.map(b => (
                                <li key={b.id} className="bg-slate-900 border border-slate-800 p-2 rounded flex justify-between items-center text-xs">
                                  <span className="text-slate-300 font-medium">{b.market}</span>
                                  <span className="bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-bold">
                                    {b.odds.toFixed(2)}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <span className="text-slate-600 text-xs italic">Nenhuma aposta salva.</span>
                          )}
                        </div>

                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50 text-center text-xs text-slate-500 rounded-b-2xl">
          Use o botão <Upload size={10} className="inline mx-0.5" /> para restaurar o estudo para a mesa principal.
        </div>
      </div>
    </div>
  );
};

export default HistoryModal;
