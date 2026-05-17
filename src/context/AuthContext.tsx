import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { onAuthStateChanged, User, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";

interface AuthContextType {
  user: User | Partial<User> | null;
  isAdmin: boolean;
  loading: boolean;
  login: () => Promise<void>;
  loginWithCredentials: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | Partial<User> | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for custom session first
    const savedUser = localStorage.getItem("vrr_user");
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setUser(parsed);
      setIsAdmin(true);
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          const adminDocRef = doc(db, "admins", firebaseUser.uid);
          const adminDoc = await getDoc(adminDocRef);
          const isHardcodedAdmin = firebaseUser.email?.toLowerCase() === "reniqahi2015@gmail.com";
          
          if (isHardcodedAdmin && !adminDoc.exists()) {
            // Provision the admin document if it doesn't exist
            await setDoc(adminDocRef, {
              email: firebaseUser.email,
              role: "admin",
              assignedAt: new Date().toISOString()
            });
            setIsAdmin(true);
          } else {
            setIsAdmin(adminDoc.exists() || isHardcodedAdmin);
          }
        } catch (err) {
          console.error("Admin check failed:", err);
          const isHardcodedAdmin = firebaseUser.email?.toLowerCase() === "reniqahi2015@gmail.com";
          setIsAdmin(isHardcodedAdmin);
        }
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const loginWithCredentials = async (username: string, password: string) => {
    if (username === "vrr" && password === "Perlavrr555") {
      const customUser = {
        displayName: "Vrr Studio",
        email: "admin@vrr.com",
        uid: "vrr_admin_id"
      };
      setUser(customUser);
      setIsAdmin(true);
      localStorage.setItem("vrr_user", JSON.stringify(customUser));
      return true;
    }
    return false;
  };

  const logout = async () => {
    localStorage.removeItem("vrr_user");
    await signOut(auth);
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, login, loginWithCredentials, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
