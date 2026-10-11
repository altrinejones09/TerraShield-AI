import React, { createContext, useContext, useState } from 'react';
import type { UserProfile } from '../types/telemetry';
import { loadUser, saveUser, DEFAULT_USER } from '../lib/storage';
import { apiClient } from '../lib/apiClient';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  cognitoEnabled: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (details: { email: string; password: string; name: string; organization: string }) => Promise<{ success: boolean; needsVerification?: boolean; error?: string }>;
  verifyCode: (email: string, code: string) => Promise<{ success: boolean; error?: string }>;
  forgotPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  resetPasswordWithCode: (email: string, code: string, newPass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUserPreferences: (prefs: Partial<UserProfile['notificationPreferences']>) => void;
  quickDemoLogin: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const COGNITO_USER_POOL_ID = import.meta.env.VITE_COGNITO_USER_POOL_ID || '';
const SESSION_TOKEN_KEY = 'terrashield_auth_token';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const token = localStorage.getItem(SESSION_TOKEN_KEY);
      if (token) {
        apiClient.setAuthToken(token);
        return loadUser();
      }
    } catch {
      // Fallback if localStorage unavailable
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState(false);
  const cognitoEnabled = Boolean(COGNITO_USER_POOL_ID);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulated or backend auth
      if (!email || !password) {
        return { success: false, error: 'Email and password are required.' };
      }
      if (password.length < 8) {
        return { success: false, error: 'Password must be at least 8 characters long.' };
      }

      // Generate a mock JWT for demo or real Cognito token
      const token = `ts_jwt_${btoa(email)}_${Date.now()}`;
      localStorage.setItem(SESSION_TOKEN_KEY, token);
      apiClient.setAuthToken(token);

      const loggedUser: UserProfile = {
        ...DEFAULT_USER,
        email,
        name: email.split('@')[0].replace('.', ' ').toUpperCase(),
      };
      saveUser(loggedUser);
      setUser(loggedUser);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Login failed.' };
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (details: { email: string; password: string; name: string; organization: string }) => {
    setIsLoading(true);
    try {
      if (!details.email || !details.password || !details.name) {
        return { success: false, error: 'Please fill in all required fields.' };
      }
      if (details.password.length < 8) {
        return { success: false, error: 'Password must contain at least 8 characters.' };
      }

      // In real Cognito, this triggers an SMS/Email verification code
      return { success: true, needsVerification: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Registration failed.' };
    } finally {
      setIsLoading(false);
    }
  };

  const verifyCode = async (email: string, code: string) => {
    if (code.length < 4) {
      return { success: false, error: 'Verification code must be 6 digits.' };
    }
    const token = `ts_jwt_${btoa(email)}_${Date.now()}`;
    localStorage.setItem(SESSION_TOKEN_KEY, token);
    apiClient.setAuthToken(token);

    const verifiedUser: UserProfile = {
      ...DEFAULT_USER,
      email,
      name: email.split('@')[0],
    };
    saveUser(verifiedUser);
    setUser(verifiedUser);
    return { success: true };
  };

  const forgotPassword = async (email: string) => {
    if (!email) {
      return { success: false, error: 'Enter your registered email address.' };
    }
    return { success: true };
  };

  const resetPasswordWithCode = async (email: string, code: string, newPass: string) => {
    if (!code || !newPass) {
      return { success: false, error: 'Enter the verification code and new password.' };
    }
    if (newPass.length < 8) {
      return { success: false, error: 'New password must be at least 8 characters long.' };
    }
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem(SESSION_TOKEN_KEY);
    apiClient.setAuthToken(null);
    setUser(null);
  };

  const updateUserPreferences = (prefs: Partial<UserProfile['notificationPreferences']>) => {
    if (!user) return;
    const updated: UserProfile = {
      ...user,
      notificationPreferences: {
        ...user.notificationPreferences,
        ...prefs,
      },
    };
    setUser(updated);
    saveUser(updated);
  };

  const quickDemoLogin = () => {
    const token = `ts_demo_jwt_${Date.now()}`;
    localStorage.setItem(SESSION_TOKEN_KEY, token);
    apiClient.setAuthToken(token);
    saveUser(DEFAULT_USER);
    setUser(DEFAULT_USER);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        cognitoEnabled,
        login,
        signup,
        verifyCode,
        forgotPassword,
        resetPasswordWithCode,
        logout,
        updateUserPreferences,
        quickDemoLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
