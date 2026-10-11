import React, { useState } from 'react';
import { Shield, Activity, LogIn, UserPlus, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onNavigate }) => {
  const { isAuthenticated, quickDemoLogin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Overview' },
    { id: 'problem', label: 'Problem & Solution' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'architecture', label: 'Architecture' },
    { id: 'impact', label: 'Environmental Impact' },
    { id: 'methodology', label: 'Methodology & Limits' },
  ];

  const handleNavClick = (tabId: string) => {
    onNavigate(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header
      style={{
        minHeight: 'var(--header-height)',
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
          height: 'var(--header-height)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1.5rem',
        }}
      >
        {/* Brand */}
        <div
          onClick={() => handleNavClick('home')}
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

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav" aria-label="Main Navigation">
          {navLinks.map(item => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
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

        {/* Desktop CTA Buttons */}
        <div className="desktop-actions">
          {isAuthenticated ? (
            <button
              className="btn btn-primary btn-sm"
              onClick={() => handleNavClick('dashboard')}
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
                onClick={() => handleNavClick('signin')}
              >
                <LogIn size={14} />
                Sign In
              </button>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => handleNavClick('signup')}
              >
                <UserPlus size={14} />
                Create Account
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          className="mobile-nav-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: '#080d1a',
            borderBottom: '1px solid var(--border-subtle)',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {navLinks.map(item => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                style={{
                  textAlign: 'left',
                  fontSize: '0.92rem',
                  fontWeight: currentTab === item.id ? 700 : 500,
                  color: currentTab === item.id ? '#38bdf8' : '#cbd5e1',
                  padding: '0.5rem 0',
                }}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
            {isAuthenticated ? (
              <button
                className="btn btn-primary btn-sm"
                onClick={() => handleNavClick('dashboard')}
                style={{ width: '100%' }}
              >
                <Activity size={15} />
                Open Workspace
              </button>
            ) : (
              <>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    quickDemoLogin();
                    setMobileMenuOpen(false);
                  }}
                  style={{ width: '100%' }}
                >
                  Demo Workspace
                </button>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleNavClick('signin')}
                    style={{ flex: 1 }}
                  >
                    <LogIn size={14} />
                    Sign In
                  </button>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleNavClick('signup')}
                    style={{ flex: 1 }}
                  >
                    <UserPlus size={14} />
                    Register
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
