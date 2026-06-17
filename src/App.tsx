import React, { useState, useRef, useCallback } from 'react';
import { Layers, Upload } from 'lucide-react';

import { generateArchitecture } from './ai';
import { SystemArchitecture } from './types';

// Tab Components
import { OverviewTab } from './components/OverviewTab';
import { DatabaseTab } from './components/DatabaseTab';
import { ApiTab } from './components/ApiTab';
import { SprintsTab } from './components/SprintsTab';
import { RisksTab } from './components/RisksTab';
import { ArchitectureTab } from './components/ArchitectureTab';
import { HistoryTab, saveToHistory } from './components/HistoryTab';
import { ExportTab } from './components/ExportTab';

const EXAMPLE_TEXT = `Build an e-commerce platform where sellers can list products, buyers can browse and purchase, with Stripe payments, real-time order notifications, and an admin dashboard. Needs user authentication with roles (buyer, seller, admin), product search, shopping cart, order management, and email notifications via SendGrid.`;

const OUTPUT_TABS = ['Overview', 'Architecture', 'Database', 'API', 'Sprints', 'Risks'];

function App() {
  const [activeTopTab, setActiveTopTab] = useState<'Design' | 'History' | 'Export'>('Design');
  const [activeOutputTab, setActiveOutputTab] = useState('Overview');
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [data, setData] = useState<SystemArchitecture | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ─── Generate ───────────────────────────────────────────
  const handleGenerate = async () => {
    if (!input.trim() || isGenerating) return;
    setIsGenerating(true);
    setError(null);
    try {
      const result = await generateArchitecture(input);
      setData(result);
      saveToHistory(result);
      setActiveOutputTab('Overview');
      setActiveTopTab('Design');
    } catch (err: any) {
      setError(err.message || 'Generation failed. Check your input and try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') handleGenerate();
  };

  // ─── File Upload ────────────────────────────────────────
  const readFile = (file: File) => {
    if (!file) return;
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!['txt', 'md'].includes(ext || '')) {
      setError('Only .txt and .md files are supported. PDF support coming soon.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => setInput(e.target?.result as string || '');
    reader.readAsText(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) readFile(file);
  }, []);

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);

  // ─── History reload ──────────────────────────────────────
  const handleHistoryReload = (reloaded: SystemArchitecture) => {
    setData(reloaded);
    setActiveTopTab('Design');
    setActiveOutputTab('Overview');
  };

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden" style={{ backgroundColor: '#0D0D0D', color: '#F5F5F5', fontFamily: 'Inter, sans-serif' }}>

      {/* ── Top Navbar ── */}
      <header className="h-14 border-b flex items-center px-5 justify-between shrink-0" style={{ borderColor: '#2A2A2A', backgroundColor: '#141414' }}>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4" style={{ color: '#F59E0B' }} />
            <span className="font-mono font-semibold text-sm tracking-tight" style={{ color: '#F5F5F5' }}>ARCH/AI</span>
          </div>
          <nav className="flex items-center gap-1">
            {(['Design', 'History', 'Export'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTopTab(tab)}
                className="px-3 py-1.5 text-sm rounded transition-colors"
                style={{
                  backgroundColor: activeTopTab === tab ? '#1A1A1A' : 'transparent',
                  color: activeTopTab === tab ? '#F5F5F5' : '#525252',
                }}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono" style={{ color: '#525252' }}>
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: isGenerating ? '#F59E0B' : '#10B981' }} />
          {isGenerating ? 'Generating...' : 'Ready'}
        </div>
      </header>

      {/* ── Main Content ── */}
      {activeTopTab === 'History' ? (
        <div className="flex-1 overflow-auto p-8">
          <HistoryTab onReload={handleHistoryReload} />
        </div>
      ) : activeTopTab === 'Export' ? (
        <div className="flex-1 overflow-auto p-8">
          <ExportTab data={data} />
        </div>
      ) : (
        <main className="flex-1 flex overflow-hidden">

          {/* ── Left Panel (35%) ── */}
          <section
            className="w-[35%] flex flex-col"
            style={{ borderRight: '1px solid #2A2A2A' }}
          >
            <div className="flex-1 p-4 flex flex-col gap-3 overflow-hidden">

              {/* Textarea */}
              <div className="relative flex-1 flex flex-col">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Paste your requirements, SRS, or project idea..."
                  className="flex-1 resize-none focus:outline-none text-sm font-mono p-4 pb-8 rounded"
                  style={{
                    backgroundColor: '#1A1A1A',
                    border: `1px solid ${isDragging ? '#F59E0B' : '#2A2A2A'}`,
                    color: '#F5F5F5',
                  }}
                />
                <span
                  className="absolute bottom-3 right-3 text-xs font-mono pointer-events-none"
                  style={{ color: '#525252' }}
                >
                  {input.length} chars
                </span>
              </div>

              {/* File Upload Drop Zone */}
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-2 py-3 rounded cursor-pointer transition-colors text-xs font-mono"
                style={{
                  border: `1px dashed ${isDragging ? '#F59E0B' : '#2A2A2A'}`,
                  backgroundColor: isDragging ? '#F59E0B10' : 'transparent',
                  color: isDragging ? '#F59E0B' : '#525252',
                }}
              >
                <Upload className="w-3.5 h-3.5" />
                Drop .txt or .md file, or click to browse
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.md"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && readFile(e.target.files[0])}
              />

              {/* Example tags */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono" style={{ color: '#525252' }}>Try:</span>
                {['SRS', 'PRD', 'Brief', 'Idea'].map(tag => (
                  <button
                    key={tag}
                    onClick={() => setInput(EXAMPLE_TEXT)}
                    className="px-2 py-1 rounded text-xs font-mono transition-colors"
                    style={{ border: '1px solid #2A2A2A', backgroundColor: '#1A1A1A', color: '#A3A3A3' }}
                    onMouseEnter={e => { (e.target as HTMLElement).style.borderColor = '#F59E0B'; (e.target as HTMLElement).style.color = '#F59E0B'; }}
                    onMouseLeave={e => { (e.target as HTMLElement).style.borderColor = '#2A2A2A'; (e.target as HTMLElement).style.color = '#A3A3A3'; }}
                  >
                    [{tag}]
                  </button>
                ))}
              </div>

              {/* Error */}
              {error && (
                <div className="text-sm px-3 py-2.5 rounded text-xs" style={{ backgroundColor: '#EF444415', border: '1px solid #EF444430', color: '#EF4444' }}>
                  {error}
                </div>
              )}

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !input.trim()}
                className="w-full py-2.5 rounded text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                style={{
                  backgroundColor: isGenerating ? '#D97706' : '#F59E0B',
                  color: '#0D0D0D',
                  opacity: (!input.trim() && !isGenerating) ? 0.5 : 1,
                  cursor: (!input.trim() || isGenerating) ? 'not-allowed' : 'pointer',
                }}
              >
                {isGenerating ? (
                  <>
                    <div className="w-2 h-2 rounded-full bg-[#0D0D0D] animate-ping" />
                    Generating...
                  </>
                ) : 'Generate Architecture →'}
              </button>
            </div>
          </section>

          {/* ── Right Panel (65%) ── */}
          <section className="w-[65%] flex flex-col" style={{ backgroundColor: '#0D0D0D' }}>

            {/* Output Tabs */}
            <div
              className="h-11 flex items-center px-2 gap-0.5 shrink-0"
              style={{ borderBottom: '1px solid #2A2A2A', backgroundColor: '#141414' }}
            >
              {OUTPUT_TABS.map(tab => (
                <button
                  key={tab}
                  onClick={() => data && setActiveOutputTab(tab)}
                  disabled={!data}
                  className="px-3 py-1.5 text-xs rounded transition-colors font-mono"
                  style={{
                    backgroundColor: activeOutputTab === tab && data ? '#1A1A1A' : 'transparent',
                    color: !data ? '#2A2A2A' : activeOutputTab === tab ? '#F59E0B' : '#525252',
                    cursor: !data ? 'not-allowed' : 'pointer',
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Output Content */}
            <div className="flex-1 overflow-auto p-8 flex items-start justify-center">
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 opacity-60">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#F59E0B', animationDelay: '0ms' }} />
                    <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#F59E0B', animationDelay: '150ms' }} />
                    <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#F59E0B', animationDelay: '300ms' }} />
                  </div>
                  <p className="font-mono text-xs" style={{ color: '#F59E0B' }}>Synthesizing Architecture...</p>
                </div>
              ) : !data ? (
                <div className="flex flex-col items-center justify-center h-full text-center" style={{ opacity: 0.2 }}>
                  <Layers className="w-20 h-20 mb-4" style={{ color: '#A3A3A3' }} />
                  <h2 className="text-lg font-medium" style={{ color: '#F5F5F5' }}>Your architecture will appear here</h2>
                  <p className="text-sm mt-2 max-w-md" style={{ color: '#A3A3A3' }}>Paste your requirements on the left and hit Generate.</p>
                </div>
              ) : (
                <div className="w-full h-full">
                  {activeOutputTab === 'Overview'      && <OverviewTab data={data} />}
                  {activeOutputTab === 'Architecture'  && <ArchitectureTab data={data} />}
                  {activeOutputTab === 'Database'      && <DatabaseTab data={data} />}
                  {activeOutputTab === 'API'           && <ApiTab data={data} />}
                  {activeOutputTab === 'Sprints'       && <SprintsTab data={data} />}
                  {activeOutputTab === 'Risks'         && <RisksTab data={data} />}
                </div>
              )}
            </div>
          </section>
        </main>
      )}

      {/* ── Status Bar ── */}
      <footer
        className="h-7 flex items-center px-4 justify-between text-xs font-mono shrink-0"
        style={{ borderTop: '1px solid #2A2A2A', backgroundColor: '#141414', color: '#525252' }}
      >
        <span>Model: OpenAI gpt-4o · Python FastAPI Agent</span>
        <span>{isGenerating ? '⬤ Processing' : data ? `⬤ ${data.overview.projectName}` : '○ Idle'}</span>
      </footer>
    </div>
  );
}

export default App;
