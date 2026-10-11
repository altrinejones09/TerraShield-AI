import React, { useState } from 'react';
import { Shield, LogIn, Lock, Mail, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SignInPageProps {
  onNavigate: (view: string) => void;
  onSuccess: () => void;
}

export const SignInPage: React.FC<SignInPageProps> = ({ onNavigate, onSuccess }) => {
  const { login, quickDemoLogin, cognitoEnabled } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const res = await login(email, password);
    setIsSubmitting(false);

    if (res.success) {
      onSuccess();
    } else {
      setError(res.error || 'Failed to authenticate.');
    }
  };

  const handleDemoSignIn = () => {
    quickDemoLogin();
    onSuccess();
  };

  return (
    <div
      style={{
        minHeight: 'calc(100vh - var(--header-height) - 100px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '460px',
          padding: '2.5rem 2rem',
          backgroundColor: '#0c1324',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 20px 45px rgba(0, 0, 0, 0.6)',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #0284c7 0%, #0d9488 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              boxShadow: '0 4px 14px rgba(14, 165, 233, 0.35)',
            }}
          >
            <Shield size={24} color="#ffffff" />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc' }}>
            Analyst Sign In
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.25rem' }}>
            Access geotechnical slope telemetry and hazard monitoring
          </p>
        </div>

        {/* Quick Demo Access Button */}
        <div style={{ marginBottom: '1.75rem' }}>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleDemoSignIn}
            style={{
              width: '100%',
              padding: '0.8rem',
              background: 'linear-gradient(135deg, #0ea5e9 0%, #14b8a6 100%)',
              justifyContent: 'center',
            }}
          >
            <Sparkles size={16} />
            Quick Demo Analyst Sign In
          </button>
          <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0', color: '#64748b' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.08)' }} />
            <span style={{ padding: '0 0.75rem', fontSize: '0.75rem', textTransform: 'uppercase' }}>
              or enter credentials
            </span>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.08)' }} />
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div
            style={{
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid #ef4444',
              color: '#f87171',
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1.25rem',
            }}
          >
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.35rem' }}>
              Work Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                placeholder="analyst@geohazard.gov"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{ width: '100%', paddingLeft: '2.4rem' }}
                required
              />
              <Mail size={16} color="#64748b" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#cbd5e1' }}>
                Password
              </label>
              <button
                type="button"
                onClick={() => onNavigate('forgot-password')}
                style={{ fontSize: '0.75rem', color: '#38bdf8' }}
              >
                Forgot password?
              </button>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{ width: '100%', paddingLeft: '2.4rem' }}
                required
              />
              <Lock size={16} color="#64748b" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-secondary"
            style={{ width: '100%', padding: '0.75rem', justifyContent: 'center' }}
          >
            <LogIn size={16} />
            {isSubmitting ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.8rem', color: '#94a3b8' }}>
          Don't have an analyst account?{' '}
          <button
            onClick={() => onNavigate('signup')}
            style={{ color: '#38bdf8', fontWeight: 600 }}
          >
            Create an Account
          </button>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.7rem', color: '#64748b' }}>
          {cognitoEnabled ? 'Authentication backed by Amazon Cognito User Pool' : 'Safe local demonstration authentication active'}
        </div>
      </div>
    </div>
  );
};
