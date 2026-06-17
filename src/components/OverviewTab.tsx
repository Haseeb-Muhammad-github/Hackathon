import React from 'react';
import { SystemArchitecture } from '../types';
import { Activity, Users, Clock } from 'lucide-react';

const TECH_DESCRIPTIONS: Record<string, string> = {
  'React': 'Component-based UI library for building interactive interfaces with a large ecosystem.',
  'Next.js': 'Provides SSR, SSG, and API routes, crucial for SEO and performance.',
  'Vue.js': 'Progressive framework for building user interfaces with gentle learning curve.',
  'Node.js': 'Asynchronous, event-driven runtime for building scalable backend services.',
  'Express.js': 'Minimal and flexible Node.js framework for building RESTful APIs rapidly.',
  'FastAPI': 'High-performance Python web framework with automatic API documentation.',
  'Django': 'Batteries-included Python framework with ORM and admin out of the box.',
  'PostgreSQL': 'Robust relational database known for reliability and data integrity.',
  'MongoDB': 'Document-oriented NoSQL database for flexible, schema-less data.',
  'MySQL': 'Widely-used open-source relational database with strong community support.',
  'Redis': 'In-memory data structure store used as cache, message broker, and queue.',
  'TypeScript': 'Typed superset of JavaScript that catches errors at compile time.',
  'Docker': 'Containerization platform for consistent deployment across environments.',
  'Kubernetes': 'Container orchestration system for automating deployment and scaling.',
  'AWS': 'Comprehensive cloud platform with 200+ services for any workload.',
  'Stripe API': 'PCI-compliant payment processing platform with webhooks and strong security.',
  'GraphQL': 'Query language for APIs enabling clients to request exactly needed data.',
  'Tailwind CSS': 'Utility-first CSS framework for rapid UI development.',
  'Prisma': 'Next-generation ORM for Node.js and TypeScript with type-safe queries.',
};

function getTechDescription(tech: string): string {
  const key = Object.keys(TECH_DESCRIPTIONS).find(k =>
    tech.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(tech.toLowerCase())
  );
  return TECH_DESCRIPTIONS[key || ''] || `Core technology component for the ${tech} stack layer.`;
}

const s = {
  card: { backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 6, padding: '16px' },
  label: { color: 'var(--text-3)', fontSize: 11, fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase' as const, letterSpacing: '0.08em' },
  text1: { color: 'var(--text-1)' },
  text2: { color: 'var(--text-2)' },
  text3: { color: 'var(--text-3)' },
};

export const OverviewTab: React.FC<{ data: SystemArchitecture }> = ({ data }) => {
  const { overview } = data;

  const complexityConfig = {
    Low:    { color: 'var(--success)', bgOpacity: '20',  desc: 'The project has straightforward requirements with minimal integrations and a simple data model.' },
    Medium: { color: 'var(--primary)', bgOpacity: '20',  desc: 'The project has moderate complexity with several integrations and a structured data model.' },
    High:   { color: 'var(--error)',   bgOpacity: '20',  desc: 'The project involves multiple user roles, complex integrations, and stringent non-functional requirements.' },
  }[overview.complexity] || { color: 'var(--text-3)', bgOpacity: '10', desc: '' };

  return (
    <div style={{ width: '100%', maxWidth: 900, display: 'flex', flexDirection: 'column', gap: 28, animation: 'fadeIn 0.3s ease' }}>
      {/* Title */}
      <div>
        <h1 style={{ fontSize: 28, fontWeight: 600, color: 'var(--text-1)', letterSpacing: '-0.02em', marginBottom: 8 }}>{overview.projectName}</h1>
        <p style={{ color: 'var(--text-2)', fontSize: 14, lineHeight: 1.7, maxWidth: 680 }}>{overview.summary}</p>
      </div>

      {/* 3 Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
        {/* Complexity */}
        <div style={s.card}>
          <div style={{ ...s.label, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
            <Activity size={12} /> Complexity
          </div>
          <div style={{ display: 'inline-block', padding: '4px 10px', borderRadius: 4, fontSize: 12, fontWeight: 600, border: `1px solid ${complexityConfig.color}`, color: complexityConfig.color, backgroundColor: `color-mix(in srgb, ${complexityConfig.color} 12%, transparent)`, marginBottom: 10 }}>
            {overview.complexity}
          </div>
          <p style={{ ...s.text3, fontSize: 12, lineHeight: 1.6 }}>{complexityConfig.desc}</p>
        </div>

        {/* Team */}
        <div style={s.card}>
          <div style={{ ...s.label, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
            <Users size={12} /> Team
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontSize: 36, fontWeight: 700, color: 'var(--text-1)', lineHeight: 1 }}>{overview.estimatedTeamSize}</span>
            <span style={{ ...s.text2, fontSize: 14 }}>engineers</span>
          </div>
        </div>

        {/* Timeline */}
        <div style={s.card}>
          <div style={{ ...s.label, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
            <Clock size={12} /> Timeline
          </div>
          <span style={{ fontSize: 22, fontWeight: 600, color: 'var(--text-1)' }}>{overview.estimatedTimeline}</span>
        </div>
      </div>

      {/* Executive Summary */}
      <div style={{ ...s.card, borderLeft: '4px solid var(--primary)' }}>
        <div style={{ ...s.label, marginBottom: 10 }}>Executive Summary</div>
        <p style={{ ...s.text2, fontSize: 14, lineHeight: 1.7 }}>{overview.summary}</p>
      </div>

      {/* Tech Stack */}
      <div>
        <div style={{ ...s.label, marginBottom: 16 }}>Tech Stack</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {overview.techStack.map(tech => (
            <div key={tech} style={s.card}>
              <div style={{ color: 'var(--primary)', fontSize: 14, fontWeight: 500, fontFamily: 'JetBrains Mono, monospace', marginBottom: 6 }}>{tech}</div>
              <p style={{ ...s.text3, fontSize: 12, lineHeight: 1.6 }}>{getTechDescription(tech)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
