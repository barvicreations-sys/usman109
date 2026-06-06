'use client';

import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext({ user: null, loading: false });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <AuthContext.Provider value={{ user: null, loading: false }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
