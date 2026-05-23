import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { onAuthStateChanged, User, signInWithPopup, GoogleAuthProvider, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
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
    // Sync initial state from localStorage if available, but DO NOT stop onAuthStateChanged
    const savedUser = localStorage.getItem("vrr_user");
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setUser(prev => prev || parsed); // Only set if no real user
      if (parsed.uid === "vrr_admin_id") {
        setIsAdmin(true);
      }
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        // Clear simulation once real auth succeeds
        localStorage.removeItem("vrr_user");
        try {
          const adminDocRef = doc(db, "admins", firebaseUser.uid);
          const adminDoc = await getDoc(adminDocRef);
          const adminEmails = ["reniqahi2015@gmail.com", "admin@vrr.com", "admin@valentinavrr.com"];
          const isHardcodedAdmin = firebaseUser.email && adminEmails.includes(firebaseUser.email.toLowerCase());
          
          if (isHardcodedAdmin && !adminDoc.exists()) {
            await setDoc(adminDocRef, {
              email: firebaseUser.email,
              role: "admin",
              assignedAt: new Date().toISOString()
            });
            setIsAdmin(true);
          } else {
            setIsAdmin(adminDoc.exists() || !!isHardcodedAdmin);
          }
        } catch (err) {
          console.error("Admin check failed:", err);
          const adminEmails = ["reniqahi2015@gmail.com", "admin@vrr.com", "admin@valentinavrr.com"];
          const isHardcodedAdmin = firebaseUser.email && adminEmails.includes(firebaseUser.email.toLowerCase());
          setIsAdmin(!!isHardcodedAdmin);
        }
      } else {
        // If not signed in via Firebase, double check if we are in simulation
        const stillInSim = localStorage.getItem("vrr_user");
        if (stillInSim) {
          setUser(JSON.parse(stillInSim));
          setIsAdmin(true);
        } else {
          setUser(null);
          setIsAdmin(false);
        }
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
    // Specifically requested credentials
    if (username === "admin" && password === "valentinavrr02") {
      try {
        // Attempt to login with REAL Firebase Auth to enable live database writes
        const loginEmail = "admin@valentinavrr.com"; 
        let userCredential;
        try {
          userCredential = await signInWithEmailAndPassword(auth, loginEmail, password);
        } catch (err: any) {
          // If the user doesn't exist, try to provision it (if enabled in console)
          if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential' || err.code === 'auth/invalid-email') {
            try {
              userCredential = await createUserWithEmailAndPassword(auth, loginEmail, password);
            } catch (createErr) {
              console.warn("Provisioning failed, falling back to local session:", createErr);
              throw err; 
            }
          } else {
            throw err;
          }
        }

        if (userCredential) {
          setUser(userCredential.user);
          setIsAdmin(true);
          localStorage.removeItem("vrr_user"); 
          return true;
        }
      } catch (err) {
        console.warn("Firebase Auth failed for admin credentials, falling back to local simulation.");
        const customUser = {
          displayName: "Admin Studio",
          email: "admin@valentinavrr.com",
          uid: "vrr_admin_id"
        };
        setUser(customUser);
        setIsAdmin(true);
        localStorage.setItem("vrr_user", JSON.stringify(customUser));
        return true;
      }
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
