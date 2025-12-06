
import React, { useState } from 'react';
import { SportType, StudySession } from '../types';
import { Trophy, Calendar, Sparkles, Eraser, ImagePlus, Shield, Clock } from 'lucide-react';

interface MatchPanelProps {
  session: StudySession;
  setSession: React.Dispatch<React.SetStateAction<StudySession>>;
  onAutoGenerate: () => void;
  isGenerating: boolean;
}

// Subcomponente para o Avatar do Time
const TeamLogoAvatar: React.FC<{ 
  name: string; 
  url?: string; 
  onChangeUrl: (url: string) => void 
}> = ({ name, url, onChangeUrl }) => {
  const [imgError, setImgError] = useState(false);

  const handlePrompt = () => {
    const newUrl = prompt(`Insira a URL do logo para ${name || 'o time'}:`, url || '');
    if (newUrl !== null) {
      onChangeUrl(newUrl);
      setImgError(false); // Reset error state on new input
    }
  };

  const initials = name
    ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : '?';

  return (
    <div 
      onClick={handlePrompt}
      className="relative group cursor-pointer flex-shrink-0"
      title="Clique para alterar o logo"
    >
      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-slate-800 border-2 border-slate-600 flex items-center justify-center overflow-hidden transition-all group-hover:border-emerald-500 shadow-lg">
        {url && !imgError ? (
          <img 
            src={url} 
            alt={name} 
            className="w-full h-full object-cover" 
            onError={() => setImgError(true)}
            crossOrigin="anonymous" 
          />
        ) : (
          <span className="text-xl md:text-2xl font-bold text-slate-500 group-hover:text-emerald-500 transition-colors">
            {initials}
          </span>
        )}
      </div>
      <div className="absolute -bottom-1 -right-1 bg-slate-700 p-1 rounded-full border border-slate-600 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
        {url && !imgError ? <Shield size={12} /> : <ImagePlus size={12} />}
      </div>
    </div>
  );
};

