"use client";

import React, { createContext, useState, useContext, ReactNode } from "react";
import Cookies from 'js-cookie';  // You'll need to install this package

interface LoginContextProps {
  isLoggedIn: boolean;
  username: string;
  isAdmin: boolean;
  userId: number;
  login: (user: string, isAdmin: boolean, userId: number) => void;
  logout: () => void;
}

const LoginContext = createContext<LoginContextProps | undefined>(undefined);

export const useLogin = (): LoginContextProps => {
  const context = useContext(LoginContext);
  if (!context) {
    throw new Error("useLogin must be used within a LoginProvider");
  }
  return context;
};

interface LoginProviderProps {
  children: ReactNode;
}

export const LoginProvider: React.FC<LoginProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    // Check if we're in a browser environment first
    if (typeof window !== 'undefined') {
      // Remove the token check since we're not using it yet
      return Cookies.get("isLoggedIn") === "true";
    }
    return false;
  });

  const [username, setUsername] = useState<string>(() => {
    // Check if we're in a browser environment first
    if (typeof window !== 'undefined') {
      return Cookies.get("username") || "";
    }
    return "";
  });

  const [userId, setUserId] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      return parseInt(Cookies.get("userId") || "0");
    }
    return 0;
  });

  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const adminValue = Cookies.get("isAdmin");
      return adminValue === "true";
    }
    return false;
  });

  const login = (user: string, admin: boolean, id: number) => {
    if (typeof admin !== 'boolean') {
      console.error('Admin parameter must be a boolean');
      return;
    }
    
    setIsLoggedIn(true);
    setUsername(user);
    setIsAdmin(admin);
    setUserId(id);
    
    Cookies.set("isLoggedIn", "true", { 
      secure: true,
      sameSite: 'strict',
      expires: 7
    });
    Cookies.set("username", user, {
      secure: true,
      sameSite: 'strict',
      expires: 7
    });
    Cookies.set("isAdmin", admin ? "true" : "false", {
      secure: true,
      sameSite: 'strict',
      expires: 7
    });
    Cookies.set("userId", id.toString(), {
      secure: true,
      sameSite: 'strict',
      expires: 7
    });
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUsername("");
    setIsAdmin(false);
    setUserId(0);
    Cookies.remove("isLoggedIn");
    Cookies.remove("username");
    Cookies.remove("isAdmin");
    Cookies.remove("userId");
  };

  return (
    <LoginContext.Provider value={{ isLoggedIn, username, isAdmin, userId, login, logout }}>
      {children}
    </LoginContext.Provider>
  );
};
