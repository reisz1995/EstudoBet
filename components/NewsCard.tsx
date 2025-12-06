import React, { useState } from 'react';
import { NewsNote } from '../types';
import { Newspaper, Plus, Trash2, Globe, Share2, Check } from 'lucide-react';

interface NewsPanelProps {
  news: NewsNote[];
  setNews: React.Dispatch<React.SetStateAction<NewsNote[]>>;
}

const NewsPanel: React.FC<NewsPanelProps> = ({ news, setNews }) => {
  const [newNote, setNewNote] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const addNote = () => {
    if (!newNote.trim()) return;
    setNews(prev => [...prev, { id: Date.now().toString(), text: newNote, isAiGenerated: false }]);
    setNewNote('');
  };

  const removeNote = (id: string) => {
    setNews(prev => prev.filter(n => n.id !== id));
  };

  const clearAllNews = () => {
    if (news.length > 0 && window.confirm('Deseja limpar todas as notícias?')) {
      setNews([]);
    }
  };

  const handleShare = (id: string, text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }).catch(err => {
      console.error('Falha ao copiar:', err);
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') addNote();
  };

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 h-full flex flex-col shadow-xl">
      <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <Newspaper className="text-blue-400" size={20} />
          <h2 className="text-lg font-bold text-white">2. Notícias e Fatos</h2>
        </div>
        <div className="flex items-center gap-2">
           <span className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-400">{news.length} notas</span>
           <button 
             onClick={clearAllNews}
             disabled={news.length === 0}
             className={`transition-colors p-1 rounded ${
               news.length === 0 
               ? 'text-slate-700 cursor-not-allowed' 
               : 'text-slate-500 hover:text-red-400 hover:bg-red-500/10'
             }`}
             title="Limpar todas as notícias"
           >
             <Trash2 size={16} />
           </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-slate-700 mb-4 min-h-[200px]">
        {news.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-600 border-2 border-dashed border-slate-800 rounded-xl p-6">
            <Newspaper size={32} className="mb-2 opacity-50" />
            <p className="text-sm text-center">Nenhuma notícia registrada.<br/>Use a IA ou adicione manualmente.</p>
          </div>
        ) : (
          news.map((item) => (
            <div key={item.id} className="group bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-blue-500/30 rounded-lg p-3 transition-all">
              <div className="flex justify-between gap-3">
                <p className="text-sm text-slate-300 leading-relaxed">{item.text}</p>
                <div className="flex flex-col gap-2 items-end min-w-[20px]">
                  
                  {/* Share/Copy Button */}
                  <button 
                    onClick={() => handleShare(item.id, item.text)}
                    className={`transition-all ${
                      copiedId === item.id ? 'text-emerald-500' : 'text-slate-600 hover:text-white'
                    }`}
                    title="Copiar notícia"
                  >
                    {copiedId === item.id ? <Check size={14} /> : <Share2 size={14} />}
                  </button>

                  {/* Delete Button */}
                  <button 
                    onClick={() => removeNote(item.id)}
                    className="text-slate-600 hover:text-red-400 transition-all"
                    title="Excluir"
                  >
                    <Trash2 size={14} />
                  </button>

                  {/* AI Indicator */}
                  {item.isAiGenerated && (
                    <div title="Gerado por IA" className="mt-auto">
                      <Globe size={12} className="text-emerald-500/70" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-auto space-y-2 bg-slate-800/50 p-3 rounded-lg border border-slate-700">
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Adicionar fato relevante..."
          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-all resize-none h-20"
        />
        <button 
          onClick={addNote}
          disabled={!newNote.trim()}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-medium rounded-lg py-2 flex items-center justify-center gap-2 transition-colors text-sm"
        >
          <Plus size={16} /> Adicionar Nota
        </button>
      </div>
    </div>
  );
};

export default NewsPanel;