const MatchPanel: React.FC<MatchPanelProps> = ({ session, setSession, onAutoGenerate, isGenerating }) => {
  
  const handleChange = (field: keyof StudySession, value: string) => {
    setSession(prev => ({ ...prev, [field]: value }));
  };

  // Funções auxiliares para dividir Data e Hora
  const handleDatePartChange = (datePart: string) => {
    // session.date formato esperado: YYYY-MM-DDTHH:mm
    const currentTime = session.date.split('T')[1] || '00:00';
    handleChange('date', `${datePart}T${currentTime}`);
  };

  const handleTimePartChange = (timePart: string) => {
    const currentDate = session.date.split('T')[0] || new Date().toISOString().split('T')[0];
    handleChange('date', `${currentDate}T${timePart}`);
  };

  const handleLocalClear = () => {
    if (session.homeTeam || session.awayTeam || session.league) {
        if (window.confirm('Deseja limpar os campos deste jogo?')) {
            setSession(prev => ({ 
              ...prev, 
              league: '', 
              homeTeam: '', 
              awayTeam: '',
              homeTeamLogo: '',
              awayTeamLogo: '' 
            }));
        }
    }
  };

  const hasData = !!(session.homeTeam || session.awayTeam || session.league);
  
  // Extrair partes para os inputs
  const currentDateValue = session.date.split('T')[0];
  const currentTimeValue = session.date.split('T')[1] || '00:00';

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 h-full flex flex-col shadow-xl">
      <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <Trophy className="text-emerald-500" size={20} />
          <h2 className="text-lg font-bold text-white">1. Configuração do Jogo</h2>
        </div>
        <button 
          onClick={handleLocalClear}
          disabled={!hasData}
          className={`transition-colors p-1.5 rounded-lg ${
            !hasData 
            ? 'text-slate-700 cursor-not-allowed' 
            : 'text-slate-500 hover:text-white hover:bg-slate-800'
          }`}
          title="Limpar campos"
        >
          <Eraser size={16} />
        </button>
      </div>

      <div className="space-y-4 flex-1">
        {/* Sport Selector */}
        <div className="flex bg-slate-800 p-1 rounded-lg">
          <button
            onClick={() => handleChange('sport', SportType.FOOTBALL)}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
              session.sport === SportType.FOOTBALL ? 'bg-slate-700 text-emerald-400 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Futebol
          </button>
          <button
            onClick={() => handleChange('sport', SportType.BASKETBALL)}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
              session.sport === SportType.BASKETBALL ? 'bg-slate-700 text-orange-400 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Basquete
          </button>
        </div>

        {/* League Input */}
        <div>
          <label className="text-xs text-slate-500 font-medium uppercase ml-1">Campeonato / Liga</label>
          <input
            type="text"
            value={session.league}
            onChange={(e) => handleChange('league', e.target.value)}
            placeholder="Ex: Premier League, NBA..."
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
          />
        </div>

        {/* Teams with Logos */}
        <div className="flex flex-col gap-4">
          <label className="text-xs text-slate-500 font-medium uppercase ml-1 -mb-2">Confronto</label>
          
          {/* Home Team */}
          <div className="flex items-center gap-3">
            <TeamLogoAvatar 
              name={session.homeTeam} 
              url={session.homeTeamLogo} 
              onChangeUrl={(url) => handleChange('homeTeamLogo', url)}
            />
            <div className="flex-1">
              <input
                type="text"
                value={session.homeTeam}
                onChange={(e) => handleChange('homeTeam', e.target.value)}
                placeholder="Time da Casa (Mandante)"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-all font-semibold text-lg"
              />
            </div>
          </div>

          <div className="flex items-center justify-center -my-2 opacity-50">
            <span className="text-xs font-bold text-slate-500">VS</span>
          </div>

          {/* Away Team */}
          <div className="flex items-center gap-3 flex-row-reverse md:flex-row">
            <div className="flex-1">
              <input
                type="text"
                value={session.awayTeam}
                onChange={(e) => handleChange('awayTeam', e.target.value)}
                placeholder="Time Visitante"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-all font-semibold text-lg text-right md:text-left"
              />
            </div>
            <TeamLogoAvatar 
              name={session.awayTeam} 
              url={session.awayTeamLogo} 
              onChangeUrl={(url) => handleChange('awayTeamLogo', url)}
            />
          </div>
        </div>

        {/* Date and Time Split Fields */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="text-xs text-slate-500 font-medium uppercase ml-1">Data</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 text-slate-500 pointer-events-none" size={16} />
              <input
                type="date"
                value={currentDateValue}
                onChange={(e) => handleDatePartChange(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-all [color-scheme:dark]"
              />
            </div>
          </div>
          
          <div className="w-1/3 min-w-[120px]">
            <label className="text-xs text-slate-500 font-medium uppercase ml-1">Horário</label>
            <div className="relative">
              <Clock className="absolute left-3 top-3 text-slate-500 pointer-events-none" size={16} />
              <input
                type="time"
                value={currentTimeValue}
                onChange={(e) => handleTimePartChange(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-all [color-scheme:dark]"
              />
            </div>
          </div>
        </div>

      </div>

      <div className="mt-auto pt-4 border-t border-slate-800">
        <button
          onClick={onAutoGenerate}
          disabled={isGenerating || !session.homeTeam || !session.awayTeam}
          className="w-full relative group overflow-hidden bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-lg py-3 px-4 shadow-lg shadow-emerald-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <div className="relative z-10 flex items-center justify-center gap-2">
            {isGenerating ? (
              <>
                <div className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full"></div>
                <span>Analisando e Buscando Logos...</span>
              </>
            ) : (
              <>
                <Sparkles size={18} className="text-yellow-300" />
                <span>Gerar Estudo com IA</span>
              </>
            )}
          </div>
        </button>
      </div>
    </div>
  );
};

export default MatchPanel;
