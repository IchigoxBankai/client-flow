import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_STUDIO } from '../data/initialData';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('clientflow_user');
    if (savedUser) {
      try { return JSON.parse(savedUser); } catch (e) { /* ignore */ }
    }
    return {
      uid: 'user_northstar_01',
      email: 'studio@northstar.creative',
      displayName: 'Nishant Puthran',
      studio: INITIAL_STUDIO
    };
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return Boolean(localStorage.getItem('clientflow_auth') === 'true' || true);
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('clientflow_user', JSON.stringify(currentUser));
      localStorage.setItem('clientflow_auth', 'true');
    }
  }, [currentUser]);

  const login = async (email, password) => {
    setLoading(true);
    // Support instant demo login or custom credentials
    const user = {
      uid: `usr_${Date.now()}`,
      email,
      displayName: email.split('@')[0],
      studio: {
        ...INITIAL_STUDIO,
        ownerName: email.split('@')[0]
      }
    };
    setCurrentUser(user);
    setIsAuthenticated(true);
    setLoading(false);
    return user;
  };

  const signup = async ({ email, password, fullName, studioName, services, currency, title }) => {
    setLoading(true);
    const user = {
      uid: `usr_${Date.now()}`,
      email,
      displayName: fullName,
      studio: {
        id: `std_${Date.now()}`,
        name: studioName || 'My Creative Studio',
        tagline: 'Independent Digital Studio',
        services: services || ['Web Development'],
        currency: currency || '₹',
        ownerName: fullName,
        ownerTitle: title || 'Studio Lead',
        email,
        phone: '',
        isOnboarded: true,
        isDemo: false
      }
    };
    setCurrentUser(user);
    setIsAuthenticated(true);
    setLoading(false);
    return user;
  };

  const updateStudioProfile = (updatedFields) => {
    setCurrentUser(prev => {
      if (!prev) return prev;
      const updated = {
        ...prev,
        studio: {
          ...prev.studio,
          ...updatedFields
        }
      };
      return updated;
    });
  };

  const logout = () => {
    localStorage.removeItem('clientflow_auth');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        studio: currentUser?.studio || INITIAL_STUDIO,
        isAuthenticated,
        loading,
        login,
        signup,
        logout,
        updateStudioProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
