import { createContext, useContext, useState, useEffect } from 'react';
import { getMe } from '../lib/api';

const AuthContext = createContext(null);

const ROLE_PROFILES = {
  ADMIN: {
    id: 1,
    email: 'admin@meghanvaya.in',
    full_name: 'Administrator',
    role: 'ADMIN'
  },
  METEOROLOGIST: {
    id: 2,
    email: 'analyst@meghanvaya.in',
    full_name: 'Lead Meteorologist',
    role: 'METEOROLOGIST'
  },
  GOVT_OFFICER: {
    id: 3,
    email: 'officer@meghanvaya.in',
    full_name: 'Disaster Mgmt Officer',
    role: 'GOVT_OFFICER'
  },
  GENERAL_USER: {
    id: 4,
    email: 'user@meghanvaya.in',
    full_name: 'Public Citizen',
    role: 'GENERAL_USER'
  }
};

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch {
        return null;
      }
    }
    return null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token && !user) {
      getMe(token)
        .then(u => {
          setUser(u);
          localStorage.setItem('user', JSON.stringify(u));
        })
        .catch(() => {
          // If token fails validation, clear
          logoutUser();
        });
    }
  }, [token]);

  const loginUser = (newToken, userData = null) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);

    if (userData) {
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } else {
      getMe(newToken)
        .then(u => {
          setUser(u);
          localStorage.setItem('user', JSON.stringify(u));
        })
        .catch(() => {
          // Fallback based on token string if backend offline
          const roleMatch = Object.keys(ROLE_PROFILES).find(r => 
            newToken.toUpperCase().includes(r)
          ) || 'METEOROLOGIST';
          const fallbackProfile = ROLE_PROFILES[roleMatch];
          setUser(fallbackProfile);
          localStorage.setItem('user', JSON.stringify(fallbackProfile));
        });
    }
  };

  const switchRole = (newRole) => {
    const profile = ROLE_PROFILES[newRole] || ROLE_PROFILES.METEOROLOGIST;
    const dummyToken = `demo-${newRole.toLowerCase()}-session-jwt`;
    setToken(dummyToken);
    setUser(profile);
    localStorage.setItem('token', dummyToken);
    localStorage.setItem('user', JSON.stringify(profile));
    return profile;
  };

  const logoutUser = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      loading, 
      loginUser, 
      logoutUser, 
      switchRole,
      isAuthenticated: !!user && !!token 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
