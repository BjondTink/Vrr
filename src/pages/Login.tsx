import React, { useState } from "react";
import { motion } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Lock, ArrowRight, Loader2, AlertCircle } from "lucide-react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { loginWithCredentials, login } = useAuth();
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    setError("");
    try {
      await login();
      navigate("/admin");
    } catch (err: any) {
      setError(err.message || "Google Login failed");
      setIsSubmitting(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const success = await loginWithCredentials(username, password);
    if (success) {
      navigate("/admin");
    } else {
      setError("Invalid credentials. Access denied.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-studio-bg px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md bg-white p-12 shadow-2xl rounded-2xl border border-black/5"
      >
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-studio-black text-white rounded-full flex items-center justify-center">
            <Lock size={24} />
          </div>
        </div>

        <div className="text-center mb-10">
          <h1 className="font-serif text-3xl mb-2">Studio Authentication</h1>
          <p className="text-[10px] uppercase tracking-[0.4em] text-studio-black/40">Secure Node Access</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-studio-black/40">Username</label>
            <input 
              required
              type="text" 
              value={username} 
              onChange={e => setUsername(e.target.value)}
              className="w-full bg-studio-black/5 border-b border-studio-black/10 py-3 px-4 text-xs tracking-widest outline-none focus:border-studio-black transition-colors"
              placeholder="VRR_USER"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-studio-black/40">Password</label>
            <input 
              required
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-studio-black/5 border-b border-studio-black/10 py-3 px-4 text-xs tracking-widest outline-none focus:border-studio-black transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-red-500 text-[10px] uppercase tracking-widest font-bold bg-red-50 p-3 rounded"
            >
              <AlertCircle size={14} />
              {error}
            </motion.div>
          )}

          <button 
            disabled={isSubmitting}
            className="w-full bg-studio-black text-white py-4 text-[10px] uppercase tracking-[0.3em] font-bold hover:opacity-90 transition-all flex items-center justify-center gap-4 group disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : "Authorize"}
            {!isSubmitting && <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />}
          </button>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-black/5"></div></div>
            <div className="relative flex justify-center text-[8px] uppercase tracking-widest font-bold"><span className="bg-white px-4 text-black/20">Authorized Admins Only</span></div>
          </div>

          <button 
            type="button"
            onClick={handleGoogleLogin}
            disabled={isSubmitting}
            className="w-full bg-white border border-black/10 text-black py-4 text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-black/5 transition-all flex items-center justify-center gap-4 group disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Sign in with Google
          </button>
        </form>

        <div className="mt-8 text-center">
            <Link to="/" className="text-[10px] uppercase tracking-widest text-studio-black/40 hover:text-studio-black transition-colors">
                Return to Homeworld
            </Link>
        </div>
      </motion.div>
    </div>
  );
}
