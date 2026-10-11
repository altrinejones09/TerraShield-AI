import React, { useState } from 'react';
import { Shield, UserPlus, Lock, Mail, Building, User, KeyRound, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SignUpPageProps {
  onNavigate: (view: string) => void;
  onSuccess: () => void;
}

export const SignUpPage: React.FC<SignUpPageProps> = ({ onNavigate, onSuccess }) => {
  const { signup, verifyCode } = useAuth();
  const [step, setStep] = useState<'register' | 'verify'>('register');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      setError('Password must contain at least 8 characters.');
      return;
    }

    setIsSubmitting(true);
    const res = await signup({ name, email, organization, password });
    setIsSubmitting(false);

    if (res.success) {
      if (res.needsVerification) {
        setStep('verify');
      } else {
        onSuccess();
      }
    } else {
      setError(res.error || 'Registration failed.');
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const res = await verifyCode(email, verificationCode);
    setIsSubmitting(false);

    if (res.success) {
      onSuccess();
    } else {
      setError(res.error || 'Verification failed.');
    }
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
          maxWidth: '500px',
          padding: '2.5rem 2rem',
          backgroundColor: '#0c1324',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 20px 45px rgba(0, 0, 0, 0.6)',
        }}
      >
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
            {step === 'register' ? 'Register Analyst Account' : 'Verify Email Address'}
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.25rem' }}>
            {step === 'register'
              ? 'Join the TerraShield Geotechnical Hazard Network'
              : `Enter the 6-digit code sent to ${email}`}
          </p>
        </div>

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

        {step === 'register' ? (
          <form onSubmit={handleRegister}>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.35rem' }}>
                Full Name &amp; Title
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="Dr. Maya Lin, P.E."
                  value={name}
                  onChange={e => setName(e.target.value)}
                  style={{ width: '100%', paddingLeft: '2.4rem' }}
                  required
                />
                <User size={16} color="#64748b" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.35rem' }}>
                Institutional Email
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  placeholder="mlin@usgs.gov"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{ width: '100%', paddingLeft: '2.4rem' }}
                  required
                />
                <Mail size={16} color="#64748b" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.35rem' }}>
                Affiliation / Disaster Agency
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="Geological Survey / Disaster Management Cell"
                  value={organization}
                  onChange={e => setOrganization(e.target.value)}
                  style={{ width: '100%', paddingLeft: '2.4rem' }}
                  required
                />
                <Building size={16} color="#64748b" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.35rem' }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="password"
                    placeholder="Min 8 chars"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    style={{ width: '100%', paddingLeft: '2.4rem' }}
                    required
                  />
                  <Lock size={15} color="#64748b" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.35rem' }}>
                  Confirm
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="password"
                    placeholder="Re-enter"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    style={{ width: '100%', paddingLeft: '2.4rem' }}
                    required
                  />
                  <Lock size={15} color="#64748b" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.8rem', justifyContent: 'center' }}
            >
              <UserPlus size={16} />
              {isSubmitting ? 'Registering...' : 'Complete Registration'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.35rem' }}>
                6-Digit Verification Code
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="e.g. 542198"
                  value={verificationCode}
                  onChange={e => setVerificationCode(e.target.value)}
                  style={{ width: '100%', paddingLeft: '2.4rem', letterSpacing: '0.2em', fontSize: '1.1rem', fontFamily: 'JetBrains Mono' }}
                  required
                />
                <KeyRound size={16} color="#64748b" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
              <span style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.4rem', display: 'block' }}>
                (For demonstration mode, any 6-digit numeric string will verify)
              </span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.8rem', justifyContent: 'center' }}
            >
              <CheckCircle2 size={16} />
              {isSubmitting ? 'Verifying...' : 'Verify &amp; Activate'}
            </button>
          </form>
        )}

        <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.8rem', color: '#94a3b8' }}>
          Already have an analyst account?{' '}
          <button
            onClick={() => onNavigate('signin')}
            style={{ color: '#38bdf8', fontWeight: 600 }}
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};
