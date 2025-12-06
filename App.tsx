
import React, { useState, useEffect, useRef } from 'react';
import { Layout, Save, CheckCircle, RotateCcw, Archive, History, Image as ImageIcon, Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import MatchPanel from './components/GameCard';
import NewsPanel from './components/NewsCard';
import BetsPanel from './components/AIAnalyst';
import HistoryModal from './components/HistoryModal';
import { SportType, StudySession, NewsNote, BetOpportunity, SavedSession } from './types';
import { generateStudyData } from './services/geminiService';

function App() {
  const DEFAULT_SESSION: StudySession = {
    sport: SportType.FOOTBALL,
    league: '',
    homeTeam: '',
    awayTeam: '',
    homeTeamLogo: '',
    awayTeamLogo: '',
    date: new Date().toISOString().substring(0, 16)
  };

  // State for the three panels
  const [session, setSession] = useState<StudySession>(DEFAULT_SESSION);
  const [news, setNews] = useState<NewsNote[]>([]);
  const [bets, setBets] = useState<BetOpportunity[]>([]);
  
  // App Logic State
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showSaveToast, setShowSaveToast] = useState(false);
  const [showArchiveToast, setShowArchiveToast] = useState(false);
  
  // History State
  const [history, setHistory] = useState<SavedSession[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Ref for Image Capture
  const dashboardRef = useRef<HTMLDivElement>(null);

  // 1. LOAD DATA ON MOUNT
  useEffect(() => {
    // Load current draft
    const savedData = localStorage.getItem('betmaster_studio_data');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.session) setSession(parsed.session);
        if (parsed.news) setNews(parsed.news);
        if (parsed.bets) setBets(parsed.bets);
      } catch (e) {
        console.error("Erro ao carregar rascunho:", e);
      }
    }

    // Load history
    const savedHistory = localStorage.getItem('betmaster_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Erro ao carregar histórico:", e);
      }
    }
  }, []);

  // 2. SAVE DRAFT ON UNLOAD (When user leaves page)
  useEffect(() => {
    const handleBeforeUnload = () => {
      const dataToSave = { session, news, bets };
      localStorage.setItem('betmaster_studio_data', JSON.stringify(dataToSave));
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [session, news, bets]);

  // Sync history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('betmaster_history', JSON.stringify(history));
  }, [history]);

  // 3. ACTIONS
  const handleSaveDraft = () => {
    const dataToSave = { session, news, bets };
    localStorage.setItem('betmaster_studio_data', JSON.stringify(dataToSave));
    setShowSaveToast(true);
    setTimeout(() => setShowSaveToast(false), 2000);
  };

  const handleArchive = () => {
    if (!session.homeTeam || !session.awayTeam) {
      alert("Preencha pelo menos os times para arquivar.");
      return;
    }

    const newEntry: SavedSession = {
      id: Date.now().toString(),
      savedAt: Date.now(),
      session: { ...session },
      news: [...news],
      bets: [...bets]
    };

    setHistory(prev => [newEntry, ...prev]);
    setShowArchiveToast(true);
    setTimeout(() => setShowArchiveToast(false), 2000);
  };

  const handleExportImage = async () => {
    if (!dashboardRef.current) return;
    
    setIsExporting(true);
    const element = dashboardRef.current;
    
    // Armazenar estilos originais para restaurar depois
    const originalHeight = element.style.height;
    const originalOverflow = element.style.overflow;
    
    try {
      // Forçar o elemento a ter altura automática e overflow visível para capturar tudo
      element.style.height = 'auto';
      element.style.overflow = 'visible';

      // Pequeno delay para o navegador renderizar o layout expandido
      await new Promise(resolve => setTimeout(resolve, 100));

      const canvas = await html2canvas(element, {
        backgroundColor: '#0f172a', // Cor de fundo do tema (slate-900)
        scale: 2, // Melhor qualidade (Retina)
        logging: false,
        // CORREÇÃO: Parâmetros essenciais para evitar DOMException/SecurityError
        useCORS: true, // Habilita CORS para imagens/fontes externas
        allowTaint: false, // Impede contaminação do canvas (SecurityError no toDataURL)
        foreignObjectRendering: false, // Desativa renderização instável de objetos estrangeiros
        windowHeight: element.scrollHeight + 100
      });

      const image = canvas.toDataURL("image/png");
      const link = document.createElement('a');
      const filename = `BetMaster-${session.homeTeam || 'Jogo'}-vs-${session.awayTeam || 'Jogo'}.png`;
      link.download = filename;
      link.href = image;
      link.click();
    } catch (error) {
      console.error("Erro ao gerar imagem:", error);
      alert("Não foi possível gerar a imagem. Verifique se há recursos externos bloqueados.");
    } finally {
      // Restaurar estilos
      element.style.height = originalHeight;
      element.style.overflow = originalOverflow;
      setIsExporting(false);
    }
  };

  const handleLoadHistory = (item: SavedSession) => {
    if (window.confirm("Carregar este estudo substituirá os dados atuais da tela. Continuar?")) {
      setSession(item.session);
      setNews(item.news);
      setBets(item.bets);
      setIsHistoryOpen(false);
    }
  };

  const handleDeleteHistory = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este estudo do histórico?")) {
      setHistory(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleClearAllHistory = () => {
    if (window.confirm("ATENÇÃO: Isso apagará TODOS os estudos salvos no histórico. Esta ação não pode ser desfeita. Continuar?")) {
      setHistory([]);
      localStorage.removeItem('betmaster_history');
    }
  };

  const handleClear = () => {
    if (window.confirm("Tem certeza que deseja iniciar um novo estudo? Isso limpará os dados atuais da tela.")) {
      setSession(DEFAULT_SESSION);
      setNews([]);
      setBets([]);
      localStorage.removeItem('betmaster_studio_data');
    }
  };

  const handleAutoGenerate = async () => {
    if (!session.homeTeam || !session.awayTeam) return;

    setIsGenerating(true);
    try {
      const data = await generateStudyData(
        session.sport,
        session.homeTeam,
        session.awayTeam,
        session.league
      );

      if (data) {
        // Atualiza logos se encontrados pela IA e se o campo estiver vazio
        setSession(prev => ({
          ...prev,
          homeTeamLogo: data.homeTeamLogo || prev.homeTeamLogo,
          awayTeamLogo: data.awayTeamLogo || prev.awayTeamLogo
        }));

        if (data.news && Array.isArray(data.news)) {
          const newNews: NewsNote[] = data.news.map((text: string) => ({
            id: Date.now().toString() + Math.random(),
            text,
            isAiGenerated: true
          }));
          setNews(prev => [...prev, ...newNews]);
        }

        if (data.bets && Array.isArray(data.bets)) {
          const newBets: BetOpportunity[] = data.bets.map((bet: any) => ({
            id: Date.now().toString() + Math.random(),
            market: bet.market,
            odds: bet.odds,
            reasoning: bet.reasoning
          }));
          setBets(prev => [...prev, ...newBets]);
        }
      }
    } catch (error) {
      alert("Erro ao gerar estudo com IA. Verifique sua chave API ou tente novamente.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-emerald-500/30 selection:text-emerald-200 flex flex-col">
      
      <HistoryModal 
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onLoad={handleLoadHistory}
        onDelete={handleDeleteHistory}
        onClearAll={handleClearAllHistory}
      />

      {/* Header Compacto */}
      <header className="bg-slate-900 border-b border-slate-800 py-3 px-4 md:px-6 shadow-md z-10">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
          
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
                 <Layout className="text-emerald-500" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight leading-none">BetMaster <span className="text-emerald-400">Studio</span></h1>
                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Mesa de Estudo Esportivo</p>
              </div>
            </div>
            {/* Mobile History Button */}
            <button 
              onClick={() => setIsHistoryOpen(true)}
              className="md:hidden text-slate-400 hover:text-white p-2"
            >
              <History size={24} />
            </button>
          </div>

          <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
             
             {/* Toasts */}
             <div className={`hidden md:flex items-center gap-2 text-emerald-400 text-sm font-medium transition-opacity duration-300 ${showSaveToast ? 'opacity-100' : 'opacity-0'}`}>
                <CheckCircle size={16} />
                <span>Salvo</span>
             </div>
             <div className={`hidden md:flex items-center gap-2 text-indigo-400 text-sm font-medium transition-opacity duration-300 ${showArchiveToast ? 'opacity-100' : 'opacity-0'}`}>
                <Archive size={16} />
                <span>Arquivado</span>
             </div>

             <div className="h-8 w-px bg-slate-700 mx-2 hidden md:block"></div>

             {/* Action Buttons */}
             <button 
              onClick={handleExportImage}
              disabled={isExporting}
              className="flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all text-sm font-medium whitespace-nowrap disabled:opacity-50"
              title="Baixar imagem do estudo"
             >
                {isExporting ? <span className="animate-spin">⌛</span> : <ImageIcon size={18} />}
                <span className="hidden sm:inline">Imagem</span>
             </button>

             <button 
              onClick={() => setIsHistoryOpen(true)}
              className="flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-all text-sm font-medium whitespace-nowrap"
             >
                <History size={18} />
                <span className="hidden sm:inline">Histórico</span>
             </button>

             <button 
              onClick={handleClear}
              className="flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all text-sm font-medium whitespace-nowrap"
             >
                <RotateCcw size={18} />
                <span className="hidden sm:inline">Limpar</span>
             </button>

             <button 
              onClick={handleSaveDraft}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-lg transition-all text-sm font-medium shadow-sm whitespace-nowrap"
             >
                <Save size={18} className="text-blue-400" />
                <span className="hidden lg:inline">Salvar Rascunho</span>
             </button>

             <button 
              onClick={handleArchive}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white rounded-lg transition-all text-sm font-medium shadow-lg shadow-indigo-900/30 whitespace-nowrap"
             >
                <Archive size={18} />
                <span className="hidden lg:inline">Arquivar</span>
             </button>
          </div>

        </div>
      </header>

      {/* Main Grid Layout */}
      <main className="flex-1 p-4 md:p-6 overflow-hidden">
        <div className="max-w-[1600px] mx-auto h-[calc(100vh-140px)] min-h-[600px]">
          {/* O REF é colocado aqui para capturar todo o Grid */}
          <div ref={dashboardRef} className="grid grid-cols-1 md:grid-cols-10 gap-6 h-full overflow-y-auto md:overflow-visible pb-10 md:pb-0 bg-slate-950">
            
            {/* Panel 1: Setup (30%) */}
            <div className="md:col-span-3 h-auto md:h-full">
              <MatchPanel 
                session={session} 
                setSession={setSession} 
                onAutoGenerate={handleAutoGenerate}
                isGenerating={isGenerating}
              />
            </div>

            {/* Panel 2: News (35%) */}
            <div className="md:col-span-4 h-auto md:h-full">
              <NewsPanel 
                news={news} 
                setNews={setNews} 
              />
            </div>

            {/* Panel 3: Bets (35%) */}
            <div className="md:col-span-3 h-auto md:h-full">
              <BetsPanel 
                bets={bets} 
                setBets={setBets} 
              />
            </div>

          </div>
        </div>
      </main>

    </div>
  );
}

export default App;
