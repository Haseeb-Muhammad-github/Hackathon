import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Layers, Upload, Sun, Moon } from 'lucide-react';
import { generateArchitecture } from './ai';
import { SystemArchitecture } from './types';

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

function useTheme() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('arch_ai_theme');
    return saved ? saved === 'dark' : true;
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    localStorage.setItem('arch_ai_theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  return { isDark, toggle: () => setIsDark(d => !d) };
}

function App() {
  const { isDark, toggle } = useTheme();
  const [activeTopTab, setActiveTopTab] = useState<'Design' | 'History' | 'Export'>('Design');
  const [activeOutputTab, setActiveOutputTab] = useState('Overview');
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [data, setData] = useState<SystemArchitecture | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const readFile = (file: File) => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!['txt', 'md'].includes(ext || '')) {
      setError('Only .txt and .md files are supported.');
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

  // CSS vars shorthand for inline styles
  const v = {
    bg:      'var(--bg)',
    surface: 'var(--surface)',
    surfAlt: 'var(--surface-alt)',
    border:  'var(--border)',
    primary: 'var(--primary)',
    text1:   'var(--text-1)',
    text2:   'var(--text-2)',
    text3:   'var(--text-3)',
    success: 'var(--success)',
    error:   'var(--error)',
  };

  return (
    <div style={{ height: '100vh', width: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', backgroundColor: v.bg, color: v.text1, fontFamily: 'Inter, sans-serif' }}>

      {/* ── Top Navbar ── */}
      <header style={{ height: 52, borderBottom: `1px solid ${v.border}`, backgroundColor: v.surface, display: 'flex', alignItems: 'center', padding: '0 20px', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Layers size={15} color={v.primary} />
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 600, fontSize: 13, color: v.text1 }}>ARCH/AI</span>
          </div>
          <nav style={{ display: 'flex', gap: 2 }}>
            {(['Design', 'History', 'Export'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTopTab(tab)}
                style={{ padding: '5px 12px', fontSize: 13, borderRadius: 4, border: 'none', cursor: 'pointer', backgroundColor: activeTopTab === tab ? v.surfAlt : 'transparent', color: activeTopTab === tab ? v.text1 : v.text3 }}
              >{tab}</button>
            ))}
          </nav>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: v.text3 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: isGenerating ? v.primary : v.success }} />
            {isGenerating ? 'Generating...' : 'Ready'}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggle}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: 6, border: `1px solid ${v.border}`, backgroundColor: v.surfAlt, cursor: 'pointer', color: v.text2 }}
          >
            {isDark ? <Sun size={14} /> : <Moon size={14} />}
          </button>
        </div>
      </header>

      {/* ── Main Content ── */}
      {activeTopTab === 'History' ? (
        <div style={{ flex: 1, overflow: 'auto', padding: 32, backgroundColor: v.bg }}>
          <HistoryTab onReload={(d) => { setData(d); setActiveTopTab('Design'); setActiveOutputTab('Overview'); }} />
        </div>
      ) : activeTopTab === 'Export' ? (
        <div style={{ flex: 1, overflow: 'auto', padding: 32, backgroundColor: v.bg }}>
          <ExportTab data={data} />
        </div>
      ) : (
        <main style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

          {/* Left Panel (35%) */}
          <section style={{ width: '35%', borderRight: `1px solid ${v.border}`, display: 'flex', flexDirection: 'column', backgroundColor: v.surface }}>
            <div style={{ flex: 1, padding: 16, display: 'flex', flexDirection: 'column', gap: 12, overflow: 'hidden' }}>

              {/* Textarea */}
              <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column' }}>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Paste your requirements, SRS, or project idea..."
                  style={{ flex: 1, resize: 'none', outline: 'none', fontSize: 13, fontFamily: 'JetBrains Mono, monospace', padding: '14px 14px 28px', borderRadius: 4, border: `1px solid ${isDragging ? v.primary : v.border}`, backgroundColor: v.surfAlt, color: v.text1, lineHeight: 1.7 }}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                />
                <span style={{ position: 'absolute', bottom: 10, right: 10, fontSize: 10, fontFamily: 'JetBrains Mono, monospace', color: v.text3, pointerEvents: 'none' }}>{input.length} chars</span>
              </div>

              {/* File Upload Zone */}
              <button
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '10px', borderRadius: 4, border: `1px dashed ${isDragging ? v.primary : v.border}`, backgroundColor: isDragging ? `color-mix(in srgb, ${v.primary} 8%, transparent)` : 'transparent', cursor: 'pointer', fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: isDragging ? v.primary : v.text3 }}
              >
                <Upload size={12} />Drop .txt / .md file, or click to browse
              </button>
              <input ref={fileInputRef} type="file" accept=".txt,.md" style={{ display: 'none' }} onChange={(e) => e.target.files?.[0] && readFile(e.target.files[0])} />

              {/* Example Tags */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 11, color: v.text3, fontFamily: 'JetBrains Mono, monospace' }}>Try:</span>
                {['SRS', 'PRD', 'Brief', 'Idea'].map(tag => (
                  <button
                    key={tag}
                    onClick={() => setInput(EXAMPLE_TEXT)}
                    style={{ padding: '4px 8px', fontSize: 11, borderRadius: 3, border: `1px solid ${v.border}`, backgroundColor: v.surfAlt, color: v.text2, cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace' }}
                    onMouseEnter={e => { (e.target as HTMLElement).style.borderColor = v.primary; (e.target as HTMLElement).style.color = v.primary; }}
                    onMouseLeave={e => { (e.target as HTMLElement).style.borderColor = v.border; (e.target as HTMLElement).style.color = v.text2; }}
                  >[{tag}]</button>
                ))}
              </div>

              {/* Error */}
              {error && (
                <div style={{ fontSize: 12, padding: '10px 14px', borderRadius: 4, border: `1px solid ${v.error}30`, backgroundColor: `color-mix(in srgb, ${v.error} 10%, transparent)`, color: v.error }}>{error}</div>
              )}

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !input.trim()}
                style={{ padding: '10px', borderRadius: 4, border: 'none', fontSize: 14, fontWeight: 600, cursor: (!input.trim() || isGenerating) ? 'not-allowed' : 'pointer', backgroundColor: v.primary, color: '#0D0D0D', opacity: (!input.trim() && !isGenerating) ? 0.5 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
              >
                {isGenerating ? (
                  <>
                    <div style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#0D0D0D', animation: 'ping 1s cubic-bezier(0,0,0.2,1) infinite' }} />
                    Generating...
                  </>
                ) : 'Generate Architecture →'}
              </button>
            </div>
          </section>

          {/* Right Panel (65%) */}
          <section style={{ width: '65%', display: 'flex', flexDirection: 'column', backgroundColor: v.bg }}>
            {/* Output Tabs */}
            <div style={{ height: 44, display: 'flex', alignItems: 'center', padding: '0 8px', gap: 2, borderBottom: `1px solid ${v.border}`, backgroundColor: v.surface, flexShrink: 0 }}>
              {OUTPUT_TABS.map(tab => (
                <button
                  key={tab}
                  onClick={() => data && setActiveOutputTab(tab)}
                  disabled={!data}
                  style={{ padding: '5px 12px', fontSize: 12, fontFamily: 'JetBrains Mono, monospace', borderRadius: 4, border: 'none', cursor: !data ? 'not-allowed' : 'pointer', backgroundColor: activeOutputTab === tab && data ? v.surfAlt : 'transparent', color: !data ? v.border : activeOutputTab === tab ? v.primary : v.text3 }}
                >{tab}</button>
              ))}
            </div>

            {/* Output Content */}
            <div style={{ flex: 1, overflow: 'auto', padding: 32, display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
              {isGenerating ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 16, opacity: 0.7 }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {[0, 150, 300].map(delay => (
                      <div key={delay} style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: v.primary, animation: `bounce 1s ease-in-out ${delay}ms infinite` }} />
                    ))}
                  </div>
                  <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: v.primary }}>Synthesizing Architecture...</p>
                </div>
              ) : !data ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center', opacity: 0.2 }}>
                  <Layers size={72} color={v.text2} style={{ marginBottom: 16 }} />
                  <h2 style={{ fontSize: 18, fontWeight: 500, color: v.text1, marginBottom: 8 }}>Your architecture will appear here</h2>
                  <p style={{ fontSize: 13, color: v.text2, maxWidth: 380 }}>Paste your requirements on the left and hit Generate to produce a complete system blueprint.</p>
                </div>
              ) : (
                <div style={{ width: '100%', height: '100%' }}>
                  {activeOutputTab === 'Overview'     && <OverviewTab data={data} />}
                  {activeOutputTab === 'Architecture' && <ArchitectureTab data={data} />}
                  {activeOutputTab === 'Database'     && <DatabaseTab data={data} />}
                  {activeOutputTab === 'API'          && <ApiTab data={data} />}
                  {activeOutputTab === 'Sprints'      && <SprintsTab data={data} />}
                  {activeOutputTab === 'Risks'        && <RisksTab data={data} />}
                </div>
              )}
            </div>
          </section>
        </main>
      )}

      {/* ── Status Bar ── */}
      <footer style={{ height: 28, display: 'flex', alignItems: 'center', padding: '0 16px', justifyContent: 'space-between', borderTop: `1px solid ${v.border}`, backgroundColor: v.surface, fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: v.text3, flexShrink: 0 }}>
        <span>Model: OpenAI gpt-4o · Python FastAPI Agent</span>
        <span>{isGenerating ? '⬤ Processing' : data ? `⬤ ${data.overview.projectName}` : '○ Idle'}</span>
      </footer>
    </div>
  );
}

export default App;
