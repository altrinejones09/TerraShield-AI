import React from 'react';
import { Shield, Activity, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onNavigate }) => {
  const { isAuthenticated, user, quickDemoLogin } = useAuth();

  return (
    <header
      style={{
        height: 'var(--header-height)',
        borderBottom: '1px solid var(--border-subtle)',
        backgroundColor: 'rgba(10, 15, 29, 0.85)',
        backdropFilter: 'blur(16px)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 2rem',
        }}
      >
        {/* Brand */}
        <div
          onClick={() => onNavigate('home')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #0284c7 0%, #0d9488 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 10px rgba(14, 165, 233, 0.35)',
            }}
          >
            <Shield size={20} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em' }}>
                TerraShield
              </span>
              <span
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  backgroundColor: 'rgba(14, 165, 233, 0.2)',
                  color: '#38bdf8',
                  padding: '0.1rem 0.35rem',
                  borderRadius: '4px',
                  border: '1px solid rgba(14, 165, 233, 0.3)',
                }}
              >
                AI
              </span>
            </div>
            <span style={{ fontSize: '0.65rem', color: '#64748b', display: 'block', lineHeight: 1 }}>
              Early Warning & Life Safety
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }}>
          {[
            { id: 'home', label: 'Overview' },
            { id: 'problem', label: 'Problem & Solution' },
            { id: 'how-it-works', label: 'How It Works' },
            { id: 'architecture', label: 'Architecture' },
            { id: 'impact', label: 'Environmental Impact' },
            { id: 'methodology', label: 'Methodology & Limits' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              style={{
                fontSize: '0.85rem',
                fontWeight: currentTab === item.id ? 700 : 500,
                color: currentTab === item.id ? '#38bdf8' : '#94a3b8',
                transition: 'color 0.15s ease',
                position: 'relative',
                padding: '0.4rem 0',
              }}
            >
              {item.label}
              {currentTab === item.id && (
                <span
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
                    backgroundColor: '#0ea5e9',
                    borderRadius: '2px',
                  }}
                />
              )}
            </button>
          ))}
        </nav>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {isAuthenticated ? (
            <button
              className="btn btn-primary btn-sm"
              onClick={() => onNavigate('dashboard')}
            >
              <Activity size={15} />
              Open Workspace
            </button>
          ) : (
            <>
              <button
                className="btn btn-secondary btn-sm"
                onClick={quickDemoLogin}
                title="Instant access with demonstration analyst credentials"
              >
                Demo Workspace
              </button>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => onNavigate('signin')}
              >
                <LogIn size={14} />
                Sign In
              </button>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => onNavigate('signup')}
              >
                <UserPlus size={14} />
                Create Account
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
