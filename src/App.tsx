import React, { useState } from 'react';
import { Layers } from 'lucide-react';
import { cn } from './utils';
import { generateArchitecture } from './ai';
import { SystemArchitecture } from './types';

// Components
import { OverviewTab } from './components/OverviewTab';
import { DatabaseTab } from './components/DatabaseTab';
import { ApiTab } from './components/ApiTab';
import { SprintsTab } from './components/SprintsTab';
import { RisksTab } from './components/RisksTab';
import { ArchitectureTab } from './components/ArchitectureTab';

const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' }>(
  ({ className, variant = 'primary', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50",
          "h-9 px-4 py-2",
          variant === 'primary' ? "bg-primary text-[#0D0D0D] hover:bg-primaryHover" : "bg-surfaceAlt text-textPrimary border border-border hover:bg-surface",
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

function App() {
  const [activeTopTab, setActiveTopTab] = useState('Design');
  const [activeOutputTab, setActiveOutputTab] = useState('Overview');
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [data, setData] = useState<SystemArchitecture | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const outputTabs = ['Overview', 'Architecture', 'Database', 'API', 'Sprints', 'Risks'];

  const handleGenerate = async () => {
    if (!input.trim()) return;
    
    setIsGenerating(true);
    setError(null);
    try {
      const result = await generateArchitecture(input);
      setData(result);
      setActiveOutputTab('Overview');
    } catch (err: any) {
      setError(err.message || 'Generation failed. Check your input and try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.metaKey && e.key === 'Enter') {
      handleGenerate();
    }
  };

  return (
    <div className="h-screen w-full flex flex-col bg-background text-textPrimary overflow-hidden">
      <header className="h-14 border-b border-border flex items-center px-4 justify-between shrink-0">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-primary" />
            <span className="font-mono font-semibold tracking-tight">ARCH/AI</span>
          </div>
          <nav className="flex items-center gap-1">
            {['Design', 'History', 'Export'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTopTab(tab)}
                className={cn(
                  "px-3 py-1.5 text-sm rounded-md transition-colors",
                  activeTopTab === tab ? "bg-surfaceAlt text-textPrimary" : "text-textSecondary hover:text-textPrimary hover:bg-surfaceAlt/50"
                )}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Left Panel */}
        <section className="w-[35%] border-r border-border flex flex-col bg-surface/30">
          <div className="flex-1 p-4 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5 flex-1 relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Paste your requirements, SRS, or project idea... (Cmd+Enter to generate)"
                className="flex-1 bg-surfaceAlt border border-border rounded-md p-4 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-textMuted font-mono"
              />
              <div className="absolute bottom-4 right-4 text-xs text-textMuted font-mono">
                {input.length} chars
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-xs">
              <span className="text-textMuted">Try example:</span>
              {['SRS', 'PRD', 'Brief', 'Idea'].map(tag => (
                <button
                  key={tag}
                  className="px-2 py-1 rounded bg-surfaceAlt text-textSecondary hover:text-primary hover:border-primary border border-border transition-colors font-mono"
                  onClick={() => setInput(`Build a real-time collaborative code editor like VS Code online. Users can create rooms, share links, and edit code together. Needs auth, real-time sync, and database for saving files. ${tag}`)}
                >
                  [{tag}]
                </button>
              ))}
            </div>

            {error && (
              <div className="bg-error/10 border border-error/20 text-error text-sm p-3 rounded">
                {error}
              </div>
            )}

            <Button 
              className="w-full text-base font-semibold" 
              onClick={handleGenerate}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#0D0D0D] animate-ping" />
                  Generating...
                </div>
              ) : 'Generate Architecture →'}
            </Button>
          </div>
        </section>

        {/* Right Panel */}
        <section className="w-[65%] flex flex-col bg-surface/10">
          <div className="h-12 border-b border-border flex items-center px-2 gap-1 shrink-0 bg-surface/30">
            {outputTabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveOutputTab(tab)}
                disabled={!data && !isGenerating}
                className={cn(
                  "px-4 py-1.5 text-sm rounded-md transition-colors h-8 flex items-center justify-center",
                  activeOutputTab === tab ? "bg-surfaceAlt text-primary font-medium" : "text-textSecondary hover:text-textPrimary hover:bg-surfaceAlt/50 disabled:opacity-50 disabled:hover:text-textSecondary disabled:hover:bg-transparent"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-auto p-8 flex items-start justify-center">
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center h-full opacity-50">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                <p className="font-mono text-primary text-sm animate-pulse">Synthesizing Architecture...</p>
              </div>
            ) : !data ? (
              <div className="flex flex-col items-center justify-center h-full text-center opacity-30 mt-[-10%]">
                <Layers className="w-24 h-24 mb-4 text-textSecondary" />
                <h2 className="text-xl font-medium text-textPrimary">Your architecture will appear here</h2>
                <p className="text-sm text-textSecondary mt-2 max-w-md">Paste your requirements on the left and hit Generate to produce a complete system blueprint.</p>
              </div>
            ) : (
              <div className="w-full h-full">
                {activeOutputTab === 'Overview' && <OverviewTab data={data} />}
                {activeOutputTab === 'Database' && <DatabaseTab data={data} />}
                {activeOutputTab === 'API' && <ApiTab data={data} />}
                {activeOutputTab === 'Sprints' && <SprintsTab data={data} />}
                {activeOutputTab === 'Risks' && <RisksTab data={data} />}
                {activeOutputTab === 'Architecture' && <ArchitectureTab data={data} />}
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="h-8 border-t border-border flex items-center px-4 justify-between text-xs text-textMuted shrink-0 font-mono">
        <div>Model: OpenAI gpt-4o</div>
        <div>Status: {isGenerating ? 'Processing...' : 'Idle'}</div>
      </footer>
    </div>
  );
}

export default App;
