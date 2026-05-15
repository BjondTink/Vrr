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
  const { loginWithCredentials } = useAuth();
  const navigate = useNavigate();

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
