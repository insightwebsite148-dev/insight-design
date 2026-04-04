"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertCircle, RefreshCcw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Runtime Error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center relative overflow-hidden">
      {/* Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-500/5 rounded-full blur-[150px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "circOut" }}
        className="glass p-12 md:p-16 rounded-[40px] border border-red-500/10 max-w-2xl w-full relative z-10"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 12, stiffness: 100, delay: 0.2 }}
          className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-red-500/20"
        >
          <AlertCircle className="w-10 h-10 text-red-500" />
        </motion.div>

        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-gradient">
          System Interrupted
        </h2>
        <p className="text-muted text-lg mb-12 leading-relaxed font-light">
          An unexpected occurrence has paused our digital experience. We're working on restoring the standard of excellence.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => reset()}
            className="group relative flex items-center gap-2 px-8 py-4 bg-primary text-background rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-accent transition-all duration-300 w-full sm:w-auto"
          >
            <RefreshCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
            <span>Try Again</span>
          </button>
          
          <Link
            href="/"
            className="flex items-center gap-2 px-8 py-4 border border-border hover:bg-muted/5 rounded-2xl font-bold uppercase tracking-widest text-[10px] transition-all duration-300 w-full sm:w-auto"
          >
            <Home className="w-4 h-4" />
            <span>Return Home</span>
          </Link>
        </div>
        
        {process.env.NODE_ENV === "development" && (
           <div className="mt-8 p-4 bg-red-500/5 rounded-xl border border-red-500/10 text-left overflow-auto max-h-40">
             <p className="text-[10px] font-mono text-red-400 opacity-70">
               {error.message || "Unknown error occurred"}
             </p>
           </div>
        )}
      </motion.div>

      {/* Modern Grid Background */}
      <div className="absolute inset-0 -z-10 opacity-[0.02] [mask-image:radial-gradient(ellipse_at_center,black,transparent)] pointer-events-none">
        <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)', backgroundSize: '3rem 3rem' }} />
      </div>
    </div>
  );
}
